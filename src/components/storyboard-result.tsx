

import React, { useState } from 'react';
import { StoryboardPlan, StoryboardConfig } from '@/types';
import { ArrowLeft, Copy, Check, Sparkles, Film, FolderOpen, Music, ChevronDown, ChevronUp } from 'lucide-react';


interface StoryboardResultProps {
  plans: StoryboardPlan[];
  isGenerating: boolean;
  config: StoryboardConfig;
  onBack: () => void;
  streamingContent?: string;
}

const styleLabels: Record<string, string> = {
  cinematic: '电影写实',
  anime: '日式动漫',
  realistic: '写实纪录',
  noir: '黑色电影',
  scifi: '未来科幻',
  fantasy: '魔幻奇幻',
  retro: '复古怀旧',
  minimalist: '简约现代',
};

const paceLabels: Record<string, string> = {
  standard: '标准叙事',
  fast: '快节奏剪辑',
  slow: '文艺慢节奏',
  progressive: '递进式',
  cross: '交叉叙事',
  flashback: '倒叙式',
  montage: '蒙太奇',
};

const languageLabels: Record<string, string> = {
  auto: 'AI自动',
  zh: '中文',
  en: 'English',
  ja: '日本語',
  ko: '한국어',
};

const narrationLabels: Record<string, string> = {
  none: '无旁白',
  'male-calm': '男声沉稳',
  'female-gentle': '女声温柔',
  'first-person': '第一人称',
};

const musicLabels: Record<string, string> = {
  auto: 'AI自动',
  'epic-orchestral': '史诗管弦',
  'electronic-ambient': '电子氛围',
  'piano-soft': '钢琴轻柔',
  'folk-guitar': '民谣吉他',
  'chinese-classical': '中国古风',
  'jazz-vintage': '爵士复古',
  'rock-intense': '摇滚激烈',
  'nature-sounds': '自然环境',
  'suspense-tense': '悬疑紧张',
  'silent-sfx': '仅音效（环境/战斗音）',
};

const modelLabels: Record<string, string> = {
  'doubao-seed-1-8-251228': '豆包 1.8',
  'doubao-seed-2-0-pro-260215': '豆包 2.0 Pro',
  'doubao-seed-2-0-lite-260215': '豆包 2.0 Lite',
  'doubao-seed-2-0-mini-260215': '豆包 2.0 Mini',
  'doubao-seed-1-6-thinking-250715': '豆包 1.6 Thinking',
  'deepseek-v3-2-251201': 'DeepSeek V3.2',
  'deepseek-r1-250528': 'DeepSeek R1',
  'glm-4-7-251222': 'GLM-4-7',
  'kimi-k2-5-260127': 'Kimi K2.5',
};

