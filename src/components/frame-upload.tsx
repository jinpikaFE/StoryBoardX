import React, { useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface FrameUploadProps {
  startFrame: string | null;
  endFrame: string | null;
  startFrameDesc: string;
  endFrameDesc: string;
  setStartFrame: (url: string | null) => void;
  setEndFrame: (url: string | null) => void;
  setStartFrameDesc: (desc: string) => void;
  setEndFrameDesc: (desc: string) => void;
}

export function FrameUpload({
  startFrame,
  endFrame,
  startFrameDesc,
  endFrameDesc,
  setStartFrame,
  setEndFrame,
  setStartFrameDesc,
  setEndFrameDesc,
}: FrameUploadProps) {
  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'start' | 'end'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('图片大小不能超过5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (type === 'start') {
        setStartFrame(dataUrl);
      } else {
        setEndFrame(dataUrl);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemoveStart = () => {
    setStartFrame('');
    setStartFrameDesc('');
  };

  const handleRemoveEnd = () => {
    setEndFrame(null);
    setEndFrameDesc('');
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <ImageIcon className="w-5 h-5 text-orange-500" />
        <h3 className="text-lg font-semibold text-gray-900">首尾帧（可选）</h3>
        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-medium rounded">
          可选
        </span>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        上传首帧和尾帧图片，AI将根据图片内容生成衔接合理的分镜提示词
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 首帧上传 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">起</span>
            首帧图片
          </label>
          
          {startFrame ? (
            <div className="relative">
              <img
                src={startFrame}
                alt="首帧"
                className="w-full h-32 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={()=>handleRemoveStart()}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md z-10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => startInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50/50 transition-all"
            >
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">点击上传首帧图片</p>
              <p className="text-xs text-gray-400 mt-1">支持 JPG、PNG，最大5MB</p>
            </div>
          )}
          
          <input
            ref={startInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e, 'start')}
            className="hidden"
          />

          {startFrame && (
            <textarea
              value={startFrameDesc}
              onChange={(e) => setStartFrameDesc(e.target.value)}
              placeholder="描述首帧画面内容（可选）"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              rows={2}
            />
          )}
        </div>

        {/* 尾帧上传 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">终</span>
            尾帧图片
          </label>
          
          {endFrame ? (
            <div className="relative">
              <img
                src={endFrame}
                alt="尾帧"
                className="w-full h-32 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={()=>handleRemoveEnd()}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md z-10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => endInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50/50 transition-all"
            >
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">点击上传尾帧图片</p>
              <p className="text-xs text-gray-400 mt-1">支持 JPG、PNG，最大5MB</p>
            </div>
          )}
          
          <input
            ref={endInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e, 'end')}
            className="hidden"
          />

          {endFrame && (
            <textarea
              value={endFrameDesc}
              onChange={(e) => setEndFrameDesc(e.target.value)}
              placeholder="描述尾帧画面内容（可选）"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              rows={2}
            />
          )}
        </div>
      </div>

      {(startFrame || endFrame) && (
        <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
          <p className="text-sm text-orange-700">
            <span className="font-medium">提示：</span>
            AI将根据您上传的{startFrame ? '首帧' : ''}{startFrame && endFrame ? '和' : ''}{endFrame ? '尾帧' : ''}图片内容，生成自然衔接的分镜提示词。
          </p>
        </div>
      )}
    </div>
  );
}
