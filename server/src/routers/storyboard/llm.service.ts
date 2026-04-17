import { Injectable } from '@nestjs/common';
import { Config, LLMClient } from 'coze-coding-dev-sdk';
import { StoryboardConfigDto } from './dto/storyboard-config.dto';

export type StreamChunk = { content?: string; error?: string };

@Injectable()
export class LlmService {
  private client: LLMClient;

  constructor() {
    const config = new Config();
    this.client = new LLMClient(config);
  }

  private buildSystemPrompt(config: StoryboardConfigDto): string {
    const battleModeFormat =
      config.promptMode === 'battle'
        ? `
【战斗模式专属字段】
每个方案必须包含以下额外字段：
- coreTheme: 核心主题描述（字符串，必须用双引号包裹）
- visualStyleDetail: { quality: "画质描述", effects: "特效层级描述" }
- cameraAndRhythm: { cameraWork: "运镜描述", pacing: "节奏控制描述" }
- actionDesign: 动作设计核心描述（字符串）
- globalRequirements: 全局整合要求（字符串）
- 每个scene包含actionFlow字段：动作流描述

【战斗模式sceneTitle格式】
必须使用【镜头X：标题·副标题】格式，例如：
"sceneTitle": "【镜头1：神临·对峙】"
"sceneTitle": "【镜头2：交锋·破空】"
`
        : '';

    return `你是一位专业的电影分镜师和AI视频生成专家，擅长将简单的剧情描述转化为专业的分镜脚本。
${config.promptMode === 'battle' ? '你需要根据用户提供的剧情概要和参数设置，生成1套详细的战斗分镜提示词方案。' : '你需要根据用户提供的剧情概要和参数设置，生成2套不同风格的详细电影级分镜提示词方案。'}
${battleModeFormat}
输出格式要求（JSON数组，${config.promptMode === 'battle' ? '包含1个方案' : '包含2个方案'}）：
[
  {
    "planId": 1,
    "title": "方案标题（如：英雄史诗版）",
    "description": "方案风格描述",
    "visualStyleSummary": "视觉风格总结",${config.promptMode === 'battle' ? `
    "coreTheme": "核心主题描述",
    "visualStyleDetail": {
      "quality": "画质风格描述",
      "effects": "特效层级描述"
    },
    "cameraAndRhythm": {
      "cameraWork": "专业电影运镜描述",
      "pacing": "快慢结合与节奏描述"
    },
    "actionDesign": "动作设计核心描述",` : ''}
    "scenes": [
      {
        "shotNumber": 1,
        "sceneTitle": "${config.promptMode === 'battle' ? '【镜头1：标题·副标题】' : '场景标题'}",
        "startTime": 0,
        "endTime": 3,
        "shotType": "主观视角",
        "cameraAngle": "手持镜头",
        "cameraMovement": "轻微晃动",
        "description": "详细画面描述",${config.promptMode === 'battle' ? `
        "actionFlow": "动作流描述",` : ''}
        "visualEffects": "视觉特效说明",
        "sound": "背景音效提示",
        "dialogue": "对白/旁白内容",
        "subjectInfo": "画面主体描述"
      }
    ],${config.promptMode === 'battle' ? `
    "globalRequirements": "全局整合要求",` : ''}
    "platformOptimized": ["即梦", "可灵", "Sora"]
  }
]

【JSON格式严格规范】
1. 所有属性名和字符串值必须用英文双引号包裹
2. 数字值不需要引号
3. 数组和对象最后一个元素后不要有逗号
4. 不要添加任何注释
5. 直接输出JSON数组，不要有markdown代码块标记

每个镜头的时间分配规则：
- 根据总时长合理分配每个镜头的时间区间
- 时间格式：startTime和endTime为数字，表示秒数
- 镜头时长总和必须等于总时长`;
  }

  private buildUserPrompt(config: StoryboardConfigDto): string {
    const dialogueInfo = config.includeDialogue
      ? `- 包含台词/对白
- 台词语言：${config.dialogueLanguage || 'auto'}
- 旁白风格：${config.narrationStyle || 'none'}`
      : '- 不包含台词';

    const promptModeInfo =
      config.promptMode === 'scene'
        ? '场景模式：用户将看到"场景一：开场即高燃 · 兵器相接"这样的标题格式'
        : config.promptMode === 'battle'
          ? '场景战斗模式：用户将看到详细的战斗分镜格式'
          : '时间模式：用户将看到"0-4秒画面:"这样的时间标题格式';

    const soundNote =
      config.musicStyle === 'silent-sfx'
        ? `
【重要音效要求】
用户选择了"仅音效"模式，每个镜头的sound字段必须：
1. 明确标注"无背景音乐，无BGM"
2. 只保留环境音效`
        : '';

    return `请根据以下信息生成${config.promptMode === 'battle' ? '1套' : '2套'}专业的分镜方案：

【剧情概要】
${config.brief}

【参数设置】
- 视频总时长：${config.duration}秒
- 画面比例：${config.aspectRatio}
- 视觉风格：${config.visualStyle}
- 叙事节奏：${config.narrativePace}
- 音效/配乐倾向：${config.musicStyle || 'auto'}
- 提示词展示模式：${promptModeInfo}
${soundNote}
${dialogueInfo}
${config.startFrame || config.startFrameDesc ? `
【首帧画面】
${config.startFrameDesc || '（用户已上传首帧图片）'}
${config.startFrame ? '首帧图片已上传，请根据首帧画面内容作为视频起始画面。' : ''}` : ''}
${config.endFrame || config.endFrameDesc ? `
【尾帧画面】
${config.endFrameDesc || '（用户已上传尾帧图片）'}
${config.endFrame ? '尾帧图片已上传，请根据尾帧画面内容作为视频结束画面。' : ''}` : ''}

请生成${config.promptMode === 'battle' ? '1套完整的战斗分镜方案' : '2套风格差异明显的分镜方案'}，输出JSON数组格式。`;
  }

  async *generateStoryboard(config: StoryboardConfigDto): AsyncGenerator<StreamChunk> {
    const messages = [
      { role: 'system', content: this.buildSystemPrompt(config) },
      { role: 'user', content: this.buildUserPrompt(config) },
    ] as const;

    try {
      const stream = this.client.stream(messages as any, {
        temperature: 0.8,
        model: config.model || 'doubao-seed-1-8-251228',
      });

      for await (const chunk of stream as any) {
        if (chunk?.content) {
          yield { content: chunk.content.toString() };
        }
      }
    } catch (error) {
      yield { error: '生成失败' };
    }
  }
}

