"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { getDayContent, GOLDEN_RULES } from "@/lib/content";

export default function PdfDownloadPage() {
  const { user, loading, supabase } = useAuth();
  const [tier, setTier] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function checkTier() {
      try {
        const { data } = await supabase
          .from("profiles")
          .select("subscription_tier")
          .eq("id", user!.id)
          .single();
        setTier(data?.subscription_tier || "free");
      } catch {
        setTier("free");
      } finally {
        setChecking(false);
      }
    }
    checkTier();
  }, [user, supabase]);

  // Trigger print on load for lifetime users
  useEffect(() => {
    if (tier === "lifetime" && !checking) {
      // Small delay to ensure content renders
      const timer = setTimeout(() => window.print(), 500);
      return () => clearTimeout(timer);
    }
  }, [tier, checking]);

  if (loading || checking) {
    return (
      <div className="min-h-screen bg-[#0f0f14] flex items-center justify-center">
        <p className="text-gray-400">載入中...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0f0f14] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">請先登入</p>
          <a href="/login" className="text-purple-400 underline">前往登入</a>
        </div>
      </div>
    );
  }

  if (tier !== "lifetime") {
    return (
      <div className="min-h-screen bg-[#0f0f14] flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-4xl mb-4">🔒</p>
          <h2 className="text-xl font-bold text-white mb-2">此功能僅限永久會員</h2>
          <p className="text-gray-400 text-sm mb-6">
            PDF 下載係永久買斷方案嘅專屬福利。升級至永久方案即可下載 18 天練習電子版 PDF。
          </p>
          <a
            href="/dashboard"
            className="inline-block px-6 py-2.5 bg-purple-600 text-white rounded-full font-bold text-sm hover:bg-purple-500"
          >
            返回 Dashboard
          </a>
        </div>
      </div>
    );
  }

  // ── Print-friendly content ──
  const allDays = Array.from({ length: 18 }, (_, i) => getDayContent(i + 1)).filter(Boolean);

  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          .no-print { display: none !important; }
          .page-break { page-break-before: always; }
          h1, h2, h3 { color: black !important; }
          .text-gray-400, .text-gray-300, .text-gray-500 { color: #333 !important; }
          .bg-\\[\\#1a1a24\\] { background: #f5f5f5 !important; border: 1px solid #ddd !important; }
          .bg-purple-600\\/10 { background: #f3e8ff !important; }
          .text-purple-300, .text-purple-400 { color: #7c3aed !important; }
        }
        @media screen {
          body { background: #0f0f14; }
        }
      `}</style>

      <div className="min-h-screen bg-[#0f0f14] text-white print:bg-white print:text-black">
        {/* Toolbar */}
        <div className="no-print sticky top-0 z-10 bg-[#0f0f14]/95 backdrop-blur border-b border-[#1a1a24] px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold">📥 18 天練習 PDF</h1>
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-bold hover:bg-purple-500"
            >
              🖨️ 列印 / 儲存 PDF
            </button>
            <a
              href="/dashboard"
              className="px-4 py-2 border border-[#2a2a3a] text-gray-300 rounded-lg text-sm hover:bg-[#1a1a24]"
            >
              返回
            </a>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
          {/* Cover */}
          <div className="text-center py-12 page-break">
            <p className="text-sm text-purple-400 font-medium tracking-widest uppercase mb-4">
              18 天系統性聲樂基礎
            </p>
            <h1 className="text-4xl font-black mb-4">
              每日練聲計劃
            </h1>
            <p className="text-lg text-gray-400 mb-2">
              由零基礎到站穩根基
            </p>
            <p className="text-sm text-gray-500">
              每日 20 分鐘 · 5 個階段 · 循序漸進
            </p>
            <p className="text-xs text-gray-600 mt-8">
              Vox Pro · vox-pro-six.vercel.app
            </p>
          </div>

          {/* Phase overview */}
          <div className="page-break">
            <h2 className="text-2xl font-bold mb-4">課程結構：5 個階段</h2>
            <div className="space-y-2">
              {[
                { day: "Day 1–4", phase: "氣息基礎", desc: "建立正確呼吸習慣，搵到丹田支撐" },
                { day: "Day 5–8", phase: "胸腔共鳴", desc: "開發胸腔聲音，增加厚度同力量" },
                { day: "Day 9–12", phase: "頭腔共鳴", desc: "連接頭腔共鳴，打開高音區域" },
                { day: "Day 13–15", phase: "高低音轉換", desc: "胸聲頭聲順滑過渡，消除換聲區斷層" },
                { day: "Day 16–18", phase: "混聲整合", desc: "胸聲頭聲融合，為進階技巧打好根基" },
              ].map((s) => (
                <div key={s.day} className="bg-[#1a1a24] border border-[#2a2a3a] rounded-lg p-4 flex gap-3 items-center">
                  <span className="bg-purple-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shrink-0">
                    {s.day}
                  </span>
                  <div>
                    <p className="font-bold text-sm">{s.phase}</p>
                    <p className="text-xs text-gray-400">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Each day */}
          {allDays.map((day) => (
            <div key={day!.day} className="page-break">
              <h2 className="text-xl font-bold mb-4">
                Day {day!.day} — {day!.phaseName}
              </h2>
              <p className="text-sm text-gray-400 mb-4">⏱️ {day!.totalTime}</p>

              {/* Goal */}
              <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-lg p-4 mb-4">
                <h3 className="text-sm font-bold text-purple-400 uppercase mb-1">🎯 今日目標</h3>
                <p className="text-sm">{day!.goal}</p>
              </div>

              {/* Warmup */}
              <div className="mb-4">
                <h3 className="text-sm font-bold uppercase mb-2">🔥 熱身</h3>
                <ol className="space-y-1.5">
                  {day!.warmup.map((step: string, i: number) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span className="text-purple-400 font-bold">{i + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Schedule */}
              <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-lg p-4 mb-4">
                <h3 className="text-sm font-bold uppercase mb-2">⏱️ 今日排程</h3>
                <ul className="space-y-1">
                  {day!.schedule.map((item: { time: string; content: string }, i: number) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span className="text-gray-500 font-mono w-14 shrink-0">{item.time}</span>
                      <span>{item.content}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exercises */}
              <div className="mb-4">
                <h3 className="text-sm font-bold uppercase mb-2">🎵 練習</h3>
                {day!.exercises.map((ex: any, i: number) => (
                  <div key={ex.id} className="bg-[#1a1a24] border border-[#2a2a3a] rounded-lg p-4 mb-3">
                    <h4 className="font-bold text-sm mb-1">
                      {i + 1}. {ex.title} <span className="text-xs text-gray-500">({ex.duration})</span>
                    </h4>
                    <p className="text-xs text-gray-400 mb-2">{ex.instruction}</p>
                    {ex.steps && (
                      <ol className="space-y-1">
                        {ex.steps.map((s: string, j: number) => (
                          <li key={j} className="text-xs text-gray-300 flex gap-1">
                            <span className="text-purple-400">{j + 1}.</span>
                            {s}
                          </li>
                        ))}
                      </ol>
                    )}
                    {ex.tips && (
                      <p className="text-xs text-amber-400 mt-2">💡 {ex.tips}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Closing tip */}
              {day!.closingTip && (
                <p className="text-sm text-gray-400 italic">💬 {day!.closingTip}</p>
              )}
            </div>
          ))}

          {/* Golden Rules */}
          <div className="page-break">
            <h2 className="text-xl font-bold mb-4">⭐ 黃金法則</h2>
            <ul className="space-y-2">
              {GOLDEN_RULES.map((rule: string, i: number) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="text-amber-400">✦</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer */}
          <div className="text-center py-8 text-xs text-gray-600 border-t border-[#1a1a24] page-break">
            <p>Vox Pro © 2026</p>
            <p>vox-pro-six.vercel.app</p>
            <p className="mt-2">此 PDF 僅供永久會員個人使用，請勿轉載或分享。</p>
          </div>
        </div>
      </div>
    </>
  );
}
