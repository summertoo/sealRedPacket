# Seal RedPacket Smart Contract

基于Sui Move语言的红包接龙智能合约。

## 合约功能

### 核心结构体

- **RedPacket**: 红包结构体，包含红包的基本信息
- **RedPacketRecord**: 红包记录，用于追踪抢红包历史
- **GameStatistics**: 游戏统计信息

### 主要函数

#### `create_red_packet`
创建一个新的红包
```move
public fun create_red_packet(
    creator: address,
    total_amount: u64,
    packet_count: u64,
    message: String,
    ctx: &mut TxContext
): RedPacket
```

#### `grab_red_packet`
抢红包
```move
public fun grab_red_packet(
    red_packet: &mut RedPacket,
    grabber: address,
    ctx: &mut TxContext
): u64
```

#### `get_red_packet_info`
获取红包信息
```move
public fun get_red_packet_info(
    red_packet: &RedPacket
): (address, u64, u64, u64, String, u8, u64)
```

#### `get_game_statistics`
获取游戏统计
```move
public fun get_game_statistics(
    red_packet: &RedPacket
): (u64, u64, u64, u64)
```

## 错误码

- `E_INSUFFICIENT_BALANCE`: 余额不足
- `E_ALREADY_CLAIMED`: 已经抢过红包
- `E_RED_PACKET_EXPIRED`: 红包已过期
- `E_RED_PACKET_EMPTY`: 红包已抢完
- `E_INVALID_AMOUNT`: 无效金额
- `E_INVALID_COUNT`: 无效数量

## 随机算法

使用基于时间戳和参与者的伪随机算法确保公平性：

```move
let random_seed = tx_context::epoch_timestamp_ms(ctx) + tx_context::digest(ctx);
let random_index = ((random_seed + (grabber as u64)) % remaining_count) as u64;
```

## 部署

### 1. 编译合约
```bash
sui move build
```

### 2. 发布合约
```bash
sui client publish --gas-budget 1000000000
```

### 3. 记录包ID
部署成功后，记录输出的包ID，用于前端集成。

## 测试

### 运行单元测试
```bash
sui move test
```

### 测试用例
- 创建红包测试
- 抢红包测试
- 边界条件测试
- 错误处理测试

## 安全考虑

1. **重入攻击防护**: 使用Sui的对象模型天然防护
2. **整数溢出**: Move语言内置溢出检查
3. **权限控制**: 通过所有权模型实现
4. **随机性**: 基于区块链数据的伪随机

## 升级

Sui Move合约支持升级，但需要：
1. 保持向后兼容性
2. 重新发布新版本
3. 迁移现有数据

## 监控

建议监控以下指标：
- 红包创建数量
- 抢红包成功率
- 平均抢红包金额
- 合约调用频率

## 许可证

MIT License
