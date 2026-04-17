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
  promptMode: 'time' | 'scene' | 'battle';
  startFrame: string | null;
  endFrame: string | null;
  startFrameDesc: string;
  endFrameDesc: string;
}

export interface HistoryItem {
  id: number;
  brief: string;
  duration: number;
  aspect_ratio: string;
  visual_style: string;
  narrative_pace: string;
  include_dialogue: number;
  dialogue_language: string | null;
  narration_style: string | null;
  music_style: string | null;
  model: string;
  result: any;
  created_at: string;
  prompt_mode?: 'time' | 'scene' | 'battle';
  start_frame?: string | null;
  end_frame?: string | null;
  start_frame_desc?: string | null;
  end_frame_desc?: string | null;
}

export interface StoryboardScene {
  shotNumber: number;
  startTime: number;
  endTime: number;
  sceneTitle?: string;
  shotType: string;
  cameraAngle: string;
  cameraMovement: string;
  description: string;
  visualEffects: string;
  sound?: string;
  dialogue?: string;
  subjectInfo?: string;
  actionFlow?: string;
}

export interface StoryboardPlan {
  planId: number;
  title: string;
  description: string;
  visualStyleSummary?: string;
  coreTheme?: string;
  visualStyleDetail?: {
    quality?: string;
    effects?: string;
  };
  cameraAndRhythm?: {
    cameraWork?: string;
    pacing?: string;
  };
  actionDesign?: string;
  globalRequirements?: string;
  scenes: StoryboardScene[];
  platformOptimized: string[];
}
