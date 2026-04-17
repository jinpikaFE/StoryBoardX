import React from 'react';
import { Check } from 'lucide-react';

interface StepsNavigationProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const steps = [
  { id: 0, title: '创意输入', description: '输入剧情概要' },
  { id: 1, title: '专业配置', description: '设置分镜参数' },
  { id: 2, title: 'AI生成', description: '生成分镜提示词' },
];

export function StepsNavigation({ currentStep, setCurrentStep }: StepsNavigationProps) {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
      {/* 桌面端横向布局 */}
      <div className="hidden sm:flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex items-center">
              <button
                onClick={() => setCurrentStep(step.id)}
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                  transition-all
                  ${currentStep > step.id
                    ? 'bg-green-500 text-white'
                    : currentStep === step.id
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                    : 'bg-gray-200 text-gray-500'
                  }
                `}
              >
                {currentStep > step.id ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.id + 1
                )}
              </button>
              <div className="ml-3">
                <p
                  className={`font-medium text-sm ${
                    currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
            </div>
            
            {index < steps.length - 1 && (
              <div className="flex-1 mx-6">
                <div
                  className={`h-0.5 rounded ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 移动端简化布局 */}
      <div className="sm:hidden">
        <div className="flex items-center justify-center gap-2 mb-3">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => setCurrentStep(step.id)}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs
                  transition-all
                  ${currentStep > step.id
                    ? 'bg-green-500 text-white'
                    : currentStep === step.id
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                    : 'bg-gray-200 text-gray-500'
                  }
                `}
              >
                {currentStep > step.id ? (
                  <Check className="w-4 h-4" />
                ) : (
                  step.id + 1
                )}
              </button>
              
              {index < steps.length - 1 && (
                <div
                  className={`w-8 h-0.5 mx-1 ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <p className="font-medium text-gray-900 text-sm">{steps[currentStep].title}</p>
          <p className="text-xs text-gray-500">{steps[currentStep].description}</p>
        </div>
      </div>
    </div>
  );
}
