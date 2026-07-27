"use client";

import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Minus,
  Paperclip,
  Play,
  SkipForward,
  Square,
  VideoCamera,
  X,
} from "@phosphor-icons/react";
import Link from "next/link";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { caseStudies } from "./caseData";

function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={nodeRef} className={`reveal ${className}`}>
      {children}
    </div>
  );
}

const homepageCaseSlugs = [
  "xiaolu-medical",
  "balance-activity",
  "credit-activity",
  "daily-lazcash",
  "dance-plus",
];

const capabilityRows = [
  {
    number: "01",
    title: "增长策略与体验设计",
    detail: "用户路径设计 · 转化漏斗优化 · 激励机制 · A/B 测试",
  },
  {
    number: "02",
    title: "UX / 交互设计",
    detail: "信息架构 · 用户旅程 · 原型设计 · 多端体验",
  },
  {
    number: "03",
    title: "用户研究与数据分析",
    detail: "用户访谈 · 问卷设计 · NPS 分析 · SPSS 统计",
  },
  {
    number: "04",
    title: "AI 设计实践",
    detail: "AI Workflow · Prompt Engineering · Vibe Coding · AIGC",
  },
  {
    number: "05",
    title: "视觉与动效",
    detail: "Figma · Sketch · Photoshop · Illustrator · After Effects",
  },
];

const experiences = [
  {
    time: "2026.03—2026.05",
    company: "阿里巴巴 LAZADA · UX / 交互设计师",
    points: [
      "负责东南亚跨境电商互动增长业务的全链路 UX 设计。",
      "搭建 AI 用户调研助手，打通多语言反馈采集、清洗、分析与报告生成。",
      "推动 10+ 项体验优化进入产品迭代，反馈分析效率提升 60%。",
    ],
  },
  {
    time: "2023.07—2025.10",
    company: "拼多多 TEMU · 设计管培 / 用户体验设计师",
    points: [
      "聚焦跨境电商增长设计，覆盖拉新、促活、转化与留存。",
      "主导 Credit、Balance、全场折扣等互动活动体验设计。",
      "参与 15+ 项目迭代，以数据验证驱动多轮体验优化。",
    ],
  },
  {
    time: "2022.06—2022.10",
    company: "OPPO · 用户研究分析师（实习）",
    points: [
      "参与 ColorOS 体验度量、可用性研究与人因研究项目。",
      "主导 Ozone Web 端 UI 设计与内容体系建设。",
      "完成用户招募、访谈、竞品研究与体验度量指标整理。",
    ],
  },
  {
    time: "2018.08—2019.06",
    company: "深圳囍汇国际创意 · 平面设计师",
    points: [
      "参与品牌升级、VI 规范、品牌 IP 与运营视觉设计。",
      "覆盖官网、电商平台、线上活动与礼品产品的视觉落地。",
      "以扎实的视觉与品牌实践建立体验设计的表达基础。",
    ],
  },
];

