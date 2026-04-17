import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { MainContent } from '@/components/main-content';
import { StoryboardResult } from '@/components/storyboard-result';
import { Menu } from 'lucide-react';
import { StoryboardConfig, HistoryItem, StoryboardPlan } from '@/types';
import { generateStoryboard, getHistory, saveHistory, deleteHistory, clearAllHistory } from '@/services/api';

const defaultConfig: StoryboardConfig = {
  brief: '',
  duration: 15,
  aspectRatio: '16:9',
  visualStyle: 'cinematic',
  narrativePace: 'fast',
  includeDialogue: false,
  dialogueLanguage: 'auto',
  narrationStyle: 'none',
  musicStyle: 'silent-sfx',
  model: 'doubao-seed-2-0-lite-260215',
  promptMode: 'scene',
  startFrame: null,
  endFrame: null,
  startFrameDesc: '',
  endFrameDesc: '',
};

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [config, setConfig] = useState<StoryboardConfig>(defaultConfig);
  const [isGenerating, setIsGenerating] = useState(false);
  const [storyboardPlans, setStoryboardPlans] = useState<StoryboardPlan[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedHistoryId, setSelectedHistoryId] = useState<number | null>(null);

  // 加载历史记录
  const loadHistory = async () => {
    try {
      const data = await getHistory();
      setHistory(data);
    } catch (error) {
      console.error('加载历史记录失败:', error);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleNewTask = () => {
    setConfig(defaultConfig);
    setShowResults(false);
    setStoryboardPlans([]);
    setStreamingContent('');
    setCurrentStep(0);
    setSelectedHistoryId(null);
  };

  const handleLoadHistory = (item: HistoryItem) => {
    setConfig({
      brief: item.brief,
      duration: item.duration,
      aspectRatio: item.aspect_ratio,
      visualStyle: item.visual_style,
      narrativePace: item.narrative_pace,
      includeDialogue: item.include_dialogue === 1,
      dialogueLanguage: item.dialogue_language || 'auto',
      narrationStyle: item.narration_style || 'none',
      musicStyle: item.music_style || 'auto',
      model: item.model,
      promptMode: (item.prompt_mode as 'time' | 'scene' | 'battle') || 'time',
      startFrame: item.start_frame || null,
      endFrame: item.end_frame || null,
      startFrameDesc: item.start_frame_desc || '',
      endFrameDesc: item.end_frame_desc || '',
    });
    setSelectedHistoryId(item.id);
    if (item.result) {
      if (Array.isArray(item.result)) {
        setStoryboardPlans(item.result);
      } else {
        setStoryboardPlans([item.result]);
      }
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  const handleDeleteHistory = async (id: number) => {
    try {
      await deleteHistory(id);
      setHistory(history.filter(item => item.id !== id));
    } catch (error) {
      console.error('删除历史记录失败:', error);
    }
  };

  const handleClearAllHistory = async () => {
    try {
      await clearAllHistory();
      setHistory([]);
      setSelectedHistoryId(null);
    } catch (error) {
      console.error('清空历史记录失败:', error);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setShowResults(true);
    setStreamingContent('');
    setStoryboardPlans([]);

    await generateStoryboard(
      config,
      // onChunk
      (content) => setStreamingContent(content),
      // onComplete
      async (plans) => {
        setStoryboardPlans(plans);
        if (plans.length > 0) {
          try {
            await saveHistory(config, plans);
            loadHistory();
          } catch (error) {
            console.error('保存历史记录失败:', error);
          }
        }
        setIsGenerating(false);
      },
      // onError
      (error) => {
        console.error('生成失败:', error);
        alert(error);
        setIsGenerating(false);
      }
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* 移动端汉堡菜单按钮 */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="fixed top-4 left-4 z-30 lg:hidden p-2 bg-white rounded-lg shadow-md border border-gray-200"
      >
        <Menu className="w-5 h-5 text-gray-600" />
      </button>
      
      <Sidebar
        history={history}
        onNewTask={handleNewTask}
        onLoadHistory={handleLoadHistory}
        onDeleteHistory={handleDeleteHistory}
        onClearAllHistory={handleClearAllHistory}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        selectedHistoryId={selectedHistoryId}
      />
      <main className="flex-1 overflow-auto">
        {!showResults ? (
          <MainContent
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            config={config}
            setConfig={setConfig}
            onGenerate={handleGenerate}
          />
        ) : (
          <StoryboardResult
            plans={storyboardPlans}
            isGenerating={isGenerating}
            config={config}
            onBack={() => setShowResults(false)}
            streamingContent={streamingContent}
          />
        )}
      </main>
    </div>
  );
}

export default App;
