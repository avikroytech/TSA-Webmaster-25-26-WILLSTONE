"use client";

import {
  Accessibility,
  Contrast,
  Minus,
  Plus,
  RotateCcw,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "willstone-accessibility-settings";

export default function AccessibilityPanel() {
  const [open, setOpen] = useState(false);
  const [fontScale, setFontScale] = useState(1);
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    try {
      const savedSettings = window.localStorage.getItem(STORAGE_KEY);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings) as Partial<{
          fontScale: number;
          highContrast: boolean;
          reduceMotion: boolean;
        }>;
        if (typeof parsed.fontScale === "number")
          setFontScale(parsed.fontScale);
        if (typeof parsed.highContrast === "boolean")
          setHighContrast(parsed.highContrast);
        if (typeof parsed.reduceMotion === "boolean")
          setReduceMotion(parsed.reduceMotion);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setInitialized(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--accessibility-font-scale",
      String(fontScale),
    );
    document.documentElement.classList.toggle("high-contrast", highContrast);
    document.documentElement.classList.toggle("reduce-motion", reduceMotion);

    if (initialized) {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ fontScale, highContrast, reduceMotion }),
      );
      window.dispatchEvent(
        new CustomEvent("willstone-accessibility-change", {
          detail: { fontScale, highContrast, reduceMotion },
        }),
      );
    }
  }, [fontScale, highContrast, initialized, reduceMotion]);

  const reset = () => {
    setFontScale(1);
    setHighContrast(false);
    setReduceMotion(false);
  };

  return (
    <div className="fixed bottom-5 left-5 z-[250]">
      {open && (
        <div className="mb-3 w-[min(340px,calc(100vw-2.5rem))] rounded-2xl border border-[var(--brand-medium)]/15 bg-[#f9f7f2] p-4 text-[var(--brand-medium)] shadow-2xl dark:bg-[#203838] dark:text-[#f5f0eb]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl">Accessibility</h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close accessibility panel"
              className="rounded-full p-2 hover:bg-[var(--brand-medium)]/10 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-white/70 p-3 dark:bg-white/10">
              <span className="text-sm font-bold">Text Size</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setFontScale((value) => Math.max(0.95, value - 0.05))
                  }
                  aria-label="Decrease text size"
                  className="rounded-lg bg-[var(--brand-medium)] px-3 py-2 text-white"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-xs font-bold">
                  {Math.round(fontScale * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setFontScale((value) => Math.min(1.2, value + 0.05))
                  }
                  aria-label="Increase text size"
                  className="rounded-lg bg-[var(--brand-medium)] px-3 py-2 text-white"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setHighContrast((value) => !value)}
              className="flex w-full items-center justify-between rounded-xl bg-white/70 p-3 text-left text-sm font-bold dark:bg-white/10"
              aria-pressed={highContrast}
            >
              <span className="inline-flex items-center gap-2">
                <Contrast size={16} /> High Contrast
              </span>
              <span>{highContrast ? "On" : "Off"}</span>
            </button>

            <button
              type="button"
              onClick={() => setReduceMotion((value) => !value)}
              className="flex w-full items-center justify-between rounded-xl bg-white/70 p-3 text-left text-sm font-bold dark:bg-white/10"
              aria-pressed={reduceMotion}
            >
              <span>Reduce Motion</span>
              <span>{reduceMotion ? "On" : "Off"}</span>
            </button>

            <button
              type="button"
              onClick={reset}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--brand-medium)]/20 py-3 text-sm font-black uppercase tracking-widest"
            >
              <RotateCcw size={15} /> Reset
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Open accessibility options"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-medium)] text-white shadow-xl transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-muted)]"
      >
        <Accessibility size={22} />
      </button>
    </div>
  );
}
