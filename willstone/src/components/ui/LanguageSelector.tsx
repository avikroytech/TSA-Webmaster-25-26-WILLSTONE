"use client";

import { Languages } from "lucide-react";
import { LanguageCode, useLanguage } from "@/context/LanguageContext";

const labels: Record<LanguageCode, string> = {
  en: "EN",
  es: "ES",
  zh: "中文",
};

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <label className="inline-flex h-11 items-center gap-2 rounded-full border border-[var(--brand-medium)]/15 bg-white/85 px-3 text-[var(--brand-medium)] shadow-sm transition focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--brand-muted)] dark:bg-[#203838] dark:text-[#f5f0eb]">
      <Languages size={17} aria-hidden="true" />
      <span className="sr-only">Language</span>
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value as LanguageCode)}
        className="h-full bg-transparent text-xs font-black uppercase tracking-widest outline-none"
        aria-label="Select language"
      >
        {(Object.keys(labels) as LanguageCode[]).map((code) => (
          <option key={code} value={code}>
            {labels[code]}
          </option>
        ))}
      </select>
    </label>
  );
}
