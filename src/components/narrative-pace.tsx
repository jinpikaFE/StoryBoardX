import React from 'react';
import { Zap } from 'lucide-react';

interface NarrativePaceProps {
  narrativePace: string;
  setNarrativePace: (pace: string) => void;
}

const narrativePaces = [
  {
    id: 'standard',
    label: '标准叙事',
    icon: '📹',
    desc: '远景开场→中近景发展→特写高潮→拉远收束',
  },
  {
    id: 'fast',
    label: '快节奏剪辑',
    icon: '⚡',
    desc: '快切、短镜头、密集动作，适合预告片/广告',
  },
  {
    id: 'slow',
    label: '文艺慢节奏',
    icon: '🍃',
    desc: '长镜头、慢运镜、留白，适合情感/风景片',
  },
  {
    id: 'progressive',
    label: '递进式',
    icon: '📊',
    desc: '镜头由静至动、由慢到快层层递进',
  },
  {
    id: 'cross',
    label: '交叉叙事',
    icon: '💬',
    desc: '两条线交替剪辑（Meanwhile...）',
  },
  {
    id: 'flashback',
    label: '倒叙式',
    icon: '✨',
    desc: '高潮前置→闪回→回到现在',
  },
  {
    id: 'montage',
    label: '蒙太奇',
    icon: '🎬',
    desc: '经典蒙太奇剪辑，多场景并置',
  },
];

export function NarrativePace({ narrativePace, setNarrativePace }: NarrativePaceProps) {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-orange-500" />
        <h3 className="text-lg font-semibold text-gray-900">叙事节奏</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
        {narrativePaces.map((pace) => (
          <button
            key={pace.id}
            onClick={() => setNarrativePace(pace.id)}
            className={`
              p-3 sm:p-4 rounded-lg border-2 transition-all text-left
              ${narrativePace === pace.id
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
              }
            `}
          >
            <div className="flex items-start gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl">{pace.icon}</span>
              <div className="flex-1 min-w-0">
                <div
                  className={`font-medium text-sm ${
                    narrativePace === pace.id ? 'text-green-600' : 'text-gray-900'
                  }`}
                >
                  {pace.label}
                </div>
                <div className="text-xs text-gray-500 mt-0.5 sm:mt-1 line-clamp-2 sm:line-clamp-none">{pace.desc}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
