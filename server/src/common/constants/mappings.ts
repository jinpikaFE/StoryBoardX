// 视觉风格映射
export const STYLE_MAP: Record<string, string> = {
  cinematic: '电影感，专业电影质感，注重光影和画面构图',
  anime: '日式动漫风格，色彩鲜明，角色表现力强',
  realistic: '写实纪录片风格，自然真实，注重细节捕捉',
  noir: '经典黑色电影风格，强烈明暗对比，神秘氛围',
  scifi: '未来科幻质感，高科技元素，炫酷视觉效果',
  fantasy: '魔幻奇幻风格，梦幻色彩，特效华丽',
  retro: '复古怀旧风格，温暖色调，经典电影感',
  minimalist: '简约现代风格，简洁构图，留白艺术',
};

// 叙事节奏映射
export const PACE_MAP: Record<string, string> = {
  standard: '标准叙事：远景开场→中近景发展→特写高潮→拉远收束',
  fast: '快节奏剪辑：快切、短镜头、密集动作，适合预告片/广告',
  slow: '文艺慢节奏：长镜头、慢运镜、留白，适合情感/风景片',
  progressive: '递进式：镜头由静至动、由慢到快层层递进',
  cross: '交叉叙事：两条线交替剪辑（Meanwhile...）',
  flashback: '倒叙式：高潮前置→闪回→回到现在',
  montage: '蒙太奇：经典蒙太奇剪辑，多场景并置',
};

// 语言映射
export const LANGUAGE_MAP: Record<string, string> = {
  auto: '由AI根据剧情自动匹配',
  zh: '中文',
  en: 'English',
  ja: '日本語',
  ko: '한국어',
};

// 旁白风格映射
export const NARRATION_MAP: Record<string, string> = {
  none: '无旁白纯对白',
  'male-calm': '男声沉稳旁白',
  'female-gentle': '女声温柔旁白',
  'first-person': '第一人称独白',
};

// 音乐风格映射
export const MUSIC_MAP: Record<string, string> = {
  auto: '由AI自动匹配',
  'epic-orchestral': '史诗管弦乐',
  'electronic-ambient': '电子氛围',
  'piano-soft': '钢琴轻柔',
  'folk-guitar': '民谣吉他',
  'chinese-classical': '中国传统古风',
  'jazz-vintage': '爵士复古',
  'rock-intense': '摇滚激烈',
  'nature-sounds': '自然环境音',
  'suspense-tense': '电影悬疑紧张',
  'silent-sfx': '仅音效（无背景音乐，仅保留环境音如风声、雷声、雨声、燃烧声、脚步声、打斗声、战斗特效音等）',
};
