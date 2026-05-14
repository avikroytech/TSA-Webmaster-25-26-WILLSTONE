"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type LanguageCode = "en" | "es" | "zh";

type LanguageContextValue = {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string) => string;
};

const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    "nav.home": "Home",
    "nav.resources": "Resource Hub",
    "nav.calendar": "Calendar",
    "nav.news": "News",
    "nav.government": "Government",
    "nav.more": "More",
    "nav.about": "About",
    "nav.guides": "Guides",
    "nav.map": "Map",
    "nav.dashboard": "Dashboard",
    "nav.references": "References",
    "nav.submit": "Submit a Resource",
    "nav.beacon": "Ask Beacon",
  },
  es: {
    "nav.home": "Inicio",
    "nav.resources": "Recursos",
    "nav.calendar": "Calendario",
    "nav.news": "Noticias",
    "nav.government": "Gobierno",
    "nav.more": "Mas",
    "nav.about": "Acerca",
    "nav.guides": "Guias",
    "nav.map": "Mapa",
    "nav.dashboard": "Panel",
    "nav.references": "Referencias",
    "nav.submit": "Enviar recurso",
    "nav.beacon": "Preguntar",
  },
  zh: {
    "nav.home": "首页",
    "nav.resources": "资源中心",
    "nav.calendar": "日历",
    "nav.news": "新闻",
    "nav.government": "政府",
    "nav.more": "更多",
    "nav.about": "关于",
    "nav.guides": "指南",
    "nav.map": "地图",
    "nav.dashboard": "面板",
    "nav.references": "参考",
    "nav.submit": "提交资源",
    "nav.beacon": "询问 Beacon",
  },
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem("willstone-language") as LanguageCode | null;
    if (saved && saved in translations) setLanguageState(saved);
  }, []);

  const setLanguage = (nextLanguage: LanguageCode) => {
    setLanguageState(nextLanguage);
    window.localStorage.setItem("willstone-language", nextLanguage);
  };

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      t: (key: string) => translations[language][key] || translations.en[key] || key,
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useLanguage must be used inside LanguageProvider");
  return value;
}
