"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";

const PRODUCT_IDS = {
  monthly: "prod_2U68pglTbt7SworqPvcyuz",
  lifetime: "prod_2irVh0YPj5k66pzbPzuwRH",
} as const;

export default function Paywall() {
  const { user } = useAuth();
  const [checkingOut, setCheckingOut] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async (productId: string) => {
    if (!user) {
      setError("請先登入後再進行購買");
      return;
    }

    setCheckingOut(productId);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Request failed with status ${res.status}`);
      }

      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(`結帳失敗：${msg}`);
    } finally {
      setCheckingOut(null);
    }
  };

  return (
    <div className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-8 text-center space-y-8">
      {/* Lock icon */}
      <div className="text-5xl">🔒</div>

      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-[var(--text)] mb-2">
          解鎖全部 18 天課程
        </h2>
        <p className="text-sm text-[var(--text-muted)]">
          免費試用已結束 — 選擇適合你嘅方案繼續練習
        </p>
      </div>

      {/* ── Two pricing cards ── */}
      <div className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
        {/* Monthly */}
        <div className="flex-1 bg-[var(--bg)] border border-[var(--border)] rounded-xl p-5 text-left flex flex-col">
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1">
            每月訂閱
          </p>
          <p className="text-3xl font-black text-[var(--text)] mb-1">
            $9.99
          </p>
          <p className="text-xs text-[var(--text-dim)] mb-4">/月 · 隨時取消</p>
          <ul className="text-xs text-[var(--text-muted)] space-y-1.5 mb-5 flex-1">
            <li>✓ 完整 18 天練聲計劃</li>
            <li>✓ 每日練習步驟與指導</li>
            <li>✓ 進度追蹤與統計</li>
            <li>✓ 鋼琴音階輔助工具</li>
          </ul>
          <button
            onClick={() => handleCheckout(PRODUCT_IDS.monthly)}
            disabled={checkingOut !== null}
            className="w-full py-2.5 rounded-lg bg-[var(--accent-glow)] text-white text-sm font-bold
                       hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {checkingOut === PRODUCT_IDS.monthly ? "處理中..." : "每月 $9.99"}
          </button>
        </div>

        {/* Lifetime */}
        <div className="flex-1 bg-purple-600/5 border border-purple-600/40 rounded-xl p-5 text-left flex flex-col relative">
          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-3 py-0.5 rounded-full">
            最抵
          </div>
          <p className="text-xs text-purple-400 uppercase tracking-wide mb-1">
            永久買斷
          </p>
          <p className="text-3xl font-black text-[var(--text)] mb-1">
            $19.99
          </p>
          <p className="text-xs text-[var(--text-dim)] mb-4">一次性 · 終身使用</p>
          <ul className="text-xs text-[var(--text-muted)] space-y-1.5 mb-5 flex-1">
            <li>✓ 完整 18 天練聲計劃</li>
            <li>✓ 每日練習步驟與指導</li>
            <li>✓ 進度追蹤與統計</li>
            <li>✓ 鋼琴音階輔助工具</li>
            <li className="text-purple-400">🎁 送 18 天練習電子版 PDF</li>
          </ul>
          <button
            onClick={() => handleCheckout(PRODUCT_IDS.lifetime)}
            disabled={checkingOut !== null}
            className="w-full py-2.5 rounded-lg bg-purple-600 text-white text-sm font-bold
                       hover:bg-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {checkingOut === PRODUCT_IDS.lifetime ? "處理中..." : "永久 $19.99"}
          </button>
        </div>
      </div>

      {/* Login hint */}
      {!user && (
        <p className="text-xs text-[var(--text-dim)]">
          請先<a href="/login" className="text-[var(--accent)] underline">登入</a>後再進行購買
        </p>
      )}

      {/* Error */}
      {error && (
        <div className="p-3 rounded-lg bg-[var(--danger)]/10 border border-[var(--danger)]/20 max-w-lg mx-auto">
          <p className="text-sm text-[var(--danger)]">{error}</p>
        </div>
      )}
    </div>
  );
}
