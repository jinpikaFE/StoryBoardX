// 分镜配置类型
export interface StoryboardConfig {
  brief: string;
  duration: number;
  aspectRatio: string;
  visualStyle: string;
  narrativePace: string;
  includeDialogue: boolean;
  dialogueLanguage: string;
  narrationStyle: string;
  musicStyle: string;
  model: string;
  promptMode?: 'time' | 'scene' | 'battle';
  startFrame?: string | null;
  endFrame?: string | null;
  startFrameDesc?: string;
  endFrameDesc?: string;
}

// 历史记录请求类型
export interface HistoryCreateRequest {
  brief: string;
  duration: number;
  aspectRatio: string;
  visualStyle: string;
  narrativePace: string;
  includeDialogue: boolean;
  dialogueLanguage: string;
  narrationStyle: string;
  musicStyle: string;
  model: string;
  promptMode: string;
  result?: any;
  startFrame?: string | null;
  endFrame?: string | null;
  startFrameDesc?: string;
  endFrameDesc?: string;
}

// 历史记录项类型
export interface HistoryItem {
  id: number;
  brief: string;
  duration: number;
  aspect_ratio: string;
  visual_style: string;
  narrative_pace: string;
  include_dialogue: number;
  dialogue_language: string;
  narration_style: string;
  music_style: string;
  model: string;
  prompt_mode: string;
  result?: any;
  start_frame?: string | null;
  end_frame?: string | null;
  start_frame_desc?: string;
  end_frame_desc?: string;
  created_at: string;
}

// LLM消息类型
export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// 流式响应类型
export interface StreamChunk {
  content?: string;
  error?: string;
}
