import React from 'react';
import { Clock, Maximize, FileText } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface BasicParamsProps {
  duration: number;
  aspectRatio: string;
  promptMode: 'time' | 'scene' | 'battle';
  setDuration: (duration: number) => void;
  setAspectRatio: (ratio: string) => void;
  setPromptMode: (mode: 'time' | 'scene' | 'battle') => void;
}

const aspectRatios = [
  { id: '16:9', label: '16:9', desc: '横屏标准' },
  { id: '9:16', label: '9:16', desc: '竖屏' },
  { id: '1:1', label: '1:1', desc: '方形' },
  { id: '21:9', label: '21:9', desc: '超宽屏' },
  { id: '4:3', label: '4:3', desc: '传统' },
];

const promptModes = [
  { id: 'time' as const, label: '时间模式', desc: '0-4秒画面: ...' },
  { id: 'scene' as const, label: '场景模式', desc: '场景一：开场即高燃' },
  { id: 'battle' as const, label: '场景战斗模式', desc: '详细战斗分镜格式' },
];

export function BasicParams({
  duration,
  aspectRatio,
  promptMode,
  setDuration,
  setAspectRatio,
  setPromptMode,
}: BasicParamsProps) {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-orange-500" />
        <h3 className="text-lg font-semibold text-gray-900">基础参数</h3>
      </div>

      {/* 提示词模式 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-4 h-4 text-gray-600" />
          <label className="text-sm font-medium text-gray-700">提示词模式</label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {promptModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setPromptMode(mode.id)}
              className={`
                p-3 rounded-lg border-2 transition-all text-left
                ${promptMode === mode.id
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div
                className={`text-sm font-semibold ${
                  promptMode === mode.id ? 'text-orange-600' : 'text-gray-700'
                }`}
              >
                {mode.label}
              </div>
              <div className="text-xs text-gray-500 mt-1">{mode.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 视频时长 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">视频时长</label>
          <span className="text-sm font-semibold text-orange-600">{duration}秒</span>
        </div>
        <Slider
          value={[duration]}
          onValueChange={(value) => setDuration(value[0])}
          min={3}
          max={15}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between mt-2">
          <span className="text-xs text-gray-500">3秒</span>
          <span className="text-xs text-gray-500">15秒</span>
        </div>
      </div>

      {/* 画面比例 */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Maximize className="w-4 h-4 text-gray-600" />
          <label className="text-sm font-medium text-gray-700">画面比例</label>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {aspectRatios.map((ratio) => (
            <button
              key={ratio.id}
              onClick={() => setAspectRatio(ratio.id)}
              className={`
                p-2 sm:p-3 rounded-lg border-2 transition-all text-center
                ${aspectRatio === ratio.id
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div
                className={`text-sm font-semibold ${
                  aspectRatio === ratio.id ? 'text-orange-600' : 'text-gray-700'
                }`}
              >
                {ratio.label}
              </div>
              <div className="text-xs text-gray-500 mt-0.5 hidden sm:block">{ratio.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
