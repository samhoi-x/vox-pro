"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const STORAGE_KEY = "vox-lang";

type DisplayMode = "traditional" | "simplified";

declare global {
  interface Window {
    __voxOriginalTexts?: Map<Node, string>;
  }
}

function getStoredLang(): DisplayMode {
  if (typeof window === "undefined") return "traditional";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "simplified" || stored === "traditional") return stored;
  return "traditional";
}

export default function LangToggle() {
  // Lazy init reads the stored language on the client; SSR falls back to traditional
  const [displayMode, setDisplayMode] = useState<DisplayMode>(getStoredLang);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const converterRef = useRef<((text: string) => Promise<string>) | null>(null);
  const convertingRef = useRef(false);

  const loadConverter = useCallback(async () => {
    if (converterRef.current) return converterRef.current;

    setLoading(true);
    setError(null);

    try {
      // Dynamic import of opencc-js (from npm, not CDN)
      const { Converter } = await import("opencc-js");
      const converter = Converter({ from: "tw", to: "cn" });
      // Converter is synchronous in npm version — wrap in Promise for uniform API
      converterRef.current = (text: string) => Promise.resolve(converter(text));
      return converterRef.current;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      console.error("LangToggle: failed to load opencc-js:", err);
      setError(`無法載入繁簡轉換工具：${msg}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Store original texts on first conversion
  const storeOriginals = useCallback(() => {
    // Use window-level storage to survive hot reload
    if (!window.__voxOriginalTexts) {
      window.__voxOriginalTexts = new Map();
    }
    const map = window.__voxOriginalTexts;
    if (map.size > 0) return; // Already stored

    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          if (["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName))
            return NodeFilter.FILTER_REJECT;
          if (parent.closest("[data-lang-toggle]"))
            return NodeFilter.FILTER_REJECT;
          const text = node.textContent?.trim();
          if (!text) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      }
    );

    let node: Node | null;
    while ((node = walker.nextNode())) {
      if (!map.has(node)) {
        map.set(node, node.textContent ?? "");
      }
    }
  }, []);

  // Restore original texts
  const restoreOriginals = useCallback(() => {
    const map = window.__voxOriginalTexts;
    if (!map) return;
    map.forEach((original, node) => {
      if (node.parentElement) {
        node.textContent = original;
      }
    });
  }, []);

  const loadAndConvert = useCallback(async () => {
    const convert = await loadConverter();
    if (!convert) return;

    storeOriginals();

    const map = window.__voxOriginalTexts;
    if (!map) return;

    if (convertingRef.current) return;
    convertingRef.current = true;

    let hasError = false;
    const entries = Array.from(map.entries());
    for (const [node, original] of entries) {
      if (!node.parentElement) continue;
      try {
        const converted = await convert(original);
        node.textContent = converted;
      } catch (err) {
        console.error("LangToggle: failed to convert node:", err);
        hasError = true;
      }
    }

    if (hasError) {
      setError("部分文字轉換失敗");
    }

    convertingRef.current = false;
  }, [loadConverter, storeOriginals]);

  // Re-apply simplified conversion on mount if it was previously enabled
  useEffect(() => {
    if (getStoredLang() === "simplified") {
      document.documentElement.setAttribute("data-lang", "simplified");
      loadAndConvert();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = useCallback(async () => {
    if (loading) return;

    if (displayMode === "traditional") {
      // Convert to simplified
      localStorage.setItem(STORAGE_KEY, "simplified");
      document.documentElement.setAttribute("data-lang", "simplified");
      await loadAndConvert();
      setDisplayMode("simplified");
    } else {
      // Restore traditional
      localStorage.setItem(STORAGE_KEY, "traditional");
      document.documentElement.setAttribute("data-lang", "traditional");
      restoreOriginals();
      setDisplayMode("traditional");
    }
  }, [displayMode, loading, loadAndConvert, restoreOriginals]);

  return (
    <div className="relative" data-lang-toggle>
      <button
        onClick={toggle}
        disabled={loading}
        className="w-10 h-10 rounded-full bg-[var(--surface-raised)] border border-[var(--border)]
                   flex items-center justify-center text-sm font-bold
                   hover:bg-[var(--border)] transition-all duration-150 cursor-pointer
                   disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={`切換至${displayMode === "traditional" ? "簡體" : "繁體"}中文`}
        title={`切換至${displayMode === "traditional" ? "簡體" : "繁體"}中文`}
        suppressHydrationWarning
      >
        {displayMode === "traditional" ? "简" : "繁"}
      </button>
      {error && (
        <div className="absolute top-full right-0 mt-2 p-2 rounded-lg bg-[var(--danger)]/10 border border-[var(--danger)]/20 text-xs text-[var(--danger)] whitespace-nowrap z-50">
          {error}
        </div>
      )}
    </div>
  );
}