export function StoryboardResult({ plans, isGenerating, config, onBack, streamingContent }: StoryboardResultProps) {
  const [selectedPlan, setSelectedPlan] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isConfigExpanded, setIsConfigExpanded] = useState(false);

  // 从创意简报中提取风格关键词
  const extractStyleKeywords = (brief: string): string | null => {
    const stylePatterns = [
      /(\w+画风)/gi,
      /(\w+风格)/gi,
      /(\w+风)/gi,
      /(赛博朋克)/gi,
      /(蒸汽朋克)/gi,
      /(水墨画)/gi,
      /(油画)/gi,
      /(水彩)/gi,
      /(素描)/gi,
      /(剪纸)/gi,
      /(皮影)/gi,
      /(像素)/gi,
      /(低多边形)/gi,
      /(卡通风?)/gi,
      /(二次元)/gi,
      /(国漫)/gi,
      /(美漫)/gi,
      /(日漫)/gi,
      /(韩漫)/gi,
      /(3D渲染)/gi,
      /(CG)/gi,
      /(写实)/gi,
      /(超现实)/gi,
      /(梦幻)/gi,
      /(暗黑)/gi,
      /(哥特)/gi,
      /(复古)/gi,
      /(怀旧)/gi,
      /(赛博)/gi,
      /(科幻)/gi,
      /(奇幻)/gi,
      /(魔幻)/gi,
      /(仙侠)/gi,
      /(武侠)/gi,
      /(古风)/gi,
      /(中国风)/gi,
      /(日式)/gi,
      /(欧美)/gi,
      /(韩式)/gi,
    ];
    
    const foundStyles: string[] = [];
    
    for (const pattern of stylePatterns) {
      const matches = brief.match(pattern);
      if (matches) {
        matches.forEach(match => {
          if (!foundStyles.includes(match)) {
            foundStyles.push(match);
          }
        });
      }
    }
    
    return foundStyles.length > 0 ? foundStyles.join(' ') : null;
  };

  // 获取完整的视觉风格显示文本
  const getFullVisualStyle = (): string => {
    const baseStyle = styleLabels[config.visualStyle] || config.visualStyle;
    const extractedStyle = extractStyleKeywords(config.brief);
    
    if (extractedStyle) {
      return `${extractedStyle} ${baseStyle}`;
    }
    return baseStyle;
  };

  const handleCopyAll = async () => {
    if (!plans[selectedPlan]) return;
    
    const plan = plans[selectedPlan];
    
    // 战斗模式特殊格式
    if (config.promptMode === 'battle') {
      let text = '';
      
      // 核心主题
      if (plan.coreTheme) {
        text += `核心主题：\n${plan.coreTheme}\n\n`;
      }
      
      // 视觉与风格
      if (plan.visualStyleDetail) {
        text += `视觉与风格：\n`;
        if (plan.visualStyleDetail.quality) {
          text += `画质：\n${plan.visualStyleDetail.quality}\n`;
        }
        if (plan.visualStyleDetail.effects) {
          text += `特效层级：\n${plan.visualStyleDetail.effects}\n`;
        }
        text += '\n';
      }
      
      // 运镜与节奏
      if (plan.cameraAndRhythm) {
        text += `运镜与节奏：\n`;
        if (plan.cameraAndRhythm.cameraWork) {
          text += `专业电影运镜：\n${plan.cameraAndRhythm.cameraWork}\n`;
        }
        if (plan.cameraAndRhythm.pacing) {
          text += `节奏控制：\n${plan.cameraAndRhythm.pacing}\n`;
        }
        text += '\n';
      }
      
      // 动作设计核心
      if (plan.actionDesign) {
        text += `动作设计核心：\n${plan.actionDesign}\n\n`;
      }
      
      // 优化后分镜叙事
      text += `优化后分镜叙事（动作密度增强版）：\n\n`;
      
      plan.scenes.forEach(scene => {
        text += `${scene.sceneTitle || `【镜头${scene.shotNumber}】`}\n`;
        text += `画面：\n${scene.description}\n`;
        text += `运镜：\n${scene.cameraMovement || '详见描述'}\n`;
        if (scene.actionFlow) {
          text += `动作流：\n${scene.actionFlow}\n`;
        }
        if (scene.sound) {
          text += `背景音效: ${scene.sound}\n`;
        }
        text += '\n';
      });
      
      // 全局整合要求
      if (plan.globalRequirements) {
        text += `全局整合要求：\n${plan.globalRequirements}\n`;
      }

      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }
    
    // 普通模式
    let text = `整体说明\n`;
    text += `- 时长: ${config.duration}秒\n`;
    text += `- 视觉风格: ${plan.visualStyleSummary || getFullVisualStyle()}\n`;
    text += `- 画面比例: ${config.aspectRatio}\n`;
    text += `- 叙事节奏: ${paceLabels[config.narrativePace] || config.narrativePace}\n\n`;
    text += `---\n分段提示词\n\n`;
    
    plan.scenes.forEach(scene => {
      // 根据模式选择不同的标题格式
      const sceneTitle = config.promptMode === 'scene' && scene.sceneTitle
        ? scene.sceneTitle
        : `${scene.startTime}-${scene.endTime}秒画面`;
      text += `${sceneTitle}: ${scene.description}\n`;
      text += `[镜头信息扩展: ${scene.shotType} / ${scene.cameraMovement} / 画面主体: ${scene.subjectInfo || '详见描述'}]\n`;
      if (scene.sound) {
        text += `背景音效: ${scene.sound}\n`;
      }
      if (scene.dialogue) {
        text += `对白/旁白: ${scene.dialogue}\n`;
      }
      text += '\n';
    });

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generatePromptText = (plan: StoryboardPlan) => {
    if (!plan) return '';
    
    // 战斗模式特殊格式
    if (config.promptMode === 'battle') {
      let text = '';
      
      // 核心主题
      if (plan.coreTheme) {
        text += `核心主题：\n${plan.coreTheme}\n\n`;
      }
      
      // 视觉与风格
      if (plan.visualStyleDetail) {
        text += `视觉与风格：\n`;
        if (plan.visualStyleDetail.quality) {
          text += `画质：\n${plan.visualStyleDetail.quality}\n`;
        }
        if (plan.visualStyleDetail.effects) {
          text += `特效层级：\n${plan.visualStyleDetail.effects}\n`;
        }
        text += '\n';
      }
      
      // 运镜与节奏
      if (plan.cameraAndRhythm) {
        text += `运镜与节奏：\n`;
        if (plan.cameraAndRhythm.cameraWork) {
          text += `专业电影运镜：\n${plan.cameraAndRhythm.cameraWork}\n`;
        }
        if (plan.cameraAndRhythm.pacing) {
          text += `节奏控制：\n${plan.cameraAndRhythm.pacing}\n`;
        }
        text += '\n';
      }
      
      // 动作设计核心
      if (plan.actionDesign) {
        text += `动作设计核心：\n${plan.actionDesign}\n\n`;
      }
      
      // 优化后分镜叙事
      text += `优化后分镜叙事（动作密度增强版）：\n\n`;
      
      plan.scenes.forEach(scene => {
        text += `${scene.sceneTitle || `【镜头${scene.shotNumber}】`}\n`;
        text += `画面：\n${scene.description}\n`;
        text += `运镜：\n${scene.cameraMovement || '详见描述'}\n`;
        if (scene.actionFlow) {
          text += `动作流：\n${scene.actionFlow}\n`;
        }
        if (scene.sound) {
          text += `背景音效: ${scene.sound}\n`;
        }
        text += '\n';
      });
      
      // 全局整合要求
      if (plan.globalRequirements) {
        text += `全局整合要求：\n${plan.globalRequirements}\n`;
      }
      
      return text;
    }
    
    // 普通模式
    let text = `整体说明\n`;
    text += `- 时长: ${config.duration}秒\n`;
    text += `- 视觉风格: ${plan.visualStyleSummary || getFullVisualStyle()}\n\n`;
    text += `---\n分段提示词\n\n`;
    
    plan.scenes.forEach(scene => {
      // 根据模式选择不同的标题格式
      const sceneTitle = config.promptMode === 'scene' && scene.sceneTitle
        ? scene.sceneTitle
        : `${scene.startTime}-${scene.endTime}秒画面`;
      text += `${sceneTitle}: ${scene.description}\n`;
      text += `[镜头信息扩展: ${scene.shotType} / ${scene.cameraMovement} / 画面主体: ${scene.subjectInfo || '详见描述'}]\n`;
      if (scene.sound) {
        text += `背景音效: ${scene.sound}\n`;
      }
      if (scene.dialogue) {
        text += `对白/旁白: ${scene.dialogue}\n`;
      }
      text += '\n';
    });
    
    return text;
  };

  // 配置信息组件（用于侧边栏和移动端折叠区）
  const ConfigInfo = () => (
    <>
      {/* 原始创意 */}
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-3">原始创意</h3>
        <div className="space-y-3 text-sm">
          <div>
            <span className="text-gray-500">核心情节：</span>
            <p className="text-gray-700 mt-1">{config.brief}</p>
          </div>
          <div className="border-t border-gray-100 pt-3">
            <span className="text-gray-500">视觉风格：</span>
            <p className="text-gray-700 mt-1">{getFullVisualStyle()}</p>
          </div>
        </div>
      </div>

      {/* 基本配置 */}
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-3">基本配置</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-1.5 px-2 bg-gray-50 rounded">
            <span className="text-gray-500">模型</span>
            <span className="text-gray-900 font-medium">{modelLabels[config.model] || config.model}</span>
          </div>
          <div className="flex justify-between py-1.5 px-2 bg-gray-50 rounded">
            <span className="text-gray-500">风格</span>
            <span className="text-gray-900 font-medium">{getFullVisualStyle()}</span>
          </div>
          <div className="flex justify-between py-1.5 px-2 bg-gray-50 rounded">
            <span className="text-gray-500">比例</span>
            <span className="text-gray-900 font-medium">{config.aspectRatio}</span>
          </div>
          <div className="flex justify-between py-1.5 px-2 bg-gray-50 rounded">
            <span className="text-gray-500">时长</span>
            <span className="text-gray-900 font-medium">{config.duration}秒</span>
          </div>
          <div className="flex justify-between py-1.5 px-2 bg-gray-50 rounded">
            <span className="text-gray-500">节奏</span>
            <span className="text-gray-900 font-medium">{paceLabels[config.narrativePace] || config.narrativePace}</span>
          </div>
        </div>
      </div>

      {/* 高级配置 */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-3">高级配置</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-1.5 px-2 bg-gray-50 rounded">
            <span className="text-gray-500">台词语言</span>
            <span className="text-gray-900 font-medium">
              {config.includeDialogue ? (languageLabels[config.dialogueLanguage] || config.dialogueLanguage) : '无'}
            </span>
          </div>
          <div className="flex justify-between py-1.5 px-2 bg-gray-50 rounded">
            <span className="text-gray-500">旁白风格</span>
            <span className="text-gray-900 font-medium">
              {config.includeDialogue ? (narrationLabels[config.narrationStyle] || config.narrationStyle) : '无'}
            </span>
          </div>
          <div className="flex justify-between py-1.5 px-2 bg-gray-50 rounded">
            <span className="text-gray-500">配乐倾向</span>
            <span className="text-gray-900 font-medium">{musicLabels[config.musicStyle] || config.musicStyle}</span>
          </div>
          <div className="flex justify-between py-1.5 px-2 bg-gray-50 rounded">
            <span className="text-gray-500">画质要求</span>
            <span className="text-gray-900 font-medium">电影级</span>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50 overflow-hidden">
      {/* 桌面端左侧边栏：原始创意和配置 */}
      <div className="hidden lg:flex w-80 bg-white border-r border-gray-200 flex-col h-full overflow-hidden">
        {/* 头部 */}
        <div className="p-4 border-b border-gray-200 flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-lg font-bold text-gray-900">生成结果</h2>
        </div>

        {/* 内容区 */}
        <div className="flex-1 overflow-y-auto">
          <ConfigInfo />
        </div>
      </div>

      {/* 移动端顶部配置折叠区 */}
      <div className="lg:hidden bg-white border-b border-gray-200">
        {/* 头部 */}
        <div className="p-4 flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-lg font-bold text-gray-900">生成结果</h2>
          <button
            onClick={() => setIsConfigExpanded(!isConfigExpanded)}
            className="ml-auto p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isConfigExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* 折叠内容 */}
        {isConfigExpanded && (
          <div className="border-t border-gray-200 max-h-80 overflow-y-auto">
            <ConfigInfo />
          </div>
        )}
      </div>

      {/* 右侧主内容区 */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* 生成中状态 */}
        {isGenerating && (
          <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-orange-500 animate-pulse" />
                <span className="text-lg font-semibold text-gray-900">AI正在生成分镜提示词...</span>
              </div>
              <p className="text-gray-500 text-sm">分析剧情，设计镜头语言，优化叙事节奏</p>
              {streamingContent && (
                <div className="mt-4 max-w-2xl mx-auto">
                  <div className="bg-gray-900 rounded-lg p-4 max-h-64 overflow-auto text-left">
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                      {streamingContent.substring(0, 500)}...
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 结果展示 */}
        {!isGenerating && plans.length > 0 && (
          <>
            {/* 方案切换栏 */}
            <div className="bg-white border-b border-gray-200 p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex gap-2 sm:gap-3 flex-wrap">
                {plans.map((plan, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedPlan(index)}
                    className={`
                      px-3 sm:px-5 py-2 rounded-full font-medium transition-all text-sm
                      ${selectedPlan === index
                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                        : 'bg-white text-gray-700 border border-gray-300 hover:border-orange-300'
                      }
                    `}
                  >
                    方案{String.fromCharCode(65 + index)}：{plan.title.length > 6 ? plan.title.substring(0, 6) + '...' : plan.title}
                  </button>
                ))}
              </div>
              <div className="text-sm text-gray-500">
                预计总时长：<span className="font-semibold text-gray-900">{config.duration}秒</span>
              </div>
            </div>

            {/* 分段提示词总览 */}
            <div className="bg-white border-b border-gray-200 p-3 sm:p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-purple-500" />
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">分段提示词总览</h3>
                <span className="text-sm text-gray-500">({plans[selectedPlan]?.scenes?.length || 0}个镜头)</span>
              </div>
              <button
                onClick={handleCopyAll}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg font-medium transition-colors text-sm"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span className="hidden sm:inline">已复制</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="hidden sm:inline">一键复制全部</span>
                    <span className="sm:hidden">复制</span>
                  </>
                )}
              </button>
            </div>

            {/* 提示词展示区 */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-100">
              <div className="bg-gray-900 rounded-xl overflow-hidden">
                {/* 标题栏 */}
                <div className="bg-gray-800 px-4 py-2 text-gray-400 text-sm font-medium">
                  提示词Prompt
                </div>
                
                {/* 内容区 */}
                <div className="p-4 sm:p-6">
                  {/* 战斗模式特殊内容 */}
                  {config.promptMode === 'battle' && plans[selectedPlan] && (
                    <>
                      {/* 核心主题 */}
                      {plans[selectedPlan].coreTheme && (
                        <div className="mb-6">
                          <h4 className="text-orange-400 font-semibold text-sm mb-2">核心主题</h4>
                          <p className="text-gray-200 text-sm leading-relaxed bg-gray-800 rounded-lg p-3">
                            {plans[selectedPlan].coreTheme}
                          </p>
                        </div>
                      )}
                      
                      {/* 视觉与风格 */}
                      {plans[selectedPlan].visualStyleDetail && (
                        <div className="mb-6">
                          <h4 className="text-orange-400 font-semibold text-sm mb-2">视觉与风格</h4>
                          <div className="bg-gray-800 rounded-lg p-3 space-y-2 text-sm">
                            {plans[selectedPlan].visualStyleDetail?.quality && (
                              <div>
                                <span className="text-gray-400">画质：</span>
                                <span className="text-gray-200">{plans[selectedPlan].visualStyleDetail?.quality}</span>
                              </div>
                            )}
                            {plans[selectedPlan].visualStyleDetail?.effects && (
                              <div>
                                <span className="text-gray-400">特效层级：</span>
                                <span className="text-gray-200 whitespace-pre-line">{plans[selectedPlan].visualStyleDetail?.effects}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* 运镜与节奏 */}
                      {plans[selectedPlan].cameraAndRhythm && (
                        <div className="mb-6">
                          <h4 className="text-orange-400 font-semibold text-sm mb-2">运镜与节奏</h4>
                          <div className="bg-gray-800 rounded-lg p-3 space-y-2 text-sm">
                            {plans[selectedPlan].cameraAndRhythm?.cameraWork && (
                              <div>
                                <span className="text-gray-400">专业电影运镜：</span>
                                <span className="text-gray-200">{plans[selectedPlan].cameraAndRhythm?.cameraWork}</span>
                              </div>
                            )}
                            {plans[selectedPlan].cameraAndRhythm?.pacing && (
                              <div>
                                <span className="text-gray-400">节奏控制：</span>
                                <span className="text-gray-200">{plans[selectedPlan].cameraAndRhythm?.pacing}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* 动作设计核心 */}
                      {plans[selectedPlan].actionDesign && (
                        <div className="mb-6">
                          <h4 className="text-orange-400 font-semibold text-sm mb-2">动作设计核心</h4>
                          <p className="text-gray-200 text-sm leading-relaxed bg-gray-800 rounded-lg p-3 whitespace-pre-line">
                            {plans[selectedPlan].actionDesign}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                  
                  {/* 整体说明 */}
                  <div className="mb-6">
                    <h4 className="text-white font-semibold text-sm sm:text-base mb-3 flex items-center gap-2">
                      <FolderOpen className="w-5 h-5 text-purple-400" />
                      方案{String.fromCharCode(65 + selectedPlan)}：{plans[selectedPlan]?.title}
                    </h4>
                    <div className="bg-gray-800 rounded-lg p-4 space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="text-gray-400 flex-shrink-0">时长:</span>
                        <span className="text-white font-medium">{config.duration}秒</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-gray-400 flex-shrink-0">视觉风格:</span>
                        <span className="text-white">{plans[selectedPlan]?.visualStyleSummary || getFullVisualStyle()}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-gray-400 flex-shrink-0">画面比例:</span>
                        <span className="text-white">{config.aspectRatio}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-gray-400 flex-shrink-0">叙事节奏:</span>
                        <span className="text-white">{paceLabels[config.narrativePace] || config.narrativePace}</span>
                      </div>
                    </div>
                  </div>

                  {/* 分段提示词 */}
                  <div>
                    <h5 className="text-gray-300 text-xs font-medium mb-3 uppercase tracking-wider">--- 分段提示词 ---</h5>
                    <div className="space-y-4">
                      {plans[selectedPlan]?.scenes?.map((scene, index) => (
                        <div key={index} className="bg-gray-800 rounded-lg p-4">
                          {/* 场景标题 - 根据模式显示不同格式 */}
                          <h6 className="text-orange-400 font-medium text-sm mb-3">
                            {config.promptMode === 'battle' && scene.sceneTitle
                              ? scene.sceneTitle
                              : config.promptMode === 'scene' && scene.sceneTitle
                                ? scene.sceneTitle
                                : `${scene.startTime}-${scene.endTime}秒画面`}:
                          </h6>
                          
                          {/* 画面描述 */}
                          <p className="text-gray-200 text-sm leading-relaxed mb-3">
                            {scene.description}
                          </p>

                          {/* 镜头信息扩展 */}
                          <div className="bg-gray-900/50 rounded px-3 py-2 text-xs text-gray-400 mb-3">
                            [镜头信息扩展: {scene.shotType} / {scene.cameraMovement} / 画面主体: {scene.subjectInfo || '详见描述'}]
                          </div>

                          {/* 音效 */}
                          {scene.sound && (
                            <div className="flex items-start gap-2 text-xs mb-2">
                              <Music className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-400">背景音效:</span>
                              <span className="text-gray-300">{scene.sound}</span>
                            </div>
                          )}

                          {/* 对白/旁白 */}
                          {scene.dialogue && (
                            <div className="mt-2 pt-2 border-t border-gray-700">
                              <div className="text-xs text-gray-400 mb-1">对白/旁白:</div>
                              <div className="text-sm text-purple-300 italic bg-purple-900/20 rounded px-3 py-2">
                                {scene.dialogue}
                              </div>
                            </div>
                          )}

                          {/* 动作流 - 战斗模式专用 */}
                          {config.promptMode === 'battle' && scene.actionFlow && (
                            <div className="mt-2 pt-2 border-t border-gray-700">
                              <div className="text-xs text-gray-400 mb-1">动作流：</div>
                              <div className="text-sm text-green-300 bg-green-900/20 rounded px-3 py-2">
                                {scene.actionFlow}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 全局整合要求 - 战斗模式专用 */}
                  {config.promptMode === 'battle' && plans[selectedPlan]?.globalRequirements && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <h5 className="text-orange-400 font-semibold text-sm mb-2">全局整合要求</h5>
                      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                        {plans[selectedPlan]?.globalRequirements}
                      </p>
                    </div>
                  )}

                  {/* 平台适配信息 */}
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex items-center gap-2 text-xs text-gray-400 flex-wrap">
                      <span>适配平台：</span>
                      {plans[selectedPlan]?.platformOptimized?.map((platform, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-800 rounded">
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* 空状态 */}
        {!isGenerating && plans.length === 0 && (
          <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
            <div className="text-center">
              <Film className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-500">暂无分镜方案</p>
              <p className="text-sm text-gray-400 mt-2">点击"一键生成分镜提示词"开始生成</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
