import { StoryboardConfig, HistoryItem } from '@/types';

const API_BASE = '/api';

// 生成分镜提示词（流式）
export async function generateStoryboard(
  config: StoryboardConfig,
  onChunk: (content: string) => void,
  onComplete: (plans: any[]) => void,
  onError: (error: string) => void
) {
  try {
    const response = await fetch(`${API_BASE}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      throw new Error('生成失败');
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('无法读取响应流');
    }

    const decoder = new TextDecoder();
    let fullContent = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            // 解析完整的JSON内容
            try {
              const jsonArrayMatch = fullContent.match(/\[[\s\S]*\]/);
              if (jsonArrayMatch) {
                let jsonStr = jsonArrayMatch[0];
                jsonStr = jsonStr.replace(/\/\/.*$/gm, '');
                jsonStr = jsonStr.replace(/\/\*[\s\S]*?\*\//g, '');
                jsonStr = jsonStr.replace(/```json\s*/gi, '');
                jsonStr = jsonStr.replace(/```\s*/g, '');
                jsonStr = jsonStr.replace(/[""]/g, '"');
                jsonStr = jsonStr.replace(/,(\s*[\]}])/g, '$1');
                
                const plans = JSON.parse(jsonStr);
                if (Array.isArray(plans)) {
                  onComplete(plans);
                }
              } else {
                const jsonMatch = fullContent.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                  let jsonStr = jsonMatch[0];
                  jsonStr = jsonStr.replace(/\/\/.*$/gm, '');
                  jsonStr = jsonStr.replace(/\/\*[\s\S]*?\*\//g, '');
                  jsonStr = jsonStr.replace(/```json\s*/gi, '');
                  jsonStr = jsonStr.replace(/```\s*/g, '');
                  jsonStr = jsonStr.replace(/[""]/g, '"');
                  jsonStr = jsonStr.replace(/,(\s*[\]}])/g, '$1');
                  
                  const plan = JSON.parse(jsonStr);
                  onComplete([plan]);
                }
              }
            } catch (e) {
              console.error('解析JSON失败:', e);
              onError('AI返回的内容格式有误，请重新生成');
            }
            break;
          }

          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              fullContent += parsed.content;
              onChunk(fullContent);
            }
          } catch (e) {
            // 忽略解析错误
          }
        }
      }
    }
  } catch (error) {
    onError(error instanceof Error ? error.message : '生成失败');
  }
}

// 获取历史记录
export async function getHistory(): Promise<HistoryItem[]> {
  const response = await fetch(`${API_BASE}/history`);
  const data = await response.json();
  return data.data || [];
}

// 保存历史记录
export async function saveHistory(config: StoryboardConfig, result: any[]): Promise<HistoryItem> {
  const response = await fetch(`${API_BASE}/history`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...config,
      result,
    }),
  });
  const data = await response.json();
  return data.data;
}

// 删除单条历史记录
export async function deleteHistory(id: number): Promise<void> {
  await fetch(`${API_BASE}/history?id=${id}`, { method: 'DELETE' });
}

// 清空所有历史记录
export async function clearAllHistory(): Promise<void> {
  await fetch(`${API_BASE}/history`, { method: 'DELETE' });
}
