"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { caseStudies } from "./caseData";

const profileTabs = {
  PROFILE: {
    label: "体验设计师 / Experience Designer",
    body: "关注增长、复杂系统与新技术场景，也始终在意体验里的温度、节奏和一点点惊喜。",
    note: "BASED IN CHINA · OPEN TO NEW STORIES",
  },
  NOW: {
    label: "正在探索 / Currently Exploring",
    body: "AI 辅助设计、游戏化增长与跨端体验，寻找理性系统和感性表达之间更自然的连接。",
    note: "AI × GROWTH × EMOTIONAL DESIGN",
  },
  VALUES: {
    label: "设计观 / Design Belief",
    body: "好的设计不是让人注意到设计本身，而是让复杂的事情变轻，让人与产品的关系更真诚。",
    note: "CLEAR SYSTEMS · KIND EXPERIENCES",
  },
} as const;

type ProfileTab = keyof typeof profileTabs;

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
      { threshold: 0.12 },
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

export default function PortfolioHome() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [introComplete, setIntroComplete] = useState(false);
  const [activeProfile, setActiveProfile] = useState<ProfileTab>("PROFILE");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let frame = 0;

    const updateOpacity = () => {
      if (video.duration && Number.isFinite(video.duration)) {
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
    return () => cancelAnimationFrame(frame);
  }, []);

  const replayVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    video.style.opacity = "0";
    window.setTimeout(() => {
      video.currentTime = 0;
      void video.play();
    }, 100);
  };

  const skipIntro = () => {
    setIntroComplete(true);
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  const tiltCard = (event: React.PointerEvent<HTMLElement>) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty("--tilt-x", `${y * -4}deg`);
    card.style.setProperty("--tilt-y", `${x * 5}deg`);
  };

  const resetCard = (event: React.PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
  };

  const profile = profileTabs[activeProfile];

  return (
    <main id="top" className={introComplete ? "intro-complete" : ""}>
      <header className="site-nav">
        <Link href="#top" className="brand-mark" aria-label="返回首页">
          JEAN ZHOU<sup>®</sup>
        </Link>
        <nav aria-label="主导航">
          <Link href="#work">WORK</Link>
          <Link href="#about">ABOUT</Link>
          <Link href="#practice">PRACTICE</Link>
          <Link href="#experience">EXPERIENCE</Link>
        </nav>
        <Link href="#contact" className="nav-cta">
          SAY HELLO
        </Link>
      </header>

      <section className="hero" aria-label="Jean Zhou 个人介绍">
        <img
          className="hero-landscape"
          src="/assets/hero-still.png"
          alt=""
          aria-hidden="true"
        />
        <div className="hero-wash" />
        <div className="film-window">
          <div className="window-bar">
            <span>JEAN&apos;S GENTLE FIELD</span>
            <div className="window-controls" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className="film-viewport">
            <img src="/assets/hero-still.png" alt="小狗在开满鲜花的草原上奔跑" />
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              poster="/assets/hero-still.png"
              onEnded={() => {
                setIntroComplete(true);
                replayVideo();
              }}
            >
              <source src="/assets/ip-running.mp4" type="video/mp4" />
            </video>
            <div className="film-vignette" />
          </div>
        </div>

        <div className="hero-copy">
          <p className="hero-kicker">EXPERIENCE DESIGNER · 2026 PORTFOLIO</p>
          <h1>
            把复杂，
            <br />
            <em>设计得更轻一点。</em>
          </h1>
          <p className="hero-subtitle">
            I turn complex systems into clear,
            <br />
            gentle and meaningful experiences.
          </p>
          <Link href="#work" className="hero-link">
            EXPLORE SELECTED WORK <span>→</span>
          </Link>
        </div>

        {!introComplete && (
          <button className="skip-intro" onClick={skipIntro} type="button">
            SKIP INTRO
          </button>
        )}
        <div className="scroll-note">
          <span>SCROLL TO WANDER</span>
          <i />
        </div>
      </section>

      <section id="about" className="paper-section about-section">
        <Reveal className="section-heading">
          <p className="eyebrow">01 / ABOUT ME</p>
          <h2>
            A curious mind,
            <br />
            <em>a careful maker.</em>
          </h2>
        </Reveal>

        <Reveal className="profile-layout">
          <div className="profile-folder">
            <div className="folder-tabs" role="tablist" aria-label="个人信息分类">
              {(Object.keys(profileTabs) as ProfileTab[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={activeProfile === tab}
                  className={activeProfile === tab ? "active" : ""}
                  onClick={() => setActiveProfile(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="folder-sheet">
              <p className="sheet-index">FILE Nº 001 · JEAN ZHOU</p>
              <h3>{profile.label}</h3>
              <p className="profile-body">{profile.body}</p>
              <p className="profile-note">{profile.note}</p>
              <div className="hand-note">design with care ✳</div>
            </div>
          </div>
          <div className="ip-card">
            <img src="/assets/ip-turnaround.png" alt="萝卜狗个人 IP 三视图" />
            <div>
              <span>MEET MY LITTLE PARTNER</span>
              <strong>萝卜狗</strong>
            </div>
          </div>
        </Reveal>
      </section>

      <section id="work" className="work-section">
        <Reveal className="section-heading work-heading">
          <p className="eyebrow">02 / SELECTED WORK</p>
          <h2>
            Some things I&apos;ve
            <br />
            <em>made with care.</em>
          </h2>
          <p className="section-description">
            这里先用真实项目建立首页节奏。分类、排序、封面与卡片动效将在下一轮继续调整。
          </p>
        </Reveal>

        <div className="case-grid">
          {caseStudies.map((item, index) => (
            <Reveal
              className={`case-reveal ${index === 0 || index === 3 ? "case-wide" : ""}`}
              key={item.slug}
            >
              <Link
                href={`/work/${item.slug}`}
                className={`case-folder ${item.tone}`}
                onPointerMove={tiltCard}
                onPointerLeave={resetCard}
              >
                <div className="case-tab">
                  <span>PROJECT {item.index}</span>
                  <span>{item.year}</span>
                </div>
                <div className="case-image-wrap">
                  <img src={item.image} alt={`${item.title} 项目预览`} />
                  <span className="case-open">OPEN CASE ↗</span>
                </div>
                <div className="case-copy">
                  <p>{item.category}</p>
                  <h3>{item.title}</h3>
                  <span>{item.englishTitle}</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <p className="archive-note">MORE PROJECT FILES ARE BEING CURATED · 2026</p>
      </section>

      <section id="practice" className="paper-section practice-section">
        <Reveal className="section-heading">
          <p className="eyebrow">03 / PRACTICE</p>
          <h2>
            Tools are useful.
            <br />
            <em>Ways of thinking matter more.</em>
          </h2>
        </Reveal>

        <Reveal className="practice-board">
          <div className="practice-list">
            <article>
              <span>01</span>
              <h3>Product & Growth</h3>
              <p>增长体验 / 商业策略 / 用户研究 / 数据洞察</p>
            </article>
            <article>
              <span>02</span>
              <h3>Experience Design</h3>
              <p>信息架构 / 交互设计 / 服务设计 / 多端体验</p>
            </article>
            <article>
              <span>03</span>
              <h3>Visual & Motion</h3>
              <p>视觉系统 / 动效表达 / 插画与 IP / 原型呈现</p>
            </article>
            <article>
              <span>04</span>
              <h3>AI-assisted Making</h3>
              <p>调研辅助 / 概念探索 / 工作流构建 / 快速验证</p>
            </article>
          </div>
          <div className="tool-note">
            <span>EVERYDAY TOOLBOX</span>
            <p>Figma · Adobe CC · ProtoPie · AI Tools</p>
            <small>Always learning, always making.</small>
          </div>
        </Reveal>
      </section>

      <section id="experience" className="experience-section">
        <Reveal className="section-heading experience-heading">
          <p className="eyebrow">04 / EXPERIENCE</p>
          <h2>
            A trail of
            <br />
            <em>learning & making.</em>
          </h2>
        </Reveal>

        <Reveal className="timeline">
          <article className="timeline-card current">
            <span className="timeline-year">NOW</span>
            <div>
              <p>EXPERIENCE DESIGN</p>
              <h3>复杂场景、增长体验与 AI 设计探索</h3>
              <span>Detailed role and company information to be refined.</span>
            </div>
          </article>
          <article className="timeline-card">
            <span className="timeline-year">2021—24</span>
            <div>
              <p>PRODUCT & INTERACTION</p>
              <h3>从概念到落地的多端产品体验设计</h3>
              <span>Portfolio content is being curated from source files.</span>
            </div>
          </article>
          <article className="timeline-card">
            <span className="timeline-year">BEFORE</span>
            <div>
              <p>FOUNDATIONS</p>
              <h3>视觉、插画与空间叙事的早期练习</h3>
              <span>The beginning of a long, curious design journey.</span>
            </div>
          </article>
        </Reveal>
      </section>

      <footer id="contact" className="site-footer">
        <img src="/assets/hero-still.png" alt="" aria-hidden="true" />
        <div className="footer-wash" />
        <Reveal className="footer-content">
          <p>THANK YOU FOR WANDERING THIS FAR</p>
          <h2>
            Let&apos;s make something
            <br />
            <em>clear, kind & memorable.</em>
          </h2>
          <a href="#top" className="footer-button">
            BACK TO THE FIELD <span>↑</span>
          </a>
          <div className="footer-meta">
            <span>JEAN ZHOU · EXPERIENCE DESIGNER</span>
            <span>PORTFOLIO V.01 / 2026</span>
          </div>
        </Reveal>
      </footer>
    </main>
  );
}
