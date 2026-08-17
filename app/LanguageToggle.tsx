"use client";

import type { PortfolioLanguage } from "./usePortfolioLanguage";

export function LanguageToggle({
  language,
  onChange,
  inverted = false,
}: {
  language: PortfolioLanguage;
  onChange: (language: PortfolioLanguage) => void;
  inverted?: boolean;
}) {
  return (
    <div
      className={`language-toggle${inverted ? " language-toggle-inverted" : ""}`}
      role="group"
      aria-label={language === "zh" ? "选择界面语言" : "Choose interface language"}
    >
      <button
        type="button"
        className={language === "zh" ? "is-active" : ""}
        aria-pressed={language === "zh"}
        onClick={() => onChange("zh")}
      >
        中
      </button>
      <span aria-hidden="true">/</span>
      <button
        type="button"
        className={language === "en" ? "is-active" : ""}
        aria-pressed={language === "en"}
        onClick={() => onChange("en")}
      >
        EN
      </button>
    </div>
  );
}
