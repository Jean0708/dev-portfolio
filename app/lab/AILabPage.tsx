"use client";

/* eslint-disable @next/next/no-img-element -- Bundled portfolio assets are served directly. */

import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  HandGrabbing,
  Sparkle,
} from "@phosphor-icons/react";
import gsap from "gsap";
import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { DesktopWindow } from "../DesktopWindow";
import { InlineCaseDocumentViewer } from "../InlineCaseDocumentViewer";
import { moreCaseStudies } from "../caseData";

export default function AILabPage() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLElement>(null);
  const dragRef = useRef({ pointerId: -1, startX: 0, scrollLeft: 0, moved: false });
  const frameRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(Math.min(1, moreCaseStudies.length - 1));
  const [previewOpen, setPreviewOpen] = useState(false);
  const activeCase = moreCaseStudies[activeIndex];

  useLayoutEffect(() => {
    const page = pageRef.current;
    if (!page) return;
    const heading = Array.from(
      page.querySelectorAll<HTMLElement>(
        ".ai-lab-heading > p, .ai-lab-heading > h1, .ai-lab-heading > span",
      ),
    );
    const modules = Array.from(
      page.querySelectorAll<HTMLElement>(".ai-lab-carousel-shell"),
    );
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const context = gsap.context(() => {
      if (reducedMotion) {
        gsap.set([...heading, ...modules], { autoAlpha: 1 });
        return;
      }
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(
          heading,
          { autoAlpha: 0, y: 22, filter: "blur(7px)" },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.58,
            stagger: 0.11,
            clearProps: "transform,filter,opacity,visibility",
          },
        )
        .fromTo(
          modules,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.52, clearProps: "opacity,visibility" },
          ">",
        );
    }, page);
    return () => context.revert();
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const cards = Array.from(carousel.querySelectorAll<HTMLElement>("[data-lab-card]"));
    const media = gsap.matchMedia();
    media.add("(hover: hover) and (prefers-reduced-motion: no-preference)", () => {
      const cleanups = cards.map((card) => {
        const enter = () => gsap.to(card, { y: -12, scale: 1.045, duration: 0.3, ease: "power3.out" });
        const leave = () => gsap.to(card, { y: 0, scale: 1, duration: 0.24, ease: "power2.out" });
        card.addEventListener("pointerenter", enter);
        card.addEventListener("pointerleave", leave);
        card.addEventListener("focusin", enter);
        card.addEventListener("focusout", leave);
        return () => {
          card.removeEventListener("pointerenter", enter);
          card.removeEventListener("pointerleave", leave);
          card.removeEventListener("focusin", enter);
          card.removeEventListener("focusout", leave);
        };
      });
      return () => cleanups.forEach((cleanup) => cleanup());
    });
    return () => media.revert();
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const initialIndex = Math.min(1, moreCaseStudies.length - 1);
    const frame = requestAnimationFrame(() => {
      const card = carousel.querySelector<HTMLElement>(`[data-card-index="${initialIndex}"]`);
      if (!card) return;
      const left = card.offsetLeft - (carousel.clientWidth - card.offsetWidth) / 2;
      carousel.scrollTo({ left, behavior: "auto" });
      setActiveIndex(initialIndex);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const syncCenteredCard = () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      const carousel = carouselRef.current;
      if (!carousel) return;
      const center = carousel.scrollLeft + carousel.clientWidth / 2;
      const cards = Array.from(carousel.querySelectorAll<HTMLElement>("[data-card-index]"));
      let closest = activeIndex;
      let distance = Number.POSITIVE_INFINITY;
      cards.forEach((card) => {
        const nextDistance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
        if (nextDistance < distance) {
          distance = nextDistance;
          closest = Number(card.dataset.cardIndex);
        }
      });
      if (Number.isFinite(closest)) setActiveIndex(closest);
    });
  };

  const startDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    const carousel = carouselRef.current;
    if (!carousel) return;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      scrollLeft: carousel.scrollLeft,
      moved: false,
    };
  };

  const moveDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const carousel = carouselRef.current;
    const drag = dragRef.current;
    if (!carousel || drag.pointerId !== event.pointerId) return;
    const delta = event.clientX - drag.startX;
    if (Math.abs(delta) > 5) {
      if (!drag.moved) carousel.setPointerCapture(event.pointerId);
      drag.moved = true;
      carousel.classList.add("is-dragging");
    }
    carousel.scrollLeft = drag.scrollLeft - delta;
  };

  const stopDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const carousel = carouselRef.current;
    if (!carousel || dragRef.current.pointerId !== event.pointerId) return;
    if (carousel.hasPointerCapture(event.pointerId)) {
      carousel.releasePointerCapture(event.pointerId);
    }
    carousel.classList.remove("is-dragging");
    dragRef.current.pointerId = -1;
    syncCenteredCard();
  };

  return (
    <main ref={pageRef} className="ai-lab more-cases-page">
      <img className="ai-lab-bg" src="/assets/lab/raddie-cosmic-garden.png" alt="" />
      <div className="ai-lab-shade" />

      <header className="ai-lab-nav">
        <Link href="/#work">
          <ArrowLeft weight="bold" />
          返回作品桌面
        </Link>
        <span>JEAN / MORE CASES</span>
        <i>PAST WORK + NEW EXPLORATIONS</i>
      </header>

      <section className="ai-lab-heading">
        <p><Sparkle weight="fill" /> MORE CASES / EXPLORATIONS</p>
        <h1>Pushing Boundaries</h1>
        <span>Striving for self-breakthroughs and lifelong growth.</span>
      </section>

      <section className="ai-lab-carousel-shell" aria-label="更多案例拖拽卡片">
        <div
          ref={carouselRef}
          className="ai-lab-carousel"
          onScroll={syncCenteredCard}
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
        >
          <div className="ai-lab-carousel-spacer" aria-hidden="true" />
          {moreCaseStudies.map((project, index) => (
            <button
              type="button"
              key={project.slug}
              data-lab-card
              data-card-index={index}
              className={`ai-lab-case-card ${activeIndex === index ? "is-centered" : ""}`}
              style={{ "--card-tilt": `${index % 2 === 0 ? -3.5 : 2.6}deg` } as CSSProperties}
              onFocus={() => setActiveIndex(index)}
              onClick={() => {
                if (dragRef.current.moved) {
                  dragRef.current.moved = false;
                  return;
                }
                setActiveIndex(index);
                setPreviewOpen(true);
              }}
              aria-label={`查看完整案例：${project.title}`}
            >
              <span className="ai-lab-card-index">{project.index}</span>
              <div className="ai-lab-card-copy">
                <h2>{project.title}</h2>
                <p>{project.category}</p>
              </div>
              <img src={project.covers.square} alt={project.englishTitle} draggable={false} />
              <span className="ai-lab-card-action">
                VIEW CASE <ArrowUpRight weight="bold" />
              </span>
            </button>
          ))}
          <div className="ai-lab-carousel-spacer" aria-hidden="true" />
        </div>
        <p className="ai-lab-drag-hint"><HandGrabbing weight="fill" /> 左右拖动浏览 · 点击卡片阅读完整案例</p>
      </section>

      {previewOpen && activeCase && (
        <DesktopWindow
          title={`${activeCase.index}_${activeCase.englishTitle.toUpperCase()}.CASE`}
          className="ai-preview-window more-case-window"
          centered
          topLayer
          zIndex={240}
          onFocus={() => undefined}
          onClose={() => setPreviewOpen(false)}
        >
          <InlineCaseDocumentViewer
            key={activeCase.slug}
            project={activeCase}
            language="zh"
            initialMode="reader"
          />
        </DesktopWindow>
      )}
    </main>
  );
}