export default function PortfolioHome() {
  const heroRef = useRef<HTMLElement>(null);
  const heroWindowRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fadeTimeoutRef = useRef<number | null>(null);
  const isVideoFadingRef = useRef(false);
  const heroDragState = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    windowX: number;
    windowY: number;
  } | null>(null);
  const [heroExpanded, setHeroExpanded] = useState(false);
  const [heroWindowDragging, setHeroWindowDragging] = useState(false);
  const [heroWindowMinimized, setHeroWindowMinimized] = useState(false);
  const [heroWindowPosition, setHeroWindowPosition] = useState({ x: 0, y: 0 });
  const [videoPhase, setVideoPhase] = useState<
    "idle" | "playing" | "fading" | "done"
  >("idle");
  const homeCases = useMemo(
    () =>
      homepageCaseSlugs
        .map((slug) => caseStudies.find((item) => item.slug === slug))
        .filter((item) => item !== undefined),
    [],
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let frame = 0;

    const updateOpacity = () => {
      if (isVideoFadingRef.current) {
        video.style.opacity = "0";
      } else if (video.duration && Number.isFinite(video.duration)) {
        const fade = 0.5;
        const opacity =
          video.currentTime < fade
            ? video.currentTime / fade
            : video.currentTime > video.duration - fade
              ? Math.max(0, (video.duration - video.currentTime) / fade)
              : 1;
        video.style.opacity = String(opacity);
      }
      frame = requestAnimationFrame(updateOpacity);
    };

    frame = requestAnimationFrame(updateOpacity);
    return () => {
      cancelAnimationFrame(frame);
      if (fadeTimeoutRef.current !== null) {
        window.clearTimeout(fadeTimeoutRef.current);
      }
    };
  }, []);

  const completeHeroVideo = () => {
    const video = videoRef.current;
    isVideoFadingRef.current = true;
    if (video) video.style.opacity = "0";
    setVideoPhase("done");
  };

  const clampHeroWindowPosition = (x: number, y: number) => {
    const hero = heroRef.current;
    const frame = heroWindowRef.current;
    if (!hero || !frame) return { x, y };

    const heroBounds = hero.getBoundingClientRect();
    const frameBounds = frame.getBoundingClientRect();
    const horizontalRoom = Math.max(
      18,
      (heroBounds.width - frameBounds.width) / 2 - 14,
    );
    const verticalRoom = Math.min(
      180,
      Math.max(32, (heroBounds.height - frameBounds.height) / 2 - 36),
    );

    return {
      x: Math.min(horizontalRoom, Math.max(-horizontalRoom, x)),
      y: Math.min(verticalRoom, Math.max(-verticalRoom, y)),
    };
  };

  const startHeroWindowMove = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (
      heroExpanded ||
      (event.target as HTMLElement).closest("button, a")
    ) {
      return;
    }

    heroDragState.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      windowX: heroWindowPosition.x,
      windowY: heroWindowPosition.y,
    };
    setHeroWindowDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  };

  const moveHeroWindow = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = heroDragState.current;
    if (!state || state.pointerId !== event.pointerId) return;
    setHeroWindowPosition(
      clampHeroWindowPosition(
        state.windowX + event.clientX - state.startX,
        state.windowY + event.clientY - state.startY,
      ),
    );
  };

  const stopHeroWindowMove = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (heroDragState.current?.pointerId !== event.pointerId) return;
    heroDragState.current = null;
    setHeroWindowDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const moveHeroWindowWithKeyboard = (
    event: ReactKeyboardEvent<HTMLDivElement>,
  ) => {
    if (
      heroExpanded ||
      !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)
    ) {
      return;
    }

    const step = event.shiftKey ? 36 : 14;
    setHeroWindowPosition((current) =>
      clampHeroWindowPosition(
        current.x +
          (event.key === "ArrowLeft"
            ? -step
            : event.key === "ArrowRight"
              ? step
              : 0),
        current.y +
          (event.key === "ArrowUp"
            ? -step
            : event.key === "ArrowDown"
              ? step
              : 0),
      ),
    );
    event.preventDefault();
  };

  const activateHero = () => {
    const video = videoRef.current;
    isVideoFadingRef.current = false;
    setHeroWindowMinimized(false);
    setHeroExpanded(true);
    setVideoPhase("playing");
    if (!video) return;
    video.style.opacity = "0";
    video.currentTime = 0;
    void video.play();
  };

  const skipHeroVideo = () => {
    if (videoPhase !== "playing") return;
    const video = videoRef.current;
    isVideoFadingRef.current = true;
    setVideoPhase("fading");
    if (video) video.style.opacity = "0";

    if (fadeTimeoutRef.current !== null) {
      window.clearTimeout(fadeTimeoutRef.current);
    }
    fadeTimeoutRef.current = window.setTimeout(() => {
      video?.pause();
      setVideoPhase("done");
      fadeTimeoutRef.current = null;
    }, 760);
  };

  const dismissHeroIntro = () => {
    const video = videoRef.current;
    isVideoFadingRef.current = true;
    setHeroWindowMinimized(false);
    setHeroExpanded(true);
    setVideoPhase("done");
    if (video) {
      video.pause();
      video.style.opacity = "0";
    }
  };

  return (
    <main id="top">
      <header className="site-nav">
        <Link href="#top" className="brand-mark" aria-label="返回首页">
          JEAN ZHOU<sup>®</sup>
        </Link>
        <nav aria-label="主导航">
          <Link href="#work">WORK</Link>
          <Link href="#about">ABOUT</Link>
          <Link href="#practice">PRACTICE</Link>
          <Link href="#experience">EXPERIENCE</Link>
          <Link href="#capabilities">SKILL</Link>
          <Link href="#contact">联系方式</Link>
        </nav>
        <Link href="#contact" className="nav-cta">
          SAY HELLO
        </Link>
      </header>

      <section
        ref={heroRef}
        className={`hero ${
          heroExpanded ? "hero-expanded" : "hero-idle"
        } hero-video-${videoPhase}`}
        aria-label="Jean Zhou 个人介绍"
      >
        <img
          className="hero-landscape"
          src="/assets/hero-still.png"
          alt=""
          aria-hidden="true"
        />
        <div className="hero-cinematic-overlay" aria-hidden="true" />

        <div className="hero-copy">
          <p className="eyebrow">EXPERIENCE DESIGNER · 2026 PORTFOLIO</p>
          <h1 lang="zh-CN">
            理解复杂问题，
            <br />
            设计清晰的体验。
          </h1>
          <p className="hero-description">
            I turn complex systems into clear, gentle experiences.
          </p>
          <Link href="#work" className="pill-button hero-link">
            EXPLORE SELECTED WORK <ArrowUpRight weight="bold" />
          </Link>
        </div>

        <div
          ref={heroWindowRef}
          className={[
            "film-window",
            `film-${videoPhase}`,
            heroWindowMinimized && !heroExpanded
              ? "home-window-minimized"
              : "",
            heroWindowDragging ? "is-dragging" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          style={
            heroExpanded
              ? undefined
              : {
                  transform: `translate(-50%, -44%) translate3d(${heroWindowPosition.x}px, ${heroWindowPosition.y}px, 0)`,
                }
          }
        >
          <div
            className="window-bar"
            role="toolbar"
            aria-label="拖动首页动画窗口"
            tabIndex={0}
            onPointerDown={startHeroWindowMove}
            onPointerMove={moveHeroWindow}
            onPointerUp={stopHeroWindowMove}
            onPointerCancel={stopHeroWindowMove}
            onKeyDown={moveHeroWindowWithKeyboard}
          >
            <span className="home-window-title">
              <VideoCamera weight="fill" aria-hidden="true" />
              <b>IP-STORY.MP4</b>
              <i>— JEAN IP</i>
            </span>
            <div className="home-window-controls" aria-label="首页窗口控制">
              <button
                type="button"
                aria-label={
                  heroWindowMinimized ? "展开首页动画窗口" : "最小化首页动画窗口"
                }
                onClick={() => setHeroWindowMinimized((value) => !value)}
              >
                <Minus weight="bold" />
              </button>
              <button
                type="button"
                aria-label="放大并播放首页动画"
                onClick={activateHero}
              >
                <Square weight="regular" />
              </button>
              <button
                type="button"
                aria-label="跳过首页开场动画"
                onClick={dismissHeroIntro}
              >
                <X weight="bold" />
              </button>
            </div>
          </div>
          {!heroWindowMinimized && (
            <>
              <div className="home-window-menu" aria-label="首页窗口菜单">
                <span>FILE</span>
                <button type="button" onClick={activateHero}>
                  VIEW
                </button>
                <span>100%</span>
                <span>HELP</span>
              </div>
              <div className="film-viewport">
                <img src="/assets/hero-still.png" alt="" aria-hidden="true" />
                <video
                  ref={videoRef}
                  muted
                  playsInline
                  preload="metadata"
                  poster="/assets/hero-still.png"
                  onEnded={completeHeroVideo}
                >
                  <source src="/assets/ip-running.mp4" type="video/mp4" />
                </video>
                {!heroExpanded && (
                  <button
                    className="film-launch"
                    type="button"
                    onClick={activateHero}
                    aria-label="放大窗口并播放个人 IP 动画"
                  >
                    <Play weight="fill" />
                  </button>
                )}
                {heroExpanded && videoPhase !== "done" && (
                  <button
                    className="film-skip"
                    type="button"
                    onClick={skipHeroVideo}
                    aria-label="跳过开场动画"
                  >
                    <SkipForward weight="fill" />
                  </button>
                )}
                <div className="film-gradient" aria-hidden="true" />
              </div>
            </>
          )}
        </div>

        <p className="hero-belief" lang="zh-CN">
          从真实需求出发，把复杂体验拆解成可理解、可验证、可持续优化的设计。
        </p>
        <a className="scroll-note" href="#about">
          SCROLL <ArrowDown weight="bold" />
        </a>
      </section>

      <section id="about" className="paper-section about-section">
        <Reveal className="section-heading">
          <p className="eyebrow">01 / ABOUT ME</p>
          <h2>
            A curious mind,
            <br />
            a careful maker.
          </h2>
        </Reveal>

        <Reveal className="profile-card">
          <div className="profile-tab">PROFILE</div>
          <div className="profile-copy">
            <p className="sheet-index">FILE Nº 001 · JEAN ZHOU</p>
            <h3 lang="zh-CN">体验设计师</h3>
            <p className="profile-role">Experience Designer</p>
            <p className="profile-intro" lang="zh-CN">
              个人简介与设计关注点
            </p>
            <p className="profile-location">BASED IN CHINA · OPEN TO NEW STORIES</p>
            <p className="profile-body" lang="zh-CN">
              四年互联网 UX 设计经验，聚焦跨境电商增长设计与用户体验研究。
              擅长把研究、数据与业务目标转化为清晰的产品策略与可落地的体验方案，
              也在持续探索 AI 工具在真实设计流程中的应用。
            </p>
          </div>
          <div className="profile-photo">
            <img src="/assets/profile-jean.png" alt="Jean 周景的个人照片" />
          </div>
        </Reveal>
      </section>

      <section id="work" className="work-section">
        <Reveal className="section-heading work-heading">
          <p className="eyebrow">02 / SELECTED WORK</p>
          <h2>
            Some things I&apos;ve
            <br />
            made with care.
          </h2>
        </Reveal>

        <div className="case-stage" aria-label="精选案例">
          {homeCases.map((item, index) => (
            <Link
              href={`/work/${item.slug}`}
              className={`case-file case-file-${index + 1}`}
              key={item.slug}
              aria-label={`查看案例：${item.title}`}
            >
              <span className="case-tab">PROJECT {item.index}</span>
              <Paperclip className="case-clip" weight="light" aria-hidden="true" />
              <div className="case-file-heading">
                <h3 lang="zh-CN">{item.title}</h3>
                <p>{item.englishTitle}</p>
              </div>
              <div className="case-thumb">
                <img src={item.image} alt="" />
              </div>
              <span className="case-number">{item.index}</span>
            </Link>
          ))}
        </div>

        <Reveal className="featured-case-copy">
          <p>FEATURED CASE · 2025</p>
          <h3>Credit Back / Win Credit</h3>
          <span lang="zh-CN">
            围绕返现权益与轻量互动，优化参与、支付与复购的完整增长链路。
          </span>
          <Link href="/work/credit-activity">
            查看完整案例 <ArrowUpRight weight="bold" />
          </Link>
        </Reveal>
      </section>

      <section id="practice" className="paper-section practice-section">
        <Reveal className="section-heading">
          <p className="eyebrow">03 / PRACTICE</p>
          <h2>
            Tools are useful.
            <br />
            Ways of thinking matter more.
          </h2>
        </Reveal>

        <Reveal className="practice-board">
          <div className="practice-list">
            <article><span>01</span><h3>Product & Growth</h3></article>
            <article><span>02</span><h3>Experience Design</h3></article>
            <article><span>03</span><h3>Visual & Motion</h3></article>
            <article><span>04</span><h3>AI-assisted Making</h3></article>
          </div>
          <aside className="tool-note">
            <span>EVERYDAY TOOLBOX</span>
            <p>Figma · Adobe CC<br />ProtoPie · AI Tools</p>
          </aside>
        </Reveal>
      </section>

      <section id="capabilities" className="paper-section capabilities-section">
        <Reveal className="capabilities-card">
          <p className="eyebrow">05 / CAPABILITIES</p>
          <h2 lang="zh-CN">把研究、设计与数据验证组织成完整的工作链路。</h2>
          <div className="capability-list">
            {capabilityRows.map((item) => (
              <article key={item.number}>
                <span>{item.number}</span>
                <div>
                  <h3 lang="zh-CN">{item.title}</h3>
                  <p>{item.detail}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="capability-note" lang="zh-CN">
            能力结构会随着案例整理继续细化，保留真实、可验证的项目证据。
          </p>
        </Reveal>
      </section>

      <section id="experience" className="paper-section experience-section">
        <Reveal className="section-heading experience-heading">
          <p className="eyebrow">04 / EXPERIENCE</p>
          <h2>
            A trail of
            <br />
            learning & making.
          </h2>
          <p lang="zh-CN">
            从视觉表达、人因研究，到跨境电商增长与 AI 用户研究，
            每段经历都在扩展我理解问题和验证设计的方式。
          </p>
        </Reveal>

        <Reveal className="timeline">
          {experiences.map((item) => (
            <article className="timeline-row" key={item.time}>
              <div>
                <span>{item.time}</span>
                <h3 lang="zh-CN">{item.company}</h3>
              </div>
              <ul>
                {item.points.map((point) => (
                  <li key={point} lang="zh-CN">{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </Reveal>
      </section>

      <footer id="contact">
        <section className="footer-hero">
          <Reveal className="footer-content">
            <p className="eyebrow">05 / CONTACT · FULL VIEWPORT</p>
            <h2>
              Let&apos;s make something
              <br />
              clear, kind & memorable.
            </h2>
            <a href="#top" className="pill-button footer-button">
              BACK TO THE FIELD <ArrowUp weight="bold" />
            </a>
          </Reveal>
        </section>

        <section className="contact-note">
          <div>
            <p>NEW_PROJECT_NOTE.txt</p>
            <h3>
              Have a role, project, or meaningful design problem in mind?
              <br />
              Let&apos;s make an impact <ArrowUpRight weight="bold" />
            </h3>
            <p>
              Focus · Growth UX · E-commerce · AI Research
              <br />
              Available for · Selected roles and meaningful collaborations
            </p>
          </div>
          <div className="footer-meta">
            <span>JEAN ZHOU · EXPERIENCE DESIGNER</span>
            <span>PORTFOLIO V.02 / 2026</span>
          </div>
        </section>
      </footer>
    </main>
  );
}
