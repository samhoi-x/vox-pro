"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/components/AuthProvider";
import { getDayContent, GOLDEN_RULES } from "@/lib/content";
import type { DayContent } from "@/lib/content";
import DaySelector from "@/components/DaySelector";
import Timer from "@/components/Timer";
import PianoScale from "@/components/PianoScale";
import ExerciseCard from "@/components/ExerciseCard";
import ProgressGrid from "@/components/ProgressGrid";
import ThemeToggle from "@/components/ThemeToggle";
import LangToggle from "@/components/LangToggle";
import Paywall from "@/components/Paywall";

export default function DashboardPage() {
  const { user, loading: authLoading, supabase } = useAuth();

  const [activeDay, setActiveDay] = useState(1);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [subscriptionTier, setSubscriptionTier] = useState<string>("free");
  const [dataLoading, setDataLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  // ── Load progress + subscription on mount ──────────────────────
  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function loadData() {
      try {
        const [progressRes, profileRes] = await Promise.all([
          supabase.from("progress").select("day").eq("user_id", user!.id),
          supabase
            .from("profiles")
            .select("subscription_tier")
            .eq("id", user!.id)
            .single(),
        ]);

        if (cancelled) return;

        if (progressRes.data) {
          setCompletedDays(
            (progressRes.data as { day: number }[]).map((r) => r.day),
          );
        }

        if (profileRes.data?.subscription_tier) {
          setSubscriptionTier(profileRes.data.subscription_tier);
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        if (!cancelled) setDataLoading(false);
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, [user, supabase]);

  // ── Toggle day completion (upsert / delete) ────────────────────
  const toggleDayComplete = useCallback(
    async (day: number) => {
      if (!user || toggling) return;
      setToggling(true);

      const isCompleted = completedDays.includes(day);

      try {
        if (isCompleted) {
          await supabase
            .from("progress")
            .delete()
            .eq("user_id", user.id)
            .eq("day", day);
          setCompletedDays((prev) => prev.filter((d) => d !== day));
        } else {
          await supabase.from("progress").upsert({
            user_id: user.id,
            day,
            completed_at: new Date().toISOString(),
          });
          setCompletedDays((prev) => [...prev, day]);
        }
      } catch (err) {
        console.error("Failed to toggle day:", err);
      } finally {
        setToggling(false);
      }
    },
    [user, supabase, completedDays, toggling],
  );

  // ── Derived data ───────────────────────────────────────────────
  const dayContent: DayContent | undefined = getDayContent(activeDay);
  const isFreeUser = subscriptionTier === "free";
  const showPaywall = activeDay >= 4 && isFreeUser;
  const isTodayCompleted = completedDays.includes(activeDay);
  const phaseClass = dayContent ? `phase-${dayContent.phase}` : "";

  // ── Loading state ──────────────────────────────────────────────
  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--text-muted)] text-sm">載入中...</p>
        </div>
      </div>
    );
  }

  // ── Not authenticated (middleware handles redirect) ────────────
  if (!user) {
    return null;
  }

  // ── RENDER ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="max-w-[720px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* ========================================================
            HEADER: title + toolbar
           ======================================================== */}
        <header className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-black text-[var(--text)] tracking-tight">
              🎤 Vox Pro
            </h1>
            <span className="text-xs text-[var(--text-muted)] bg-[var(--surface)] border border-[var(--border)] px-2 py-1 rounded-full truncate max-w-[160px] sm:max-w-[200px]">
              {user.email}
            </span>
            {isFreeUser ? (
              <span className="text-xs bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] px-2.5 py-1 rounded-full">
                🆓 免費試用
              </span>
            ) : (
              <span className="text-xs bg-purple-600/20 border border-purple-600 text-purple-300 px-2.5 py-1 rounded-full">
                ⭐ Pro
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = "/";
              }}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--danger)] border border-[var(--border)] hover:border-[var(--danger)] px-3 py-1.5 rounded-lg transition-colors"
            >
              登出
            </button>
            <ThemeToggle />
            <LangToggle />
          </div>
        </header>

        {/* Trial / Pro status banner */}
        {isFreeUser ? (
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
              <span>🆓</span>
              <span>免費試用：<strong className="text-[var(--text)]">Day 1–3</strong> 可完整體驗</span>
              {activeDay <= 3 && (
                <span className="text-xs text-[var(--accent)]">
                  （尚餘 {3 - activeDay + 1} 日）
                </span>
              )}
            </div>
            <a
              href="/api/checkout"
              onClick={async (e) => {
                e.preventDefault();
                try {
                  const res = await fetch("/api/checkout", { method: "POST" });
                  const data = await res.json();
                  if (data.url) window.location.href = data.url;
                } catch {}
              }}
              className="text-xs bg-[var(--accent-glow)] text-white px-4 py-1.5 rounded-full font-bold hover:brightness-110 transition-all shrink-0"
            >
              升級 Pro
            </a>
          </div>
        ) : (
          <div className="bg-purple-600/10 border border-purple-600/30 rounded-xl px-4 py-3 flex items-center gap-2 text-sm">
            <span>⭐</span>
            <span className="text-purple-300">Pro 會員 — 已解鎖全部 18 天課程</span>
          </div>
        )}

        {/* ========================================================
            DAY SELECTOR
           ======================================================== */}
        <DaySelector
          activeDay={activeDay}
          onSelectDay={setActiveDay}
          completedDays={completedDays}
          phase={dayContent?.phase || "breath"}
        />

        {/* ========================================================
            PHASE INFO
           ======================================================== */}
        {dayContent && (
          <div
            className={`${phaseClass} bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 space-y-3`}
          >
            {/* Phase badge + day */}
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: `var(--phase-color, var(--accent))`,
                  color: "#0f0f14",
                }}
              >
                {dayContent.phaseName}
              </span>
              <span className="text-[var(--text-muted)] text-sm">
                Day {dayContent.day} / 18
              </span>
              <span className="text-[var(--text-dim)] text-sm">
                {dayContent.totalTime}
              </span>
            </div>

            {/* Goal */}
            <div>
              <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wide mb-1">
                🎯 今日目標
              </h3>
              <p className="text-[var(--text)] text-sm leading-relaxed">
                {dayContent.goal}
              </p>
            </div>

            {/* Problem this day solves */}
            <div>
              <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wide mb-1">
                💡 解決的問題
              </h3>
              <p className="text-[var(--text)] text-sm leading-relaxed">
                {dayContent.solution}
              </p>
            </div>

            {/* Review reminder (if present) */}
            {dayContent.review && (
              <div className="bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-3">
                <h3 className="text-sm font-bold text-amber-400 mb-1">
                  📝 複習提醒
                </h3>
                <p className="text-[var(--text-muted)] text-sm">
                  {dayContent.review}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TIMER
           ======================================================== */}
        <Timer />

        {/* ========================================================
            WARMUP SECTION
           ======================================================== */}
        {dayContent && (
          <section
            className={`${phaseClass} bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 space-y-4`}
          >
            <h2 className="text-lg font-bold text-[var(--text)] flex items-center gap-2">
              <span>🔥</span> 熱身
            </h2>
            <ol className="space-y-2.5">
              {dayContent.warmup.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      backgroundColor: `var(--phase-color, var(--accent))`,
                      color: "#0f0f14",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-[var(--text)] pt-0.5">{step}</span>
                </li>
              ))}
            </ol>

            {/* Warmup video links */}
            {dayContent.warmupVideos && dayContent.warmupVideos.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {dayContent.warmupVideos.map((video, i) => (
                  <a
                    key={i}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                               bg-red-500/10 text-red-400 text-xs font-medium
                               hover:bg-red-500/20 transition-colors"
                  >
                    📺 {video.label}
                  </a>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ========================================================
            EXERCISE CARDS
           ======================================================== */}
        {dayContent && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-[var(--text)] flex items-center gap-2">
              <span>🎵</span> 練習
            </h2>

            {/* Schedule overview */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5">
              <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wide mb-3">
                ⏱️ 今日排程
              </h3>
              <ul className="space-y-2">
                {dayContent.schedule.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-sm"
                  >
                    <span className="flex-shrink-0 w-14 text-right text-[var(--text-dim)] font-mono text-xs">
                      {item.time}
                    </span>
                    <span className="text-[var(--text)]">{item.content}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Individual exercises */}
            {dayContent.exercises.map((exercise, i) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                index={i}
                phase={dayContent.phase}
                phaseName={dayContent.phaseName}
              />
            ))}
          </section>
        )}

        {/* ========================================================
            PIANO SCALE
           ======================================================== */}
        <PianoScale />

        {/* ========================================================
            GOLDEN RULES (quick reference)
           ======================================================== */}
        <section className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 space-y-3">
          <h2 className="text-lg font-bold text-[var(--text)] flex items-center gap-2">
            <span>⭐</span> 黃金法則
          </h2>
          <ul className="space-y-2">
            {GOLDEN_RULES.map((rule, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-sm text-[var(--text-muted)]"
              >
                <span className="flex-shrink-0 mt-0.5 text-amber-400">✦</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ========================================================
            PROGRESS GRID
           ======================================================== */}
        <ProgressGrid
          completedDays={completedDays}
          onToggleDay={toggleDayComplete}
        />

        {/* ========================================================
            PAYWALL (days 4+ for free users)
           ======================================================== */}
        {showPaywall && <Paywall />}

        {/* ========================================================
            MARK DAY COMPLETE BUTTON
           ======================================================== */}
        {!showPaywall && (
          <div className="pt-2 pb-6">
            <button
              onClick={() => toggleDayComplete(activeDay)}
              disabled={toggling}
              className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-200 ${
                isTodayCompleted
                  ? "bg-[var(--success)]/20 border-2 border-[var(--success)] text-[var(--success)]"
                  : "bg-[var(--accent-glow)] text-white hover:brightness-110 active:scale-[0.98] shadow-lg shadow-[var(--accent-glow)]/30"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {toggling
                ? "處理中..."
                : isTodayCompleted
                  ? `✅ Day ${activeDay} 已完成`
                  : `🎯 標記 Day ${activeDay} 完成`}
            </button>
          </div>
        )}

        {/* ========================================================
            CLOSING TIP
           ======================================================== */}
        {dayContent?.closingTip && (
          <div className="text-center pb-8">
            <p className="text-sm text-[var(--text-dim)] italic">
              💬 {dayContent.closingTip}
            </p>
          </div>
        )}

        {/* Bottom spacer for mobile nav */}
        <div className="h-4" />
      </div>
    </div>
  );
}
