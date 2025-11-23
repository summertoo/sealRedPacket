import React, { useState, useEffect } from 'react';
import { ConnectButton, useCurrentAccount, useSuiClientContext } from '@mysten/dapp-kit';
import DemoGameInterface from './components/DemoGameInterface';
import { Play, BookOpen, Trophy, Shield, Users, Sparkles, Zap, Lock, Eye, TrendingUp, Star, Coins, Crown, Flame, ArrowRight, Gamepad2, Gift, Target, Dice6 } from 'lucide-react';

type ViewType = 'home' | 'demo' | 'wallet';

function App() {
  const currentAccount = useCurrentAccount();
  const { network } = useSuiClientContext();
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const renderContent = () => {
    switch (currentView) {
      case 'demo':
        return <DemoGameInterface onBack={() => setCurrentView('home')} />;
      case 'wallet':
        return <WalletView onBack={() => setCurrentView('home')} />;
      default:
        return <HomeView currentAccount={currentAccount} network={network} onViewChange={setCurrentView} mounted={mounted} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 overflow-hidden">
      {/* Light Game Background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-gray-50/95 to-white/95"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-red-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-orange-200/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-yellow-200/15 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        <div className="absolute inset-0 bg-grid-red-100/[0.3] bg-[size:30px_30px]"></div>
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-red-300/30 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      </div>
      
      <div className="relative z-10">
        {renderContent()}
      </div>
    </div>
  );
}

interface HomeViewProps {
  currentAccount: any;
  network: string;
  onViewChange: (view: ViewType) => void;
  mounted: boolean;
}

const HomeView: React.FC<HomeViewProps> = ({ currentAccount, network, onViewChange, mounted }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Game Header */}
      <header className={`relative z-20 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="w-full max-w-none px-[20%] py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center animate-pulse">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">🎮 Seal 红包接龙</h1>
                <p className="text-gray-700 text-xs font-medium">公平游戏 • 赢取大奖</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-green-500/20 backdrop-blur-sm rounded-full border border-green-400/30">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-300 text-xs font-bold">
                  {network === 'testnet' ? '🧪 测试网' : '🌐 主网'}
                </span>
              </div>
              <ConnectButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Game Content */}
      <main className="flex-1 flex items-center justify-center py-8">
        <div className="w-full max-w-none px-[20%]">
          <div className="max-w-3xl mx-auto">
          {/* Hero Game Section */}
          <div className={`text-center mb-8 transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-500/30 to-yellow-500/30 backdrop-blur-sm border-2 border-yellow-400/50 px-6 py-3 rounded-full text-yellow-200 text-sm font-bold mb-6 animate-bounce">
              <Flame className="w-4 h-4" />
              <span>🔥 限时活动进行中 • 奖金翻倍</span>
              <Flame className="w-4 h-4" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4 leading-tight">
              <span className="block mb-2 text-gray-700">🎯 瞄准</span>
              <span className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent animate-pulse">
                少数胜利
              </span>
            </h1>
            
            <p className="text-lg text-gray-800 mb-8 max-w-2xl mx-auto font-medium">
              🎰 9人房间 • 🎲 心理博弈 • 💰 公平开奖 • 🏆 赢取SUI
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => onViewChange('demo')}
                className="group relative overflow-hidden bg-gradient-to-r from-yellow-400 to-red-500 text-black px-8 py-4 rounded-xl font-black text-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-yellow-400/50 animate-pulse"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <Dice6 className="w-6 h-6" />
                  <span>🎮 立即开玩</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              
              <button
                onClick={() => onViewChange('wallet')}
                className="group bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:bg-white/30 hover:border-white/50 hover:scale-105"
              >
                <span className="flex items-center space-x-2">
                  <Coins className="w-5 h-5" />
                  <span>💰 钱包</span>
                </span>
              </button>
            </div>
          </div>

          {/* Live Stats Dashboard */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 transition-all duration-1000 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {[
              { icon: Users, label: '在线玩家', value: '2,847', color: 'from-blue-400 to-blue-600', bg: 'bg-blue-500/20' },
              { icon: Trophy, label: '奖池', value: '15.2K SUI', color: 'from-yellow-400 to-orange-500', bg: 'bg-yellow-500/20' },
              { icon: Target, label: '胜率', value: '44.4%', color: 'from-green-400 to-green-600', bg: 'bg-green-500/20' },
              { icon: Zap, label: '今日游戏', value: '1,234', color: 'from-purple-400 to-purple-600', bg: 'bg-purple-500/20' }
            ].map((stat, index) => (
              <div
                key={index}
                className={`group relative ${stat.bg} backdrop-blur-sm border-2 border-white/20 rounded-xl p-4 transition-all duration-300 hover:scale-105 hover:border-white/40`}
              >
                <div className="relative z-10 text-center">
                  <div className={`inline-flex p-2 rounded-lg bg-gradient-to-r ${stat.color} mb-2`}>
                    <stat.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-xl font-black text-white mb-1">{stat.value}</div>
                  <div className="text-xs text-yellow-200 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Game Features Cards */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 transition-all duration-1000 delay-600 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {[
              {
                icon: Lock,
                title: '🔒 绝对公平',
                description: 'Seal加密技术保证无人作弊',
                gradient: 'from-purple-500 to-pink-500',
                highlight: '100%透明'
              },
              {
                icon: Users,
                title: '👥 少数获胜',
                description: '选择少数方分享奖金池',
                gradient: 'from-blue-500 to-cyan-500',
                highlight: '策略游戏'
              },
              {
                icon: Gift,
                title: '🎁 即时开奖',
                description: '区块链验证公平开奖',
                gradient: 'from-green-500 to-emerald-500',
                highlight: '秒到账'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:border-white/40 hover:shadow-xl"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-300`}></div>
                <div className="relative z-10">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-yellow-100 text-sm mb-3">{feature.description}</p>
                  <div className="inline-block px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full">
                    <span className="text-black text-xs font-bold">{feature.highlight}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Game Guide */}
          <div className={`bg-gradient-to-r from-red-500/20 to-yellow-500/20 backdrop-blur-sm border-2 border-yellow-400/30 rounded-2xl p-8 transition-all duration-1000 delay-800 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-white mb-2">🎮 游戏攻略</h2>
              <p className="text-yellow-200 font-medium">四步成为赢家</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { step: '1️⃣', title: '加入房间', desc: '选择房间押注', icon: '🎰' },
                { step: '2️⃣', title: '秘密选择', desc: '加密你的选择', icon: '🔒' },
                { step: '3️⃣', title: '等待开奖', desc: '等待其他玩家', icon: '⏰' },
                { step: '4️⃣', title: '赢得奖金', desc: '少数方获胜', icon: '🏆' }
              ].map((item, index) => (
                <div key={index} className="text-center group">
                  <div className="relative mb-3">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-r from-yellow-400 to-red-500 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center text-black font-black text-xs">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-xs text-yellow-200">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          </div>
        </div>
      </main>

      {/* Game Footer */}
      <footer className="relative z-20 border-t border-white/20">
        <div className="w-full max-w-none px-[20%] py-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Target className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-200 font-bold">© 2025 Seal 红包接龙</span>
              <Target className="w-4 h-4 text-yellow-400" />
            </div>
            <p className="text-yellow-300 text-sm font-medium">🎮 公平游戏 • 💰 透明开奖 • 🏆 赢取SUI</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface WalletViewProps {
  onBack: () => void;
}

const WalletView: React.FC<WalletViewProps> = ({ onBack }) => {
  const currentAccount = useCurrentAccount();
  const { network } = useSuiClientContext();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex flex-col">
      {/* Light Dynamic Background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-gray-50/95 to-white/95"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-red-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-orange-200/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-yellow-200/15 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        <div className="absolute inset-0 bg-grid-red-100/[0.3] bg-[size:30px_30px]"></div>
      </div>

      {/* Header */}
      <header className="relative z-20 border-b border-white/20">
        <div className="w-full max-w-none px-[20%] py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-800 hover:text-gray-600 transition-colors font-medium"
            >
              <Target className="w-5 h-5" />
              <span>🎮 返回游戏</span>
            </button>
            <h1 className="text-2xl font-black text-gray-900">💰 钱包中心</h1>
            <div className="w-20" /> {/* Spacer */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-8">
        <div className="w-full max-w-none px-[20%]">
          <div className="max-w-3xl mx-auto">
          {currentAccount ? (
            <div className="space-y-8">
              {/* Wallet Info Card */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-8">
                <div className="flex items-center space-x-6 mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center animate-pulse">
                    <Coins className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white mb-2">💎 钱包信息</h2>
                    <p className="text-yellow-200 font-medium">管理你的游戏资产</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    <p className="text-yellow-200 text-sm font-bold mb-3">🏠 钱包地址</p>
                    <p className="text-white font-mono text-sm break-all">{currentAccount.address}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-green-500/20 backdrop-blur-sm rounded-2xl p-6 border border-green-400/30">
                      <p className="text-green-200 text-sm font-bold mb-3">✅ 连接状态</p>
                      <p className="text-green-300 font-black text-lg">已连接</p>
                    </div>
                    <div className="bg-blue-500/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/30">
                      <p className="text-blue-200 text-sm font-bold mb-3">🌐 网络</p>
                      <p className="text-blue-300 font-black text-lg">{network === 'testnet' ? '🧪 测试网' : '🌐 主网'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Game Features */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-8">
                <h2 className="text-3xl font-black text-white mb-8">🎮 游戏功能</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { title: '🎁 创建红包', desc: '创建新的游戏房间', emoji: '🎰', color: 'from-purple-500 to-pink-500' },
                    { title: '🎯 加入游戏', desc: '参与其他玩家的游戏', emoji: '🎲', color: 'from-blue-500 to-cyan-500' },
                    { title: '📊 我的记录', desc: '查看游戏历史记录', emoji: '📈', color: 'from-green-500 to-emerald-500' },
                    { title: '💎 奖金统计', desc: '查看收益统计', emoji: '💰', color: 'from-yellow-400 to-orange-500' }
                  ].map((item, index) => (
                    <button
                      key={index}
                      className={`group bg-gradient-to-r ${item.color} p-6 rounded-2xl text-left transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 border-white/20`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl">{item.emoji}</span>
                        <h3 className="text-white font-black text-xl">{item.title}</h3>
                      </div>
                      <p className="text-white/90 font-medium">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-12 max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-8 animate-pulse">
                  <Coins className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-4xl font-black text-white mb-6">🔗 连接钱包</h2>
                <p className="text-yellow-200 mb-10 text-lg font-medium">连接钱包开始游戏赢取SUI</p>
                <div className="flex justify-center">
                  <ConnectButton />
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
