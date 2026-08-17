"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

export type PortfolioLanguage = "zh" | "en";

const STORAGE_KEY = "jean-portfolio-language";
const LANGUAGE_EVENT = "portfolio-language-change";

export function usePortfolioLanguage() {
  const language = useSyncExternalStore<PortfolioLanguage>(
    (notify) => {
      window.addEventListener(LANGUAGE_EVENT, notify);
      window.addEventListener("storage", notify);
      return () => {
        window.removeEventListener(LANGUAGE_EVENT, notify);
        window.removeEventListener("storage", notify);
      };
    },
    () => {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return saved === "en" ? "en" : "zh";
    },
    () => "zh",
  );

  const setLanguage = useCallback((nextLanguage: PortfolioLanguage) => {
    window.localStorage.setItem(STORAGE_KEY, nextLanguage);
    document.documentElement.lang = nextLanguage === "zh" ? "zh-CN" : "en";
    window.dispatchEvent(
      new CustomEvent<PortfolioLanguage>(LANGUAGE_EVENT, {
        detail: nextLanguage,
      }),
    );
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  }, [language]);

  return { language, setLanguage };
}
