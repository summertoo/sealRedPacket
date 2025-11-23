import React from 'react';
import { DemoRoom, DemoPlayer } from '../types/demo';
import { Users, Trophy, Clock, Eye, Shield, CheckCircle, AlertCircle } from 'lucide-react';

interface DemoRoomCardProps {
  room: DemoRoom;
  onViewDetails: (roomId: string) => void;
  onJoinRoom: (roomId: string) => void;
}

export const DemoRoomCard: React.FC<DemoRoomCardProps> = ({
  room,
  onViewDetails,
  onJoinRoom
}) => {
  const getStatusColor = (status: DemoRoom['status']) => {
    switch (status) {
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800';
      case 'full':
        return 'bg-blue-100 text-blue-800';
      case 'revealed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: DemoRoom['status']) => {
    switch (status) {
      case 'waiting':
        return '等待玩家';
      case 'full':
        return '房间已满';
      case 'revealed':
        return '已开奖';
      default:
        return '未知状态';
    }
  };

  const getStatusIcon = (status: DemoRoom['status']) => {
    switch (status) {
      case 'waiting':
        return <Clock className="w-4 h-4" />;
      case 'full':
        return <Users className="w-4 h-4" />;
      case 'revealed':
        return <Trophy className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    return `${Math.floor(hours / 24)}天前`;
  };

  const getChoiceDistribution = (players: DemoPlayer[]) => {
    const choices = { A: 0, B: 0 };
    players.forEach(player => {
      if (player.revealedChoice) {
        choices[player.revealedChoice]++;
      }
    });
    return choices;
  };

  const choiceDistribution = getChoiceDistribution(room.demoPlayers);
  const totalChoices = choiceDistribution.A + choiceDistribution.B;
  const choiceAPercentage = totalChoices > 0 ? (choiceDistribution.A / totalChoices) * 100 : 50;
  const choiceBPercentage = totalChoices > 0 ? (choiceDistribution.B / totalChoices) * 100 : 50;

  // 计算奖金池
  const prizePool = room.currentPlayers * room.betAmount;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-bold">{room.name}</h3>
            <p className="text-blue-100 text-sm">房间 ID: {room.id}</p>
          </div>
          <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${getStatusColor(room.status)}`}>
            {getStatusIcon(room.status)}
            <span className="text-white font-medium">{getStatusText(room.status)}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span className="text-sm">{room.currentPlayers}/{room.maxPlayers}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Trophy className="w-4 h-4" />
              <span className="text-sm">{room.betAmount} SUI</span>
            </div>
          </div>
          <div className="text-sm text-blue-100">
            演示房间
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Description */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">{room.description}</p>
        </div>

        {/* Prize Pool */}
        <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-yellow-800">奖金池</span>
            <span className="text-lg font-bold text-yellow-900">{prizePool} SUI</span>
          </div>
        </div>

        {/* Choice Distribution (if revealed) */}
        {room.status === 'revealed' && totalChoices > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">选择分布</span>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <Shield className="w-3 h-3" />
                <span>Seal 加密保护</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium w-8">A</span>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${choiceAPercentage}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                    {choiceDistribution.A} 人 ({choiceAPercentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium w-8">B</span>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                  <div 
                    className="bg-purple-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${choiceBPercentage}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                    {choiceDistribution.B} 人 ({choiceBPercentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Game Result (if revealed) */}
        {room.status === 'revealed' && room.gameResult && (
          <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">游戏结果</span>
            </div>
            <div className="text-sm text-green-700">
              <p>获胜选项: <span className="font-bold">{room.gameResult.winnerChoice}</span></p>
              <p>获胜人数: <span className="font-bold">{room.gameResult.winners.length}</span></p>
              <p>每人获得: <span className="font-bold">{room.gameResult.prizePerWinner} SUI</span></p>
            </div>
          </div>
        )}

        {/* Players Preview */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">玩家列表</span>
            {room.demoPlayers.length > 3 && (
              <span className="text-xs text-gray-500">显示前3名</span>
            )}
          </div>
          <div className="space-y-1">
            {room.demoPlayers.slice(0, 3).map((player, index) => (
              <div key={player.address} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">#{index + 1}</span>
                  <span className="text-lg">{player.avatar}</span>
                  <span className="font-medium">{player.name}</span>
                  {player.encryptedChoice && (
                    <Shield className="w-3 h-3 text-green-500" title="已加密" />
                  )}
                </div>
                {player.revealedChoice && room.status === 'revealed' && (
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    player.revealedChoice === 'A' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {player.revealedChoice}
                  </span>
                )}
              </div>
            ))}
            {room.demoPlayers.length > 3 && (
              <div className="text-xs text-gray-500 text-center pt-1">
                还有 {room.demoPlayers.length - 3} 名玩家...
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={() => onViewDetails(room.id)}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
          >
            查看详情
          </button>
          {room.status === 'waiting' && room.currentPlayers < room.maxPlayers && (
            <button
              onClick={() => onJoinRoom(room.id)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium text-sm"
            >
              加入房间
            </button>
          )}
          {room.status === 'full' && (
            <button
              disabled
              className="flex-1 bg-gray-100 text-gray-400 py-2 px-4 rounded-lg cursor-not-allowed font-medium text-sm"
            >
              房间已满
            </button>
          )}
          {room.status === 'revealed' && (
            <button
              onClick={() => onViewDetails(room.id)}
              className="flex-1 bg-green-100 text-green-700 py-2 px-4 rounded-lg hover:bg-green-200 transition-colors font-medium text-sm"
            >
              查看结果
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoRoomCard;
