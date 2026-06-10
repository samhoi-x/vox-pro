"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "vox-theme";

type Theme = "dark" | "light";

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  // Check system preference
  if (window.matchMedia?.("(prefers-color-scheme: light)").matches) return "light";
  return "dark";
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

export default function ThemeToggle() {
  // Lazy init reads the stored theme on the client; SSR falls back to "dark"
  const [theme, setTheme] = useState<Theme>(getStoredTheme);

  // Keep the document attribute in sync (also applies stored theme on mount)
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  return (
    <button
      onClick={toggle}
      className="w-10 h-10 rounded-full bg-[var(--surface-raised)] border border-[var(--border)]
                 flex items-center justify-center text-lg
                 hover:bg-[var(--border)] transition-all duration-150 cursor-pointer"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      suppressHydrationWarning
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
