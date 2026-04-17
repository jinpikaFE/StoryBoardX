import React from 'react';
import { Mic, Music } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface DialogueConfigProps {
  includeDialogue: boolean;
  dialogueLanguage: string;
  narrationStyle: string;
  musicStyle: string;
  setIncludeDialogue: (include: boolean) => void;
  setDialogueLanguage: (language: string) => void;
  setNarrationStyle: (style: string) => void;
  setMusicStyle: (style: string) => void;
}

const dialogueLanguages = [
  { id: 'auto', label: '由AI匹配' },
  { id: 'zh', label: '中文' },
  { id: 'en', label: 'English' },
  { id: 'ja', label: '日本語' },
  { id: 'ko', label: '한국어' },
];

const narrationStyles = [
  { id: 'none', label: '无旁白纯对白' },
  { id: 'male-calm', label: '男声沉稳' },
  { id: 'female-gentle', label: '女声温柔' },
  { id: 'first-person', label: '第一人称独白' },
];

const musicStyles = [
  { id: 'auto', label: '由AI自动匹配' },
  { id: 'epic-orchestral', label: '史诗管弦乐' },
  { id: 'electronic-ambient', label: '电子氛围' },
  { id: 'piano-soft', label: '钢琴轻柔' },
  { id: 'folk-guitar', label: '民谣吉他' },
  { id: 'chinese-classical', label: '中国传统古风' },
  { id: 'jazz-vintage', label: '爵士复古' },
  { id: 'rock-intense', label: '摇滚激烈' },
  { id: 'nature-sounds', label: '自然环境音' },
  { id: 'suspense-tense', label: '电影悬疑紧张' },
  { id: 'silent-sfx', label: '仅音效（环境/战斗音）' },
];

export function DialogueConfig({
  includeDialogue,
  dialogueLanguage,
  narrationStyle,
  musicStyle,
  setIncludeDialogue,
  setDialogueLanguage,
  setNarrationStyle,
  setMusicStyle,
}: DialogueConfigProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      {/* 标题 */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
          <Mic className="w-4 h-4 text-pink-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">声音与台词</h3>
      </div>

      {/* 包含台词/对白 开关 */}
      <div className="mb-5 pb-5 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-pink-100 rounded flex items-center justify-center">
                <span className="text-xs">📝</span>
              </div>
              <span className="font-medium text-gray-900">包含台词/对白</span>
            </div>
            <p className="text-sm text-gray-500 mt-1.5 ml-7">
              开启后为每个分镜生成角色台词和画外旁白
            </p>
          </div>
          <Switch
            checked={includeDialogue}
            onCheckedChange={setIncludeDialogue}
          />
        </div>
      </div>

      {/* 台词语言 - 仅在开关打开时显示 */}
      {includeDialogue && (
        <div className="mb-5 pb-5 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 bg-yellow-400 rounded-full"></div>
            <span className="font-medium text-gray-900">台词语言</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {dialogueLanguages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setDialogueLanguage(lang.id)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all
                  ${dialogueLanguage === lang.id
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-600 border border-gray-300 hover:border-gray-400'
                  }
                `}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 旁白风格 - 仅在开关打开时显示 */}
      {includeDialogue && (
        <div className="mb-5 pb-5 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 bg-pink-100 rounded flex items-center justify-center">
              <Mic className="w-3 h-3 text-pink-500" />
            </div>
            <span className="font-medium text-gray-900">旁白风格</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {narrationStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => setNarrationStyle(style.id)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all
                  ${narrationStyle === style.id
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-600 border border-gray-300 hover:border-gray-400'
                  }
                `}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 音效/配乐倾向 - 始终显示 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-pink-100 rounded flex items-center justify-center">
              <Music className="w-3 h-3 text-pink-500" />
            </div>
            <span className="font-medium text-gray-900">音效/配乐倾向</span>
          </div>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">可选</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {musicStyles.map((style) => (
            <button
              key={style.id}
              onClick={() => setMusicStyle(style.id)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all
                ${musicStyle === style.id
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:border-gray-400'
                }
              `}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
