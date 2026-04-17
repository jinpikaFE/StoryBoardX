import React, { useState } from 'react';
import { Lightbulb, AlertCircle, FileText, ChevronDown } from 'lucide-react';

interface BriefInputProps {
  brief: string;
  setBrief: (brief: string) => void;
}

// 创意简报模板
const briefTemplates = [
  {
    id: 'wushanwuxing',
    name: '雾山五行猫妖版',
    description: '中国动画风格 + 三国演义',
    content: `核心风格：中国动画 雾山五行 风格，强调极具张力的凌厉线条、富有冲击力的动态构图、以及对比强烈的色彩运用。

内容：
人物：全员猫妖，需要描述服饰特征
RAG：三国演义`,
  },
  {
    id: 'cyberpunk',
    name: '赛博朋克城市',
    description: '未来科幻风格',
    content: `核心风格：赛博朋克美学，霓虹灯效、高楼林立的未来都市、雨夜倒影、全息投影广告。

内容：
场景：2150年的东京新都区，黑客追击战。
人物：身穿发光纳米装甲的主角，在摩天大楼间穿梭。
RAG：银翼杀手视觉元素`,
  },
  {
    id: 'wuxia',
    name: '江湖武侠',
    description: '中国古典武侠风格',
    content: `核心风格：中国武侠电影美学，飘逸的长袍、剑光闪烁、竹林打斗、水墨意境。

内容：
场景：月色下的竹林客栈，高手对决。
人物：白衣剑客 vs 黑衣刺客，动作要凌厉潇洒。
RAG：卧虎藏龙、英雄 动作设计`,
  },
  {
    id: 'fantasy',
    name: '魔幻史诗',
    description: '西方奇幻风格',
    content: `核心风格：魔幻史诗电影感，宏伟的城堡、神秘的魔法光芒、史诗级战斗场面。

内容：
场景：火焰山脚下的龙穴入口，巨龙苏醒。
人物：身披重甲的骑士团，手持发光的圣剑。
RAG：指环王、权力的游戏 视觉风格`,
  },
];

export function BriefInput({ brief, setBrief }: BriefInputProps) {
  const [showTemplates, setShowTemplates] = useState(false);

  const handleSelectTemplate = (template: typeof briefTemplates[0]) => {
    setBrief(template.content);
    setShowTemplates(false);
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-semibold text-gray-900">创意简报</h3>
          <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-xs font-medium rounded">
            必填
          </span>
        </div>
        
        {/* 模板选择器 */}
        <div className="relative">
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors border border-purple-200"
          >
            <FileText className="w-4 h-4" />
            模板
            <ChevronDown className={`w-4 h-4 transition-transform ${showTemplates ? 'rotate-180' : ''}`} />
          </button>
          
          {showTemplates && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowTemplates(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 z-20 overflow-hidden">
                <div className="p-2 border-b border-gray-100 bg-gray-50">
                  <p className="text-xs text-gray-500 font-medium">选择创意模板</p>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {briefTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleSelectTemplate(template)}
                      className="w-full p-3 text-left hover:bg-purple-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{template.name}</span>
                        <span className="text-xs text-gray-400">{template.description}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {template.content.split('\n').slice(0, 2).join(' ')}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <textarea
        value={brief}
        onChange={(e) => setBrief(e.target.value)}
        placeholder="例如：一个年轻的冒险家在雨夜的城市屋顶上追逐一个神秘的黑衣人，跨越多个建筑，最终在一个废弃的钟楼里发现了惊人的秘密...

或点击右上角「模板」选择预设创意。"
        className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-gray-700 placeholder-gray-400 text-sm"
        maxLength={3000}
      />

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-gray-500">
            只需输入大致的剧情或核心想法，AI会帮你补充专业的分镜细节。支持指定画风、风格、RAG参考等。
          </p>
        </div>
        <span className="text-xs text-gray-400">{brief.length}/3000</span>
      </div>
    </div>
  );
}
