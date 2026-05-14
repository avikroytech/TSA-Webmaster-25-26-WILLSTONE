"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("willstone-theme") as Theme | null;
    const preferredTheme: Theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const initialTheme = savedTheme || preferredTheme;
    setTheme(initialTheme);
    document.documentElement.dataset.theme = initialTheme;
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("willstone-theme", nextTheme);
  };

  const Icon = theme === "dark" ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--brand-medium)]/15 bg-white/85 text-[var(--brand-medium)] shadow-sm transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-muted)] dark:bg-[#203838] dark:text-[#f5f0eb]"
    >
      <Icon size={18} />
    </button>
  );
}
