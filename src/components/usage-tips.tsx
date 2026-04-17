import React from 'react';
import { Lightbulb, Sparkles, Clock, AlertTriangle, Shield, Copy, Video } from 'lucide-react';

const tips = [
  {
    icon: Sparkles,
    title: '多方案对比',
    description: '系统会自动生成 2 套差异化方案（如快节奏 vs 文艺慢节奏），供你对比选择',
    color: 'text-purple-500',
    bgColor: 'bg-purple-100',
  },
  {
    icon: Clock,
    title: '智能时长推演',
    description: '基于设定的视频总时长，AI会自动分配最佳的镜头接续数目和分镜头时长',
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
  },
  {
    icon: AlertTriangle,
    title: '智能冲突处理',
    description: '若主风格与局部参数（如色调/光影）冲突，AI 会自动帮你融合或做主次取舍保画质',
    color: 'text-orange-500',
    bgColor: 'bg-orange-100',
  },
  {
    icon: Shield,
    title: '平台合规规避',
    description: '自动预判并替换可能触发平台拦截的敏感违禁词及受限 IP 版权规则，智能转化为安全表述',
    color: 'text-green-500',
    bgColor: 'bg-green-100',
  },
  {
    icon: Copy,
    title: '一键粘贴结构',
    description: '方案将整合为全局精密的 Markdown 提示词文本，带有时戳和剧情排期',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-100',
  },
  {
    icon: Video,
    title: '深度适配主流平台',
    description: '提示词框架已深度适配主流 AI 视频工具平台（如：即梦、可灵、Sora、Runway）',
    color: 'text-pink-500',
    bgColor: 'bg-pink-100',
  },
];

export function UsageTips() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-yellow-500" />
        <h3 className="text-lg font-semibold text-gray-900">使用提示</h3>
      </div>
      
      <div className="space-y-3">
        {tips.map((tip, index) => {
          const Icon = tip.icon;
          return (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className={`w-8 h-8 ${tip.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${tip.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-gray-900 text-sm">▸ {tip.title}</span>
                </div>
                <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                  {tip.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
