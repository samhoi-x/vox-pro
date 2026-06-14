"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import ThemeToggle from "@/components/ThemeToggle";

const PRODUCT_IDS = {
  monthly: "prod_2U68pglTbt7SworqPvcyuz",
  lifetime: "prod_2irVh0YPj5k66pzbPzuwRH",
} as const;

const FEATURES = [
  "完整 18 天練聲計劃",
  "每日練習步驟與指導影片",
  "進度追蹤與統計",
  "鋼琴音階輔助工具",
];

export default function PaywallPage() {
  const { user, loading: authLoading, supabase } = useAuth();
  const [checkingOut, setCheckingOut] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState(false);

  // Check if user is actually paid (SSR race condition guard)
  useEffect(() => {
    if (!user || !supabase) return;
    const check = async () => {
      try {
        const { data } = await supabase
          .from("profiles")
          .select("subscription_tier")
          .eq("id", user.id)
          .maybeSingle();
        if (data?.subscription_tier === "pro" || data?.subscription_tier === "lifetime") {
          setIsPaid(true);
          // Redirect back to dashboard after a brief moment
          setTimeout(() => { window.location.href = "/dashboard"; }, 1500);
        }
      } catch {}
    };
    check();
  }, [user, supabase]);

  const handleCheckout = async (productId: string) => {
    if (!user) {
      window.location.href = "/login?redirect=/paywall";
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
        throw new Error(data.error || `Request failed (${res.status})`);
      }

      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setCheckingOut(null);
    }
  };

  // ── Paid user (middleware race condition — brief flash) ──
  if (isPaid) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="text-4xl">✅</div>
          <p className="text-[var(--text)]">你已是付費用戶，正在跳轉...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="max-w-[720px] mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* ── Header ── */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-black text-[var(--text)] tracking-tight">
              🎤 Vox Pro
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {authLoading ? null : user ? (
              <span className="text-xs text-[var(--text-muted)] bg-[var(--surface)] border border-[var(--border)] px-2.5 py-1 rounded-full truncate max-w-[160px] sm:max-w-[200px]">
                {user.email}
              </span>
            ) : null}
            <ThemeToggle />
          </div>
        </header>

        {/* ── Hero ── */}
        <div className="text-center space-y-4">
          <div className="text-6xl">🔒</div>
          <h2 className="text-2xl sm:text-3xl font-black text-[var(--text)]">
            免費試用已結束
          </h2>
          <p className="text-[var(--text-muted)] max-w-md mx-auto leading-relaxed">
            你已完成 3 日免費體驗。選擇以下方案，繼續你嘅 18 天練聲之旅，打好唱歌根基。
          </p>
        </div>

        {/* ── Pricing Cards ── */}
        <div className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
          {/* Monthly */}
          <div className="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 text-left flex flex-col">
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1">
              每月訂閱
            </p>
            <p className="text-3xl font-black text-[var(--text)] mb-1">
              US$9.99
            </p>
            <p className="text-xs text-[var(--text-dim)] mb-5">/月 · 隨時取消</p>
            <ul className="text-xs text-[var(--text-muted)] space-y-2 mb-6 flex-1">
              {FEATURES.map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[var(--accent)] mt-0.5 shrink-0">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout(PRODUCT_IDS.monthly)}
              disabled={checkingOut !== null}
              className="w-full py-3 rounded-lg bg-[var(--accent-glow)] text-white text-sm font-bold
                         hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {checkingOut === PRODUCT_IDS.monthly ? "處理中..." : "每月 US$9.99"}
            </button>
          </div>

          {/* Lifetime */}
          <div className="flex-1 bg-purple-600/5 border border-purple-600/40 rounded-xl p-6 text-left flex flex-col relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-3 py-0.5 rounded-full">
              最抵 👍
            </div>
            <p className="text-xs text-purple-400 uppercase tracking-wide mb-1">
              永久買斷
            </p>
            <p className="text-3xl font-black text-[var(--text)] mb-1">
              US$19.99
            </p>
            <p className="text-xs text-[var(--text-dim)] mb-5">一次性 · 終身使用</p>
            <ul className="text-xs text-[var(--text-muted)] space-y-2 mb-6 flex-1">
              {FEATURES.map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5 shrink-0">✓</span>
                  <span>{f}</span>
                </li>
              ))}
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-0.5 shrink-0">🎁</span>
                <span className="text-purple-300">送 18 天練習電子版 PDF</span>
              </li>
            </ul>
            <button
              onClick={() => handleCheckout(PRODUCT_IDS.lifetime)}
              disabled={checkingOut !== null}
              className="w-full py-3 rounded-lg bg-purple-600 text-white text-sm font-bold
                         hover:bg-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {checkingOut === PRODUCT_IDS.lifetime ? "處理中..." : "永久 US$19.99"}
            </button>
          </div>
        </div>

        {/* ── Login hint (if not authenticated) ── */}
        {!authLoading && !user && (
          <div className="text-center">
            <p className="text-sm text-[var(--text-dim)]">
              已有帳號？{" "}
              <a href="/login?redirect=/paywall" className="text-[var(--accent)] underline hover:brightness-110">
                登入
              </a>{" "}
              後繼續
            </p>
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div className="p-4 rounded-lg bg-[var(--danger)]/10 border border-[var(--danger)]/20 max-w-lg mx-auto">
            <p className="text-sm text-[var(--danger)] text-center">
              結帳失敗：{error}
            </p>
          </div>
        )}

        {/* ── Footer ── */}
        <div className="text-center space-y-2 pt-4">
          <p className="text-xs text-[var(--text-dim)]">
            有問題？{" "}
            <a href="mailto:iatsam@gmail.com" className="text-[var(--accent)] underline">
              聯絡我哋
            </a>
          </p>
          <div className="flex justify-center gap-4 text-xs text-[var(--text-dim)]">
            <a href="/privacy" className="hover:text-[var(--text-muted)]">私隱政策</a>
            <a href="/terms" className="hover:text-[var(--text-muted)]">服務條款</a>
          </div>
        </div>
      </div>
    </div>
  );
}
