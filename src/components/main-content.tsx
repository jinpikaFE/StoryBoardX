

import React from 'react';
import { StoryboardConfig } from '@/types';
import { StepsNavigation } from './steps-navigation';
import { BriefInput } from './brief-input';
import { BasicParams } from './basic-params';
import { VisualStyle } from './visual-style';
import { NarrativePace } from './narrative-pace';
import { DialogueConfig } from './dialogue-config';
import { UsageTips } from './usage-tips';
import { FrameUpload } from './frame-upload';
import { Sparkles, Cpu } from 'lucide-react';

interface MainContentProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  config: StoryboardConfig;
  setConfig: React.Dispatch<React.SetStateAction<StoryboardConfig>>;
  onGenerate: () => void;
}

const availableModels = [
  { id: 'doubao-seed-1-8-251228', name: '豆包 1.8', desc: '多模态Agent优化（推荐）' },
  { id: 'doubao-seed-2-0-pro-260215', name: '豆包 2.0 Pro', desc: '旗舰模型，复杂推理' },
  { id: 'doubao-seed-2-0-lite-260215', name: '豆包 2.0 Lite', desc: '均衡性能，内容创作' },
  { id: 'doubao-seed-2-0-mini-260215', name: '豆包 2.0 Mini', desc: '快速响应，轻量任务' },
  { id: 'doubao-seed-1-6-thinking-250715', name: '豆包 1.6 Thinking', desc: '深度思考模型' },
  { id: 'deepseek-v3-2-251201', name: 'DeepSeek V3.2', desc: '高级推理' },
  { id: 'deepseek-r1-250528', name: 'DeepSeek R1', desc: '研究分析' },
  { id: 'glm-4-7-251222', name: 'GLM-4-7', desc: '通用模型' },
  { id: 'kimi-k2-5-260127', name: 'Kimi K2.5', desc: '长文本，多模态' },
];

export function MainContent({
  currentStep,
  setCurrentStep,
  config,
  setConfig,
  onGenerate,
}: MainContentProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">分镜提示词设计</h2>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            输入一句话剧情，AI自动生成电影级专业分镜语言
          </p>
        </div>

        {/* 步骤导航 */}
        <StepsNavigation currentStep={currentStep} setCurrentStep={setCurrentStep} />

        {/* 大模型选择 */}
        <div className="mt-6 bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-900">大模型选择</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {availableModels.map((model) => (
              <button
                key={model.id}
                onClick={() => setConfig({ ...config, model: model.id })}
                className={`
                  p-3 rounded-lg border-2 transition-all text-left
                  ${config.model === model.id
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div
                  className={`font-medium text-sm ${
                    config.model === model.id ? 'text-orange-600' : 'text-gray-900'
                  }`}
                >
                  {model.name}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{model.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 创意简报 */}
        <div className="mt-6">
          <BriefInput
            brief={config.brief}
            setBrief={(brief) => setConfig({ ...config, brief })}
          />
        </div>

        {/* 首尾帧上传 */}
        <div className="mt-6">
          <FrameUpload
            startFrame={config.startFrame}
            endFrame={config.endFrame}
            startFrameDesc={config.startFrameDesc}
            endFrameDesc={config.endFrameDesc}
            setStartFrame={(startFrame) => setConfig((prev) => ({ ...prev, startFrame }))}
            setEndFrame={(endFrame) => setConfig((prev) => ({ ...prev, endFrame }))}
            setStartFrameDesc={(startFrameDesc) => setConfig((prev) => ({ ...prev, startFrameDesc }))}
            setEndFrameDesc={(endFrameDesc) => setConfig((prev) => ({ ...prev, endFrameDesc }))}
          />
        </div>

        {/* 基础参数 */}
        <div className="mt-6">
          <BasicParams
            duration={config.duration}
            aspectRatio={config.aspectRatio}
            promptMode={config.promptMode}
            setDuration={(duration) => setConfig({ ...config, duration })}
            setAspectRatio={(aspectRatio) => setConfig({ ...config, aspectRatio })}
            setPromptMode={(promptMode) => setConfig({ ...config, promptMode })}
          />
        </div>

        {/* 视觉风格 */}
        <div className="mt-6">
          <VisualStyle
            visualStyle={config.visualStyle}
            setVisualStyle={(visualStyle) => setConfig({ ...config, visualStyle })}
          />
        </div>

        {/* 叙事节奏 */}
        <div className="mt-6">
          <NarrativePace
            narrativePace={config.narrativePace}
            setNarrativePace={(narrativePace) => setConfig({ ...config, narrativePace })}
          />
        </div>

        {/* 声音与台词 */}
        <div className="mt-6">
          <DialogueConfig
            includeDialogue={config.includeDialogue}
            dialogueLanguage={config.dialogueLanguage}
            narrationStyle={config.narrationStyle}
            musicStyle={config.musicStyle}
            setIncludeDialogue={(includeDialogue) => setConfig({ ...config, includeDialogue })}
            setDialogueLanguage={(dialogueLanguage) => setConfig({ ...config, dialogueLanguage })}
            setNarrationStyle={(narrationStyle) => setConfig({ ...config, narrationStyle })}
            setMusicStyle={(musicStyle) => setConfig({ ...config, musicStyle })}
          />
        </div>

        {/* 使用提示 */}
        <div className="mt-6">
          <UsageTips />
        </div>

        {/* 生成按钮 */}
        <div className="mt-8 mb-8">
          <button
            onClick={onGenerate}
            disabled={!config.brief.trim()}
            className="w-full py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-semibold text-base sm:text-lg shadow-lg shadow-orange-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            一键生成分镜提示词
          </button>
          {!config.brief.trim() && (
            <p className="text-center text-sm text-gray-500 mt-2">
              请先输入创意简报
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
