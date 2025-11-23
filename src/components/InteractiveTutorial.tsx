import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Shield, Users, Trophy } from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  content: string;
  icon: React.ReactNode;
  action?: {
    text: string;
    onClick: () => void;
  };
}

interface InteractiveTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export const InteractiveTutorial: React.FC<InteractiveTutorialProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const steps: TutorialStep[] = [
    {
      id: 'welcome',
      title: '欢迎来到 Seal 红包接龙',
      content: '这是一个基于 Sui 区块链和 Seal 加密技术的公平游戏。9名玩家押注 SUI，选择 A 或 B，少数方获胜所有奖金！',
      icon: <Trophy className="w-8 h-8 text-yellow-500" />
    },
    {
      id: 'how-to-play',
      title: '游戏规则',
      content: '1. 加入房间并押注 SUI\n2. 秘密选择 A 或 B（使用 Seal 加密）\n3. 等待所有玩家完成选择\n4. 公开解密，少数方获胜\n5. 赢家平分奖金池',
      icon: <Play className="w-8 h-8 text-blue-500" />
    },
    {
      id: 'encryption',
      title: 'Seal 加密保护',
      content: '你的选择使用 Seal 技术加密，确保：\n• 完全匿名 - 没人知道你选了什么\n• 公平透明 - 所有加密数据可验证\n• 无法作弊 - 选择后无法更改',
      icon: <Shield className="w-8 h-8 text-green-500" />
    },
    {
      id: 'strategy',
      title: '获胜策略',
      content: '这是心理博弈！\n• 观察其他玩家的行为模式\n• 避免随大流 - 少数方才能赢\n• 保持冷静，做出独立判断\n• 记住：4-5人选择同一方时，另一方获胜',
      icon: <Users className="w-8 h-8 text-purple-500" />
    },
    {
      id: 'demo',
      title: '体验演示房间',
      content: '现在你可以体验演示房间，了解完整的游戏流程。演示使用模拟数据，让你安全学习游戏机制。',
      icon: <Play className="w-8 h-8 text-orange-500" />,
      action: {
        text: '开始演示',
        onClick: () => {
          setIsCompleted(true);
          onComplete?.();
          onClose();
        }
      }
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
      onComplete?.();
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setIsCompleted(true);
    onComplete?.();
    onClose();
  };

  if (!isOpen) return null;

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-3">
              {currentStepData.icon}
              <h2 className="text-xl font-bold">{currentStepData.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Progress */}
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-2 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-white'
                    : index < currentStep
                    ? 'bg-white bg-opacity-60'
                    : 'bg-white bg-opacity-30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {currentStepData.content}
            </p>
          </div>

          {/* Action Button */}
          {currentStepData.action && (
            <button
              onClick={currentStepData.action.onClick}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 mb-4"
            >
              {currentStepData.action.text}
            </button>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                currentStep === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>上一步</span>
            </button>

            <span className="text-sm text-gray-500">
              {currentStep + 1} / {steps.length}
            </span>

            <button
              onClick={handleNext}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span>{currentStep === steps.length - 1 ? '完成' : '下一步'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Skip Button */}
          {currentStep < steps.length - 1 && (
            <div className="mt-4 text-center">
              <button
                onClick={handleSkip}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                跳过教程
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveTutorial;
