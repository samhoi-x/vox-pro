"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const STORAGE_KEY = "vox-lang";
const CDN_URL = "https://cdn.jsdelivr.net/npm/opencc-js@1.0.5/dist/umd/full.min.js";

type Lang = "t2s" | "s2t"; // t2s = traditional to simplified, s2t = simplified to traditional
type DisplayMode = "traditional" | "simplified";

declare global {
  interface Window {
    OpenCC?: {
      Converter: (options: { from: string; to: string }) => {
        (text: string): Promise<string>;
      };
    };
  }
}

function getStoredLang(): DisplayMode {
  if (typeof window === "undefined") return "traditional";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "simplified" || stored === "traditional") return stored;
  return "traditional";
}

export default function LangToggle() {
  const [displayMode, setDisplayMode] = useState<DisplayMode>("traditional");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const converterRef = useRef<((text: string) => Promise<string>) | null>(null);
  const convertingRef = useRef(false);
  const originalTextsRef = useRef<Map<Node, string>>(new Map());

  // Initialize on mount
  useEffect(() => {
    const stored = getStoredLang();
    setDisplayMode(stored);
    if (stored === "simplified") {
      loadAndConvert("t2s");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadOpenCC = useCallback(async (): Promise<((text: string) => Promise<string>) | null> => {
    if (converterRef.current) return converterRef.current;

    try {
      setLoading(true);
      setError(null);

      // Check if already loaded via CDN script tag
      if ((window as any).OpenCC) {
        const converter = (window as any).OpenCC.Converter({ from: "tw", to: "cn" });
        const fn = (text: string) => converter(text);
        converterRef.current = fn;
        return fn;
      }

      // Load from CDN
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = CDN_URL;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load opencc-js from CDN"));
        document.head.appendChild(script);
      });

      if (!(window as any).OpenCC) {
        throw new Error("OpenCC not available after script load");
      }

      const converter = (window as any).OpenCC.Converter({ from: "tw", to: "cn" });
      const fn = (text: string) => converter(text);
      converterRef.current = fn;
      return fn;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(`無法載入繁簡轉換工具：${msg}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Store original texts on first conversion
  const storeOriginals = useCallback(() => {
    if (originalTextsRef.current.size > 0) return; // Already stored

    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          // Skip script, style, and nodes inside the toggle button itself
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          if (["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
          if (parent.closest("[data-lang-toggle]")) return NodeFilter.FILTER_REJECT;
          const text = node.textContent?.trim();
          if (!text) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      }
    );

    let node: Node | null;
    while ((node = walker.nextNode())) {
      if (!originalTextsRef.current.has(node)) {
        originalTextsRef.current.set(node, node.textContent ?? "");
      }
    }
  }, []);

  // Restore original texts
  const restoreOriginals = useCallback(() => {
    originalTextsRef.current.forEach((original, node) => {
      if (node.parentElement) {
        node.textContent = original;
      }
    });
  }, []);

  const loadAndConvert = useCallback(
    async (direction: Lang) => {
      const converter = await loadOpenCC();
      if (!converter) return;

      // Store originals if not already done
      storeOriginals();

      setDisplayMode(direction === "t2s" ? "simplified" : "traditional");

      if (convertingRef.current) return;
      convertingRef.current = true;

      try {
        const promises: Promise<void>[] = [];
        originalTextsRef.current.forEach((original, node) => {
          if (!node.parentElement) return;
          promises.push(
            converter(original).then((converted) => {
              node.textContent = converted;
            })
          );
        });
        await Promise.all(promises);
      } catch {
        setError("文字轉換過程中發生錯誤");
      } finally {
        convertingRef.current = false;
      }
    },
    [loadOpenCC, storeOriginals]
  );

  const toggle = useCallback(async () => {
    if (loading) return;

    if (displayMode === "traditional") {
      // Convert to simplified
      localStorage.setItem(STORAGE_KEY, "simplified");
      document.documentElement.setAttribute("data-lang", "simplified");
      await loadAndConvert("t2s");
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
        aria-label={`Switch to ${displayMode === "traditional" ? "simplified" : "traditional"} Chinese`}
        title={`Switch to ${displayMode === "traditional" ? "simplified" : "traditional"} Chinese`}
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
