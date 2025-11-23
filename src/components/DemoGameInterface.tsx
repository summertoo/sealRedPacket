import React, { useState } from 'react';
import { DEMO_ROOMS, DemoRoom } from '../types/demo';
import DemoRoomCard from './DemoRoomCard';
import InteractiveTutorial from './InteractiveTutorial';
import { Play, BookOpen, Trophy, Users, ArrowLeft } from 'lucide-react';

interface DemoGameInterfaceProps {
  onBack: () => void;
}

export const DemoGameInterface: React.FC<DemoGameInterfaceProps> = ({ onBack }) => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<DemoRoom | null>(null);
  const [tutorialCompleted, setTutorialCompleted] = useState(false);

  const handleViewDetails = (roomId: string) => {
    const room = DEMO_ROOMS.find(r => r.id === roomId);
    if (room) {
      setSelectedRoom(room);
    }
  };

  const handleJoinRoom = (roomId: string) => {
    const room = DEMO_ROOMS.find(r => r.id === roomId);
    if (room) {
      setSelectedRoom(room);
    }
  };

  const handleTutorialComplete = () => {
    setTutorialCompleted(true);
    setShowTutorial(false);
  };

  const handleBackToRooms = () => {
    setSelectedRoom(null);
  };

  if (showTutorial) {
    return (
      <InteractiveTutorial
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
        onComplete={handleTutorialComplete}
      />
    );
  }

  if (selectedRoom) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="w-full max-w-none px-[20%]">
          <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handleBackToRooms}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>返回房间列表</span>
              </button>
              <div className="flex items-center space-x-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <h1 className="text-2xl font-bold text-gray-800">房间详情</h1>
              </div>
              <div className="w-20" /> {/* Spacer for centering */}
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-lg">
              <h2 className="text-xl font-bold mb-2">{selectedRoom.name}</h2>
              <p className="text-blue-100 mb-4">{selectedRoom.description}</p>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{selectedRoom.betAmount} SUI</div>
                  <div className="text-sm text-blue-100">押注金额</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{selectedRoom.currentPlayers}/{selectedRoom.maxPlayers}</div>
                  <div className="text-sm text-blue-100">玩家数量</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{selectedRoom.currentPlayers * selectedRoom.betAmount} SUI</div>
                  <div className="text-sm text-blue-100">奖金池</div>
                </div>
              </div>
            </div>
          </div>

          {/* Players List */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>玩家列表</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedRoom.demoPlayers.map((player, index) => (
                <div
                  key={player.address}
                  className={`border rounded-lg p-4 ${
                    player.isWinner 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{player.avatar}</span>
                      <span className="font-medium">{player.name}</span>
                      {player.isWinner && (
                        <Trophy className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                    <span className="text-sm text-gray-500">#{index + 1}</span>
                  </div>
                  
                  <div className="text-xs text-gray-600 mb-2">
                    {player.address.slice(0, 6)}...{player.address.slice(-4)}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${
                        player.encryptedChoice ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                      <span className="text-xs text-gray-600">
                        {player.encryptedChoice ? '已加密' : '未加密'}
                      </span>
                    </div>
                    
                    {selectedRoom.status === 'revealed' && player.revealedChoice && (
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        player.revealedChoice === 'A' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {player.revealedChoice}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Game Result (if revealed) */}
          {selectedRoom.status === 'revealed' && selectedRoom.gameResult && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span>游戏结果</span>
              </h3>
              
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">选择统计</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">选择 A:</span>
                        <span className="text-sm font-bold text-blue-600">
                          {selectedRoom.gameResult.totalA} 人
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">选择 B:</span>
                        <span className="text-sm font-bold text-purple-600">
                          {selectedRoom.gameResult.totalB} 人
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">获胜信息</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">获胜选项:</span>
                        <span className="text-sm font-bold text-green-600">
                          {selectedRoom.gameResult.winnerChoice}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">获胜人数:</span>
                        <span className="text-sm font-bold text-green-600">
                          {selectedRoom.gameResult.winners.length} 人
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">每人获得:</span>
                        <span className="text-sm font-bold text-yellow-600">
                          {selectedRoom.gameResult.prizePerWinner} SUI
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-yellow-100 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800 text-center">
                    🎉 恭喜获胜者！少数方 {selectedRoom.gameResult.winnerChoice} 赢得了游戏！
                  </p>
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="w-full max-w-none px-[20%]">
        <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>返回主页</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <h1 className="text-2xl font-bold text-gray-800">Seal 红包接龙演示</h1>
            </div>
            
            <button
              onClick={() => setShowTutorial(true)}
              className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>{tutorialCompleted ? '重新学习' : '游戏教程'}</span>
            </button>
          </div>
          
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-lg">
            <p className="text-center text-lg">
              🎮 体验基于 Seal 加密技术的公平游戏 • 9人房间 • 少数获胜 • 完全透明
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">3</div>
            <div className="text-gray-600">演示房间</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">0.1-10</div>
            <div className="text-gray-600">SUI 押注范围</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
            <div className="text-gray-600">透明公平</div>
          </div>
        </div>

        {/* Demo Rooms */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
              <Play className="w-5 h-5 text-blue-600" />
              <span>演示房间</span>
            </h2>
            <div className="text-sm text-gray-600">
              点击房间卡片查看详情或加入游戏
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEMO_ROOMS.map((room) => (
              <DemoRoomCard
                key={room.id}
                room={room}
                onViewDetails={handleViewDetails}
                onJoinRoom={handleJoinRoom}
              />
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">关于演示系统</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">🎯 演示目的</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 展示完整的游戏流程</li>
                <li>• 演示 Seal 加密技术</li>
                <li>• 说明少数获胜机制</li>
                <li>• 提供安全的学习环境</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">🔒 技术特点</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Seal 加密保护选择</li>
                <li>• 完全透明的开奖过程</li>
                <li>• 基于区块链的公平性</li>
                <li>• 无法作弊的游戏机制</li>
              </ul>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default DemoGameInterface;
