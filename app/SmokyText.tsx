"use client";

import gsap from "gsap";
import { useEffect, useMemo, useRef } from "react";

type SmokyTextProps = {
  text: string;
  active: boolean;
  className?: string;
};

export function SmokyText({ text, active, className = "" }: SmokyTextProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const groups = useMemo(() => {
    let globalIndex = 0;
    return text
      .split(/(\s+)/)
      .filter(Boolean)
      .map((segment) => ({
        isWhitespace: /^\s+$/.test(segment),
        characters: Array.from(segment).map((character) => ({
          character,
          index: globalIndex++,
        })),
      }));
  }, [text]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const letters = Array.from(root.querySelectorAll<HTMLElement>("[data-smoky-char]"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const context = gsap.context(() => {
      if (!active) {
        gsap.set(letters, { autoAlpha: 0 });
        return;
      }

      if (reducedMotion) {
        gsap.set(letters, { autoAlpha: 1, clearProps: "transform,filter" });
        return;
      }

      gsap.fromTo(
        letters,
        {
          autoAlpha: 0,
          x: -24,
          filter: "blur(12px)",
        },
        {
          autoAlpha: 1,
          x: 0,
          filter: "blur(0px)",
          duration: 0.62,
          stagger: { each: 0.034, from: "start" },
          ease: "power2.out",
          clearProps: "transform,filter",
        },
      );
    }, root);

    return () => context.revert();
  }, [active, text]);

  return (
    <span ref={rootRef} className={`smoky-text ${className}`} aria-label={text}>
      <span aria-hidden="true">
        {groups.map((group, groupIndex) =>
          group.isWhitespace ? (
            <span className="smoky-space" key={`space-${groupIndex}`}> </span>
          ) : (
            <span className="smoky-word" key={`word-${groupIndex}`}>
              {group.characters.map(({ character, index }) => (
                <span data-smoky-char key={`${character}-${index}`}>
                  {character}
                </span>
              ))}
            </span>
          ),
        )}
      </span>
    </span>
  );
}
