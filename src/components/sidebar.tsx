import React, { useState } from 'react';
import { HistoryItem } from '@/types';
import { Plus, Trash2, Clock, X, Trash } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface SidebarProps {
  history: HistoryItem[];
  onNewTask: () => void;
  onLoadHistory: (item: HistoryItem) => void;
  onDeleteHistory: (id: number) => void;
  onClearAllHistory: () => void;
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (open: boolean) => void;
  selectedHistoryId?: number | null;
}

/**
 * 从brief中提取内容标题
 * 格式示例：核心风格：... 内容：关羽大战刘备 人物：... RAG：...
 * 提取"内容："到" 人物："之间的文本作为标题（注意"人物"前有空格）
 */
function extractTitle(brief: string): string {
  if (!brief) return '';
  
  // 尝试匹配"内容："到" 人物："之间的文本
  // 使用"\s+人物"（空格+人物）作为边界，确保只匹配" 人物："标签，避免匹配内容中的"人物"词汇
  const contentMatch = brief.match(/内容[：:]\s*(.+?)(?=\s+人物[：:]|$)/);
  if (contentMatch && contentMatch[1]) {
    return contentMatch[1].trim();
  }
  
  // 如果没有"内容："字段，尝试提取" 人物："之前的文本
  const beforePersonMatch = brief.match(/^(.+?)(?=\s+人物[：:])/);
  if (beforePersonMatch && beforePersonMatch[1]) {
    // 如果有"核心风格："，去掉它
    const result = beforePersonMatch[1].replace(/核心风格[：:]\s*/, '').trim();
    return result || brief;
  }
  
  // 否则返回原brief
  return brief;
}

export function Sidebar({ 
  history, 
  onNewTask, 
  onLoadHistory, 
  onDeleteHistory,
  onClearAllHistory,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  selectedHistoryId
}: SidebarProps) {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<HistoryItem | null>(null);
  const [clearAllConfirmOpen, setClearAllConfirmOpen] = useState(false);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  const handleNewTask = () => {
    onNewTask();
    setIsMobileMenuOpen?.(false);
  };

  const handleLoadHistory = (item: HistoryItem) => {
    onLoadHistory(item);
    setIsMobileMenuOpen?.(false);
  };

  const handleDeleteClick = (e: React.MouseEvent, item: HistoryItem) => {
    e.stopPropagation();
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      onDeleteHistory(itemToDelete.id);
    }
    setDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  const handleClearAllClick = () => {
    setClearAllConfirmOpen(true);
  };

  const handleConfirmClearAll = () => {
    onClearAllHistory();
    setClearAllConfirmOpen(false);
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
            JinPikaStoryboards
          </h1>
          <p className="text-xs text-gray-500 mt-1">AI分镜提示词生成器</p>
        </div>
        {/* 移动端关闭按钮 */}
        <button
          onClick={() => setIsMobileMenuOpen?.(false)}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* 新任务按钮 */}
      <div className="p-4">
        <button
          onClick={handleNewTask}
          className="w-full px-4 py-2.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          新任务
        </button>
      </div>

      {/* 历史记录 */}
      <div className="flex-1 overflow-auto px-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            历史生成记录
          </h3>
          {history.length > 0 && (
            <button
              onClick={handleClearAllClick}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
            >
              <Trash className="w-3 h-3" />
              清空
            </button>
          )}
        </div>
        {history.length === 0 ? (
          <div className="text-center text-gray-400 text-sm py-8">
            暂无历史记录
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((item) => (
              <div
                key={item.id}
                className={`group p-3 rounded-lg text-left transition-colors cursor-pointer relative ${
                  selectedHistoryId === item.id
                    ? 'bg-purple-100 border-2 border-purple-400'
                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <div
                  onClick={() => handleLoadHistory(item)}
                  className="pr-8"
                >
                  <p className={`text-sm font-medium line-clamp-2 mb-1 ${
                    selectedHistoryId === item.id ? 'text-purple-900' : 'text-gray-700'
                  }`}>
                    {extractTitle(item.brief)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(item.created_at)}
                  </p>
                </div>
                <button
                  onClick={(e) => handleDeleteClick(e, item)}
                  className={`absolute top-3 right-3 p-1 transition-all ${
                    selectedHistoryId === item.id
                      ? 'text-purple-400 hover:text-red-500 opacity-100'
                      : 'text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* 桌面端侧边栏 */}
      <div className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col h-full">
        {sidebarContent}
      </div>

      {/* 移动端抽屉 */}
      {isMobileMenuOpen && (
        <>
          {/* 遮罩层 */}
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen?.(false)}
          />
          {/* 抽屉内容 */}
          <div className="fixed left-0 top-0 h-full w-72 bg-white z-50 lg:hidden flex flex-col shadow-xl animate-in slide-in-from-left duration-300">
            {sidebarContent}
          </div>
        </>
      )}

      {/* 删除单条确认弹窗 */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除这条历史记录吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          {itemToDelete && (
            <div className="p-3 bg-gray-100 rounded-lg -mt-2">
              <p className="text-sm text-gray-700 line-clamp-2">
                {extractTitle(itemToDelete.brief)}
              </p>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 清空全部确认弹窗 */}
      <AlertDialog open={clearAllConfirmOpen} onOpenChange={setClearAllConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认清空全部历史记录</AlertDialogTitle>
            <AlertDialogDescription>
              确定要清空所有历史记录吗？此操作将删除 {history.length} 条记录，且无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmClearAll}
              className="bg-red-500 hover:bg-red-600"
            >
              确认清空
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
