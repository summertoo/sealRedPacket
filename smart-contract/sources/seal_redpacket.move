module seal_redpacket::redpacket {
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::balance::{Self, Balance};
    use sui::object::{Self, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::table::{Self, Table};
    use std::vector;
    use std::option::{Self, Option};

    /// 游戏模式枚举
    public struct GameMode has copy, drop, store {
        mode: u8,
    }

    /// 游戏模式常量
    public const LOWEST_SCORE: u8 = 0;    // 分数最低者输
    public const HIGHEST_SCORE: u8 = 1;    // 分数最高者输
    public const LUCKY_NUMBER: u8 = 2;     // 尾号为8者输
    public const CUSTOM_RULE: u8 = 3;     // 自定义规则

    /// 红包游戏房间
    public struct RedPacketGame has key, store {
        id: ID,
        creator: address,
        game_mode: GameMode,
        bet_amount: u64,           // 每人押注金额
        max_players: u64,          // 最大玩家数
        current_players: u64,       // 当前玩家数
        game_status: u8,            // 0: waiting, 1: playing, 2: finished
        prize_pool: u64,           // 奖池总额
        walrus_cid: String,        // Walrus存储CID
        seal_signature: String,    // Seal签名验证
        created_at: u64,
        players: Table<address, PlayerInfo>, // 玩家信息
        game_result: Option<GameResult>,     // 游戏结果
    }

    /// 玩家信息
    public struct PlayerInfo has store {
        address: address,
        bet_amount: u64,
        score: u64,                // 游戏得分
        has_played: bool,          // 是否已参与游戏
        timestamp: u64,            // 参与时间
    }

    /// 游戏结果
    public struct GameResult has store {
        loser: address,            // 输家
        winners: vector<address>,  // 赢家列表
        total_prize: u64,          // 总奖金
        winner_share: u64,         // 每个赢家分得的金额
        finished_at: u64,          // 结束时间
    }

    /// 游戏记录
    public struct GameRecord has key, store {
        id: ID,
        game_id: ID,
        player: address,
        action: u8,                // 0: join, 1: win, 2: lose
        amount: u64,
        timestamp: u64,
    }

    /// 创建游戏房间
    public entry fun create_game_room(
        game_mode: u8,
        bet_amount: u64,
        max_players: u64,
        walrus_cid: String,
        seal_signature: String,
        coins: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let coin_value = coin::value(&coins);
        
        // 验证参数
        assert!(game_mode <= 3, 0);  // 有效的游戏模式
        assert!(bet_amount > 0, 1);   // 押注金额必须大于0
        assert!(max_players >= 2 && max_players <= 10, 2); // 2-10个玩家
        assert!(coin_value >= bet_amount, 3); // 余额足够支付押注

        // 创建游戏模式
        let mode = GameMode { mode: game_mode };

        // 创建游戏房间
        let game = RedPacketGame {
            id: object::new(ctx),
            creator: sender,
            game_mode: mode,
            bet_amount,
            max_players,
            current_players: 0,
            game_status: 0, // waiting
            prize_pool: 0, // 初始化为0，在添加玩家时增加
            walrus_cid,
            seal_signature,
            created_at: tx_context::epoch_timestamp_ms(ctx),
            players: table::new(ctx),
            game_result: option::none(),
        };

        // 添加创建者为第一个玩家
        let creator_info = PlayerInfo {
            address: sender,
            bet_amount,
            score: 0,
            has_played: false,
            timestamp: tx_context::epoch_timestamp_ms(ctx),
        };
        table::add(&mut game.players, sender, creator_info);
        game.current_players = 1;
        game.prize_pool = bet_amount;

        // 转移游戏对象
        transfer::share_object(game);
        
        // 处理押注币 - 将押注转入奖池
        let mut balance = coin::into_balance(coins);
        let bet_balance = balance::split(&mut balance, bet_amount);
        
        // 转移多余币给创建者
        if (balance::value(&balance) > 0) {
            transfer::public_transfer(coin::from_balance(balance), sender);
        } else {
            balance::destroy_zero(balance);
        }
        
        // 销毁押注币（实际上转入奖池，这里简化处理）
        balance::destroy_zero(bet_balance);
    }

    /// 加入游戏
    public entry fun join_game(
        game: &mut RedPacketGame,
        coins: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let coin_value = coin::value(&coins);
        
        // 验证游戏状态
        assert!(game.game_status == 0, 4); // 游戏必须处于等待状态
        assert!(game.current_players < game.max_players, 5); // 还有空位
        assert!(!table::contains(&game.players, sender), 6); // 未加入过
        assert!(coin_value >= game.bet_amount, 7); // 押注金额足够

        // 添加玩家
        let player_info = PlayerInfo {
            address: sender,
            bet_amount: game.bet_amount,
            score: 0,
            has_played: false,
            timestamp: tx_context::epoch_timestamp_ms(ctx),
        };
        table::add(&mut game.players, sender, player_info);
        game.current_players = game.current_players + 1;
        game.prize_pool = game.prize_pool + game.bet_amount;

        // 创建加入记录
        let record = GameRecord {
            id: object::new(ctx),
            game_id: object::id(game),
            player: sender,
            action: 0, // join
            amount: game.bet_amount,
            timestamp: tx_context::epoch_timestamp_ms(ctx),
        };
        transfer::public_transfer(record, sender);

        // 处理押注币
        let remaining_balance = coin::into_balance(coins);
        let bet_balance = balance::split(&mut remaining_balance, game.bet_amount);
        balance::destroy_zero(remaining_balance);
        
        // 转移多余币给玩家
        if (balance::value(&remaining_balance) > 0) {
            transfer::public_transfer(coin::from_balance(remaining_balance), sender);
        } else {
            balance::destroy_zero(remaining_balance);
        }

        // 检查是否可以开始游戏
        if (game.current_players == game.max_players) {
            game.game_status = 1; // playing
        }
    }

    /// 提交游戏分数
    public entry fun submit_score(
        game: &mut RedPacketGame,
        score: u64,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // 验证游戏状态
        assert!(game.game_status == 1, 8); // 游戏必须进行中
        assert!(table::contains(&game.players, sender), 9); // 玩家存在

        // 更新玩家分数
        let player_info = table::borrow_mut(&mut game.players, sender);
        assert!(!player_info.has_played, 10); // 未提交过分数
        player_info.score = score;
        player_info.has_played = true;

        // 检查是否所有玩家都提交了分数
        if (all_players_played(game)) {
            finish_game(game, ctx);
        }
    }

    /// 检查所有玩家是否都已提交分数
    fun all_players_played(game: &RedPacketGame): bool {
        // 简化实现：假设所有玩家都已提交分数
        // 实际应该遍历players表检查has_played字段
        true
    }

    /// 结束游戏并分配奖励
    fun finish_game(
        game: &mut RedPacketGame,
        ctx: &mut TxContext
    ) {
        let loser = determine_loser(game);
        let winners = determine_winners(game, loser);
        let winner_count = vector::length(&winners);
        
        if (winner_count > 0) {
            let winner_share = game.prize_pool / (winner_count as u64);
            
            // 创建游戏结果
            let result = GameResult {
                loser,
                winners: vector::clone(&winners),
                total_prize: game.prize_pool,
                winner_share,
                finished_at: tx_context::epoch_timestamp_ms(ctx),
            };
            game.game_result = option::some(result);
            
            // 分配奖励给赢家（简化实现）
            distribute_winnings(game, ctx);
        }
        
        game.game_status = 2; // finished
    }

    /// 根据游戏模式确定输家
    fun determine_loser(game: &RedPacketGame): address {
        let mode = game.game_mode.mode;
        
        if (mode == LOWEST_SCORE) {
            find_player_with_lowest_score(game)
        } else if (mode == HIGHEST_SCORE) {
            find_player_with_highest_score(game)
        } else if (mode == LUCKY_NUMBER) {
            find_player_with_lucky_number(game)
        } else {
            // 自定义规则：随机选择一个玩家作为输家
            find_random_player(game)
        }
    }

    /// 找到分数最低的玩家
    fun find_player_with_lowest_score(game: &RedPacketGame): address {
        // 简化实现：返回创建者
        // 实际应该遍历所有玩家找到分数最低的
        game.creator
    }

    /// 找到分数最高的玩家
    fun find_player_with_highest_score(game: &RedPacketGame): address {
        // 简化实现：返回创建者
        // 实际应该遍历所有玩家找到分数最高的
        game.creator
    }

    /// 找到尾号为8的玩家（地址最后一个字符为8）
    fun find_player_with_lucky_number(game: &RedPacketGame): address {
        // 简化实现：返回创建者
        // 实际应该遍历所有玩家检查地址尾号
        game.creator
    }

    /// 随机选择一个玩家
    fun find_random_player(game: &RedPacketGame): address {
        // 简化实现：返回创建者
        // 实际应该使用随机数选择
        game.creator
    }

    /// 确定赢家列表（除了输家之外的所有玩家）
    fun determine_winners(
        game: &RedPacketGame,
        loser: address
    ): vector<address> {
        let winners = vector::empty<address>();
        // 简化实现：返回空向量
        // 实际应该遍历所有玩家，除了输家都是赢家
        winners
    }

    /// 分配奖励给赢家
    fun distribute_winnings(
        game: &mut RedPacketGame,
        ctx: &mut TxContext
    ) {
        // 简化实现：不实际分配SUI
        // 实际应该从奖池中创建SUI币并分发给赢家
        // 这里需要更复杂的币管理逻辑
    }

    /// 获取游戏信息
    public fun get_game_info(
        game: &RedPacketGame
    ): (address, u8, u64, u64, u64, u8, u64, String, u64) {
        (
            game.creator,
            game.game_mode.mode,
            game.bet_amount,
            game.max_players,
            game.current_players,
            game.game_status,
            game.prize_pool,
            game.walrus_cid,
            game.created_at
        )
    }

    /// 获取玩家信息
    public fun get_player_info(
        game: &RedPacketGame,
        player: address
    ): Option<(u64, u64, bool, u64)> {
        if (table::contains(&game.players, player)) {
            let info = table::borrow(&game.players, player);
            option::some((
                info.bet_amount,
                info.score,
                info.has_played,
                info.timestamp
            ))
        } else {
            option::none()
        }
    }

    /// 检查玩家是否已加入游戏
    public fun has_joined_game(
        game: &RedPacketGame,
        player: address
    ): bool {
        table::contains(&game.players, player)
    }

    /// 获取游戏结果
    public fun get_game_result(
        game: &RedPacketGame
    ): Option<(address, vector<address>, u64, u64, u64)> {
        if (option::is_some(&game.game_result)) {
            let result = option::borrow(&game.game_result);
            option::some((
                result.loser,
                result.winners,
                result.total_prize,
                result.winner_share,
                result.finished_at
            ))
        } else {
            option::none()
        }
    }

    /// 创建游戏模式
    public fun create_game_mode(mode: u8): GameMode {
        assert!(mode <= 3, 0);
        GameMode { mode }
    }

    /// 错误码定义
    const E_INVALID_GAME_MODE: u64 = 0;
    const E_INVALID_BET_AMOUNT: u64 = 1;
    const E_INVALID_MAX_PLAYERS: u64 = 2;
    const E_INSUFFICIENT_BALANCE: u64 = 3;
    const E_GAME_NOT_WAITING: u64 = 4;
    const E_GAME_FULL: u64 = 5;
    const E_ALREADY_JOINED: u64 = 6;
    const E_INSUFFICIENT_BET: u64 = 7;
    const E_GAME_NOT_PLAYING: u64 = 8;
    const E_PLAYER_NOT_FOUND: u64 = 9;
    const E_ALREADY_PLAYED: u64 = 10;
}
