export type CaseStudy = {
  slug: string;
  index: string;
  title: string;
  englishTitle: string;
  category: string;
  year: string;
  image: string;
  document?: string;
  summary: string;
  tone: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "daily-lazcash",
    index: "01",
    title: "Daily LazCash 调研助手",
    englishTitle: "Gamified Research Assistant",
    category: "增长设计 · 用户研究 · AI 工作流",
    year: "2025",
    image: "/cases/daily-lazcash.png",
    summary:
      "将问卷任务嵌入游戏化增长场景，让用户反馈成为自然、低负担的体验环节。",
    tone: "tone-lime",
  },
  {
    slug: "xiaolu-medical",
    index: "02",
    title: "小麓医疗导诊机器人",
    englishTitle: "Medical Guidance Robot",
    category: "服务设计 · 智能硬件 · 交互设计",
    year: "2023",
    image: "/cases/xiaolu-medical.png",
    document: "/documents/xiaolu-medical.pdf",
    summary:
      "面向医院复杂就诊场景，探索从导诊、情绪反馈到服务协同的一体化体验。",
    tone: "tone-sky",
  },
  {
    slug: "dance-plus",
    index: "03",
    title: "Dance+ 舞蹈家",
    englishTitle: "Connected Dance Experience",
    category: "多端体验 · 交互设计 · 视觉设计",
    year: "2021",
    image: "/cases/dance-plus.png",
    document: "/documents/dance-plus.pdf",
    summary:
      "连接手机、电视与手表的家庭舞蹈体验，让练习、陪伴和分享自然发生。",
    tone: "tone-violet",
  },
  {
    slug: "wildsit-game",
    index: "04",
    title: "Wildsit 科普小游戏",
    englishTitle: "Nature Learning Game",
    category: "游戏化设计 · 插画 · 儿童体验",
    year: "2020",
    image: "/cases/wildsit-game.png",
    summary:
      "把动物认知与轻量挑战结合，在探索、收集与成长中完成自然科普。",
    tone: "tone-aqua",
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((item) => item.slug === slug);
}
