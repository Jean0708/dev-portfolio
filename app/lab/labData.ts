export type LabMediaKind = "website" | "app" | "video" | "animation";

export type LabProject = {
  slug: string;
  index: string;
  title: string;
  englishTitle: string;
  category: string;
  year: string;
  cover: string;
  mediaKind: LabMediaKind;
  mediaLabel: string;
  summary: string;
  reflection: string;
  process: string[];
  outcomes: string[];
  screens?: string[];
  videoSrc?: string;
  accent: "cyan" | "violet" | "green" | "pink" | "gold";
};

export const labProjects: LabProject[] = [
  {
    slug: "perxio-workspace",
    index: "01",
    title: "Perxio 派研 · 增长调研工作台",
    englishTitle: "Perxio Research Workspace",
    category: "AI 研究工具 · Web 产品 · 端到端工作流",
    year: "2026.08",
    cover: "/assets/lab/projects/perxio-workspace.jpg",
    mediaKind: "website",
    mediaLabel: "WEB PRODUCT",
    summary: "把问卷、数据清洗、体验诊断、报告与迭代回流串成一条可追踪的增长活动研究闭环。",
    reflection: "这次实验的重点不是再做一个聊天入口，而是把研究判断放回真实业务流程，让每一步输入、输出和责任人都能被看见。",
    process: ["拆解调研闭环与角色权限", "搭建工作台和 H5 问卷双端", "用 AI 诊断连接证据与建议"],
    outcomes: ["Web 工作台", "移动问卷原型", "闭环流程与模块范围"],
    screens: [
      "/assets/lab/projects/perxio-dashboard.png",
      "/assets/lab/projects/perxio-closed-loop.png",
    ],
    accent: "cyan",
  },
  {
    slug: "hapopus-haptics",
    index: "02",
    title: "HapOpus 振动设计工具",
    englishTitle: "HapOpus Haptic Tool",
    category: "App 原型 · 触感体验 · 研究工具",
    year: "2022 / REFRAMED 2026",
    cover: "/assets/lab/projects/hapopus-haptics.jpg",
    mediaKind: "app",
    mediaLabel: "APP PROTOTYPE",
    summary: "把难以描述的振动体验转译为可试听、拼接、调整并协作交付的移动端设计工具。",
    reflection: "回看这个早期概念，最有价值的不是界面数量，而是把抽象感受变成可操作参数的尝试；这也成为后来做 AI 工具时的重要方法。",
    process: ["访谈并记录振动感知差异", "把波形和节奏映射为编辑参数", "验证创作、预览与交付路径"],
    outcomes: ["高保真 App 原型", "触感编辑器", "研究与实验记录"],
    screens: [
      "/case-pages/v2/hapopus-haptics/page-04.jpg",
      "/case-pages/v2/hapopus-haptics/page-06.jpg",
      "/case-pages/v2/hapopus-haptics/page-08.jpg",
    ],
    accent: "cyan",
  },
  {
    slug: "dance-plus",
    index: "03",
    title: "Dance+ 多端舞蹈体验",
    englishTitle: "Dance Plus Experience",
    category: "多端原型 · 交互设计 · 视频演示",
    year: "2021 / REFRAMED 2026",
    cover: "/assets/lab/projects/dance-plus.jpg",
    mediaKind: "video",
    mediaLabel: "PRODUCT VIDEO",
    summary: "连接手机、电视和手表，让内容发现、跟练反馈与家庭舞蹈场景自然衔接。",
    reflection: "多端不是把同一界面缩放三次，而是让每块屏幕承担最适合它的任务：手机负责选择，电视负责沉浸，手表负责轻反馈。",
    process: ["划分三端任务与信息层级", "梳理跟练和反馈闭环", "用视频验证多端切换节奏"],
    outcomes: ["手机端原型", "TV 端体验", "Watch 端反馈与演示视频"],
    screens: ["/assets/lab/projects/dance-plus.jpg"],
    videoSrc: "/assets/work-media/dance-plus.mp4",
    accent: "violet",
  },
  {
    slug: "wildsit-game",
    index: "04",
    title: "西特公园 · 自然探索游戏",
    englishTitle: "Wildsit Nature Game",
    category: "游戏原型 · 插画 · 儿童体验",
    year: "2020 / REFRAMED 2026",
    cover: "/assets/lab/projects/wildsit-game.jpg",
    mediaKind: "app",
    mediaLabel: "GAME PROTOTYPE",
    summary: "用地图探索、动物图鉴和轻量任务，把自然科普转化为儿童可以主动参与的游戏体验。",
    reflection: "游戏化真正有效的部分不是积分，而是好奇心被下一次发现持续牵引；复盘时因此保留探索与收集，弱化了纯奖励叙事。",
    process: ["建立动物认知与探索目标", "设计地图、图鉴与任务循环", "用插画统一教育与游戏语气"],
    outcomes: ["移动游戏原型", "角色与地图插画", "探索任务系统"],
    screens: [
      "/case-pages/v2/wildsit-game/page-02.jpg",
      "/case-pages/v2/wildsit-game/page-05.jpg",
      "/case-pages/v2/wildsit-game/page-07.jpg",
    ],
    accent: "green",
  },
  {
    slug: "vibe-coding-navigator",
    index: "05",
    title: "Vibe Coding 导航站",
    englishTitle: "Vibe Coding Navigator",
    category: "资源网站 · 信息架构 · 快速构建",
    year: "2026.06",
    cover: "/assets/lab/projects/vibe-coding-navigator.jpg",
    mediaKind: "website",
    mediaLabel: "WEBSITE",
    summary: "把分散的模型、工具和案例按创作任务重新分类，验证设计师如何更快进入 vibe coding 工作流。",
    reflection: "第一次把 AI 工具探索做成可浏览的产品，而不是个人收藏夹。最大的收获是：分类应该从使用任务出发，而不是照搬工具厂商的能力名称。",
    process: ["盘点高频创作任务", "重组工具分类与筛选逻辑", "快速搭建并迭代导航体验"],
    outcomes: ["导航站原型", "工具分类体系", "vibe coding 入口地图"],
    screens: ["/assets/lab/projects/vibe-coding-navigator.jpg"],
    accent: "pink",
  },
  {
    slug: "realtime-voice-chat",
    index: "06",
    title: "Realtime Voice Chat",
    englishTitle: "Realtime Voice Chat",
    category: "App 原型 · 实时语音 · 对话体验",
    year: "2026.07",
    cover: "/assets/lab/projects/realtime-voice-chat.jpg",
    mediaKind: "app",
    mediaLabel: "APP PROTOTYPE",
    summary: "围绕听、说、打断和等待状态，探索实时语音 AI 在移动端应该如何给出清晰又不过度打扰的反馈。",
    reflection: "语音产品最难设计的不是麦克风按钮，而是节奏感。原型把状态切换、抢话与恢复放在视觉中心，避免用户不知道 AI 是否仍在听。",
    process: ["定义听说与打断状态机", "设计波形、等待和错误反馈", "用短路径原型验证对话节奏"],
    outcomes: ["移动端交互原型", "语音状态系统", "录屏验证方案"],
    screens: ["/assets/lab/projects/realtime-voice-chat.jpg"],
    accent: "violet",
  },
  {
    slug: "tarot-story-game",
    index: "07",
    title: "塔罗叙事小游戏",
    englishTitle: "Tarot Story Game",
    category: "网页游戏 · 生成式叙事 · 氛围设计",
    year: "2026.07",
    cover: "/assets/lab/projects/tarot-story-game.jpg",
    mediaKind: "website",
    mediaLabel: "WEB GAME",
    summary: "用抽牌、选择与生成式文本组成轻量叙事游戏，练习如何让 AI 参与内容变化而不夺走用户的主动感。",
    reflection: "生成内容越丰富，越需要明确的交互边界。这个实验把 AI 放在解释与联想层，而把抽牌、选择和节奏继续交给用户。",
    process: ["搭建抽牌与结果路径", "限定生成内容的角色", "用视觉和转场建立仪式感"],
    outcomes: ["可玩网页原型", "卡牌视觉方向", "生成式叙事规则"],
    screens: ["/assets/lab/projects/tarot-story-game.jpg"],
    accent: "gold",
  },
  {
    slug: "raddie-sprite-pipeline",
    index: "08",
    title: "萝卜狗精灵图与动画管线",
    englishTitle: "Raddie Sprite Pipeline",
    category: "角色动画 · AI 工作流 · 素材管线",
    year: "2026.07—08",
    cover: "/assets/lab/projects/raddie-sprite-pipeline.jpg",
    mediaKind: "animation",
    mediaLabel: "ANIMATION",
    summary: "从角色三视图、动作拆解到网页动画接入，建立可反复迭代的萝卜狗 IP 素材管线。",
    reflection: "这组实验让“生成一张图”变成“维护一个角色系统”。一致性、命名和可回溯源文件，比单次画面惊艳更重要。",
    process: ["统一角色比例与多视角", "拆分动作并验证循环节奏", "接入网站并保留源素材映射"],
    outcomes: ["角色设定与精灵图", "循环动画", "可维护的素材目录"],
    screens: ["/assets/lab/projects/raddie-sprite-pipeline.jpg"],
    videoSrc: "/assets/work-media/ip-animation.mp4",
    accent: "green",
  },
];
