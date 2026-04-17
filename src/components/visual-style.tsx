import React from 'react';
import { Palette } from 'lucide-react';

interface VisualStyleProps {
  visualStyle: string;
  setVisualStyle: (style: string) => void;
}

const visualStyles = [
  {
    id: 'cinematic',
    label: '电影感',
    icon: '🎬',
    desc: '专业电影质感',
  },
  {
    id: 'anime',
    label: '动漫风',
    icon: '🎨',
    desc: '日式动漫风格',
  },
  {
    id: 'realistic',
    label: '写实风',
    icon: '📷',
    desc: '写实纪录片风格',
  },
  {
    id: 'noir',
    label: '黑色电影',
    icon: '🌙',
    desc: '经典黑色电影风格',
  },
  {
    id: 'scifi',
    label: '科幻风',
    icon: '🚀',
    desc: '未来科幻质感',
  },
  {
    id: 'fantasy',
    label: '奇幻风',
    icon: '✨',
    desc: '魔幻奇幻风格',
  },
  {
    id: 'retro',
    label: '复古风',
    icon: '📼',
    desc: '复古怀旧风格',
  },
  {
    id: 'minimalist',
    label: '极简风',
    icon: '◻️',
    desc: '简约现代风格',
  },
];

export function VisualStyle({ visualStyle, setVisualStyle }: VisualStyleProps) {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Palette className="w-5 h-5 text-orange-500" />
        <h3 className="text-lg font-semibold text-gray-900">视觉风格</h3>
        <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-xs font-medium rounded">
          必填
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {visualStyles.map((style) => (
          <button
            key={style.id}
            onClick={() => setVisualStyle(style.id)}
            className={`
              p-3 sm:p-4 rounded-lg border-2 transition-all text-left
              ${visualStyle === style.id
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 hover:border-gray-300'
              }
            `}
          >
            <div className="text-xl sm:text-2xl mb-1 sm:mb-2">{style.icon}</div>
            <div
              className={`font-medium text-sm ${
                visualStyle === style.id ? 'text-orange-600' : 'text-gray-900'
              }`}
            >
              {style.label}
            </div>
            <div className="text-xs text-gray-500 mt-0.5 hidden sm:block">{style.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
