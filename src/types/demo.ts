export interface DemoRoom {
  id: string;
  name: string;
  betAmount: number;
  maxPlayers: number;
  currentPlayers: number;
  status: 'waiting' | 'full' | 'revealed';
  demoPlayers: DemoPlayer[];
  gameResult?: DemoGameResult;
  isDemo: boolean;
  description: string;
}

export interface DemoPlayer {
  address: string;
  name: string;
  avatar: string;
  encryptedChoice: string;
  revealedChoice?: 'A' | 'B';
  isWinner?: boolean;
  joinTime: number;
}

export interface DemoGameResult {
  totalA: number;
  totalB: number;
  winnerChoice: 'A' | 'B';
  winners: string[];
  prizePerWinner: number;
  revealedAt: number;
}

// 预设的演示房间数据
export const DEMO_ROOMS: DemoRoom[] = [
  {
    id: 'demo-1',
    name: '新手体验房',
    betAmount: 0.1,
    maxPlayers: 9,
    currentPlayers: 9,
    status: 'revealed',
    description: '这是一个已完成的游戏，展示完整的游戏流程和结果',
    demoPlayers: [
      { address: '0x1', name: 'Alice', avatar: '👩', encryptedChoice: 'encrypted_A1', revealedChoice: 'A', isWinner: true, joinTime: Date.now() - 3600000 },
      { address: '0x2', name: 'Bob', avatar: '👨', encryptedChoice: 'encrypted_B1', revealedChoice: 'B', isWinner: false, joinTime: Date.now() - 3500000 },
      { address: '0x3', name: 'Charlie', avatar: '🧑', encryptedChoice: 'encrypted_A2', revealedChoice: 'A', isWinner: true, joinTime: Date.now() - 3400000 },
      { address: '0x4', name: 'Diana', avatar: '👩‍🦰', encryptedChoice: 'encrypted_B2', revealedChoice: 'B', isWinner: false, joinTime: Date.now() - 3300000 },
      { address: '0x5', name: 'Eve', avatar: '👱‍♀️', encryptedChoice: 'encrypted_A3', revealedChoice: 'A', isWinner: true, joinTime: Date.now() - 3200000 },
      { address: '0x6', name: 'Frank', avatar: '👨‍🦱', encryptedChoice: 'encrypted_B3', revealedChoice: 'B', isWinner: false, joinTime: Date.now() - 3100000 },
      { address: '0x7', name: 'Grace', avatar: '👩‍🦳', encryptedChoice: 'encrypted_A4', revealedChoice: 'A', isWinner: true, joinTime: Date.now() - 3000000 },
      { address: '0x8', name: 'Henry', avatar: '👨‍🦳', encryptedChoice: 'encrypted_B4', revealedChoice: 'B', isWinner: false, joinTime: Date.now() - 2900000 },
      { address: '0x9', name: 'Iris', avatar: '👱‍♀️', encryptedChoice: 'encrypted_A5', revealedChoice: 'A', isWinner: true, joinTime: Date.now() - 2800000 },
    ],
    gameResult: {
      totalA: 5,
      totalB: 4,
      winnerChoice: 'B', // B是少数方，获胜
      winners: ['0x2', '0x4', '0x6', '0x8'],
      prizePerWinner: 0.225, // 0.9 / 4
      revealedAt: Date.now() - 2700000,
    },
    isDemo: true,
  },
  {
    id: 'demo-2',
    name: '进行中房间',
    betAmount: 1.0,
    maxPlayers: 9,
    currentPlayers: 6,
    status: 'waiting',
    description: '正在等待玩家加入的房间，展示加密选择过程',
    demoPlayers: [
      { address: '0xa', name: 'Jack', avatar: '🧔', encryptedChoice: 'encrypted_X1', joinTime: Date.now() - 1800000 },
      { address: '0xb', name: 'Kate', avatar: '👩‍🦰', encryptedChoice: 'encrypted_X2', joinTime: Date.now() - 1700000 },
      { address: '0xc', name: 'Leo', avatar: '👨', encryptedChoice: 'encrypted_X3', joinTime: Date.now() - 1600000 },
      { address: '0xd', name: 'Mia', avatar: '👩', encryptedChoice: 'encrypted_X4', joinTime: Date.now() - 1500000 },
      { address: '0xe', name: 'Noah', avatar: '👦', encryptedChoice: 'encrypted_X5', joinTime: Date.now() - 1400000 },
      { address: '0xf', name: 'Olivia', avatar: '👧', encryptedChoice: 'encrypted_X6', joinTime: Date.now() - 1300000 },
    ],
    isDemo: true,
  },
  {
    id: 'demo-3',
    name: '高端房间',
    betAmount: 10.0,
    maxPlayers: 9,
    currentPlayers: 9,
    status: 'full',
    description: '满员房间，可以触发开奖演示',
    demoPlayers: [
      { address: '0x10', name: 'Peter', avatar: '👨‍💼', encryptedChoice: 'encrypted_Y1', joinTime: Date.now() - 900000 },
      { address: '0x11', name: 'Quinn', avatar: '👩‍💼', encryptedChoice: 'encrypted_Y2', joinTime: Date.now() - 850000 },
      { address: '0x12', name: 'Ruby', avatar: '👩‍🎓', encryptedChoice: 'encrypted_Y3', joinTime: Date.now() - 800000 },
      { address: '0x13', name: 'Sam', avatar: '👨‍🎓', encryptedChoice: 'encrypted_Y4', joinTime: Date.now() - 750000 },
      { address: '0x14', name: 'Tina', avatar: '👩‍🔬', encryptedChoice: 'encrypted_Y5', joinTime: Date.now() - 700000 },
      { address: '0x15', name: 'Uma', avatar: '👩‍🏫', encryptedChoice: 'encrypted_Y6', joinTime: Date.now() - 650000 },
      { address: '0x16', name: 'Victor', avatar: '👨‍🏭', encryptedChoice: 'encrypted_Y7', joinTime: Date.now() - 600000 },
      { address: '0x17', name: 'Wendy', avatar: '👩‍🌾', encryptedChoice: 'encrypted_Y8', joinTime: Date.now() - 550000 },
      { address: '0x18', name: 'Xavier', avatar: '👨‍🍳', encryptedChoice: 'encrypted_Y9', joinTime: Date.now() - 500000 },
    ],
    isDemo: true,
  },
];
