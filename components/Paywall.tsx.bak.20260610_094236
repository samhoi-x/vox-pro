"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";

export default function Paywall() {
  const { user, loading } = useAuth();
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!user) {
      setError("請先登入後再進行購買");
      return;
    }

    setCheckingOut(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      setCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-8 text-center">
        <div className="text-[var(--text-muted)]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-8 text-center">
      {/* Lock icon */}
      <div className="text-5xl mb-4">🔒</div>

      {/* Title */}
      <h2 className="text-xl font-bold text-[var(--text)] mb-2">
        解鎖全部 18 天課程
      </h2>

      {/* Subtitle */}
      <p className="text-sm text-[var(--text-muted)] mb-6">
        免費試用已結束
      </p>

      {/* Feature list */}
      <ul className="text-left max-w-xs mx-auto mb-6 space-y-2">
        {[
          "完整 18 天練聲計劃",
          "每日練習步驟與指導",
          "常見錯誤與修正建議",
          "進度追蹤與統計",
          "鋼琴音階輔助工具",
        ].map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm text-[var(--text)]">
            <span className="text-[var(--success)]">✓</span>
            {feature}
          </li>
        ))}
      </ul>

      {/* Stripe checkout button */}
      <button
        onClick={handleCheckout}
        disabled={checkingOut || !user}
        className="w-full max-w-xs px-6 py-3 rounded-lg bg-[var(--accent)] text-white font-semibold
                   hover:brightness-110 transition-all duration-150
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {checkingOut ? "處理中..." : "立即解鎖"}
      </button>

      {/* Login hint if not authenticated */}
      {!user && (
        <p className="mt-3 text-xs text-[var(--text-dim)]">
          請先<a href="/login" className="text-[var(--accent)] underline">登入</a>後再進行購買
        </p>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 p-3 rounded-lg bg-[var(--danger)]/10 border border-[var(--danger)]/20">
          <p className="text-sm text-[var(--danger)]">{error}</p>
        </div>
      )}
    </div>
  );
}
