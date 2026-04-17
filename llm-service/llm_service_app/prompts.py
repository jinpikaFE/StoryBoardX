def build_system_prompt(payload: dict) -> str:
    prompt_mode = payload.get("promptMode") or "scene"
    battle_mode_format = (
        """
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
"""
        if prompt_mode == "battle"
        else ""
    )

    plans_count_desc = "包含1个方案" if prompt_mode == "battle" else "包含2个方案"
    plan_task_desc = (
        "你需要根据用户提供的剧情概要和参数设置，生成1套详细的战斗分镜提示词方案。"
        if prompt_mode == "battle"
        else "你需要根据用户提供的剧情概要和参数设置，生成2套不同风格的详细电影级分镜提示词方案。"
    )

    battle_extra_fields = (
        """
    "coreTheme": "核心主题描述",
    "visualStyleDetail": {
      "quality": "画质风格描述",
      "effects": "特效层级描述"
    },
    "cameraAndRhythm": {
      "cameraWork": "专业电影运镜描述",
      "pacing": "快慢结合与节奏描述"
    },
    "actionDesign": "动作设计核心描述","""
        if prompt_mode == "battle"
        else ""
    )

    battle_scene_title = "【镜头1：标题·副标题】" if prompt_mode == "battle" else "场景标题"
    battle_action_flow_field = '\n        "actionFlow": "动作流描述",' if prompt_mode == "battle" else ""
    battle_global_requirements = '\n    "globalRequirements": "全局整合要求",' if prompt_mode == "battle" else ""

    return f"""你是一位专业的电影分镜师和AI视频生成专家，擅长将简单的剧情描述转化为专业的分镜脚本。
{plan_task_desc}
{battle_mode_format}
输出格式要求（JSON数组，{plans_count_desc}）：
[
  {{
    "planId": 1,
    "title": "方案标题（如：英雄史诗版）",
    "description": "方案风格描述",
    "visualStyleSummary": "视觉风格总结",{battle_extra_fields}
    "scenes": [
      {{
        "shotNumber": 1,
        "sceneTitle": "{battle_scene_title}",
        "startTime": 0,
        "endTime": 3,
        "shotType": "主观视角",
        "cameraAngle": "手持镜头",
        "cameraMovement": "轻微晃动",
        "description": "详细画面描述",{battle_action_flow_field}
        "visualEffects": "视觉特效说明",
        "sound": "背景音效提示",
        "dialogue": "对白/旁白内容",
        "subjectInfo": "画面主体描述"
      }}
    ],{battle_global_requirements}
    "platformOptimized": ["即梦", "可灵", "Sora"]
  }}
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
- 镜头时长总和必须等于总时长"""


def build_user_prompt(payload: dict) -> str:
    prompt_mode = payload.get("promptMode") or "scene"
    include_dialogue = bool(payload.get("includeDialogue"))
    dialogue_language = payload.get("dialogueLanguage") or "auto"
    narration_style = payload.get("narrationStyle") or "none"

    if include_dialogue:
        dialogue_info = f"""- 包含台词/对白
- 台词语言：{dialogue_language}
- 旁白风格：{narration_style}"""
    else:
        dialogue_info = "- 不包含台词"

    if prompt_mode == "scene":
        prompt_mode_info = '场景模式：用户将看到"场景一：开场即高燃 · 兵器相接"这样的标题格式'
    elif prompt_mode == "battle":
        prompt_mode_info = "场景战斗模式：用户将看到详细的战斗分镜格式"
    else:
        prompt_mode_info = '时间模式：用户将看到"0-4秒画面:"这样的时间标题格式'

    music_style = payload.get("musicStyle") or "auto"
    sound_note = (
        """
【重要音效要求】
用户选择了"仅音效"模式，每个镜头的sound字段必须：
1. 明确标注"无背景音乐，无BGM"
2. 只保留环境音效"""
        if music_style == "silent-sfx"
        else ""
    )

    start_frame = payload.get("startFrame")
    start_frame_desc = payload.get("startFrameDesc")
    end_frame = payload.get("endFrame")
    end_frame_desc = payload.get("endFrameDesc")

    start_frame_block = ""
    if start_frame or start_frame_desc:
        start_frame_block = f"""
【首帧画面】
{start_frame_desc or '（用户已上传首帧图片）'}
{'首帧图片已上传，请根据首帧画面内容作为视频起始画面。' if start_frame else ''}"""

    end_frame_block = ""
    if end_frame or end_frame_desc:
        end_frame_block = f"""
【尾帧画面】
{end_frame_desc or '（用户已上传尾帧图片）'}
{'尾帧图片已上传，请根据尾帧画面内容作为视频结束画面。' if end_frame else ''}"""

    plans_desc = "1套" if prompt_mode == "battle" else "2套"
    final_desc = "1套完整的战斗分镜方案" if prompt_mode == "battle" else "2套风格差异明显的分镜方案"

    return f"""请根据以下信息生成{plans_desc}专业的分镜方案：

【剧情概要】
{payload.get("brief")}

【参数设置】
- 视频总时长：{payload.get("duration")}秒
- 画面比例：{payload.get("aspectRatio")}
- 视觉风格：{payload.get("visualStyle")}
- 叙事节奏：{payload.get("narrativePace")}
- 音效/配乐倾向：{music_style}
- 提示词展示模式：{prompt_mode_info}
{sound_note}
{dialogue_info}
{start_frame_block}
{end_frame_block}

请生成{final_desc}，输出JSON数组格式。"""

