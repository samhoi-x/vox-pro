"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { Exercise } from "@/lib/content";

type Props = {
  exercise: Exercise;
  index: number;
  phase: string;
  phaseName: string;
};

export default function ExerciseCard({ exercise, index, phase, phaseName }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [miniTimers, setMiniTimers] = useState<Record<number, { remaining: number; running: boolean }>>({});
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Parse duration to seconds for mini timer
  const durationSeconds = (() => {
    const match = exercise.duration.match(/(\d+)/);
    if (!match) return 60;
    const num = parseInt(match[1]);
    // Default to minutes
    return num * 60;
  })();

  const startMiniTimer = (stepIdx: number) => {
    const key = stepIdx;
    if (!miniTimers[key] || miniTimers[key].remaining <= 0) {
      setMiniTimers((prev) => ({
        ...prev,
        [key]: { remaining: durationSeconds, running: true },
      }));
    } else {
      setMiniTimers((prev) => ({
        ...prev,
        [key]: { ...prev[key], running: !prev[key].running },
      }));
    }
  };

  // Timer effect
  useEffect(() => {
    const activeTimers = Object.entries(miniTimers).filter(([, t]) => t.running && t.remaining > 0);
    if (activeTimers.length > 0) {
      intervalRef.current = setInterval(() => {
        setMiniTimers((prev) => {
          const next = { ...prev };
          for (const [key] of activeTimers) {
            const k = parseInt(key);
            if (next[k] && next[k].remaining > 0) {
              next[k] = { ...next[k], remaining: next[k].remaining - 1 };
              if (next[k].remaining <= 0) {
                next[k].running = false;
              }
            }
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [miniTimers]);

  const formatMiniTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleAudioGuide = useCallback(() => {
    setAudioError(null);
    // Try multiple possible paths
    const paths = [
      `/audio/${phase}.mp3`,
      `/audio/${exercise.id}.mp3`,
      `/audio/exercise-${index + 1}.mp3`,
    ];

    const tryPath = (idx: number) => {
      if (idx >= paths.length) {
        setAudioError("找不到音頻檔案（請確認 /public/audio/ 中有對應的 MP3 檔案）");
        return;
      }

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const audio = new Audio(paths[idx]);
      audioRef.current = audio;

      audio.onerror = () => tryPath(idx + 1);
      audio.oncanplaythrough = () => audio.play().catch(() => tryPath(idx + 1));
      audio.load();
    };

    tryPath(0);
  }, [exercise.id, index]);

  return (
    <div className="rounded-xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden transition-all duration-200">
      {/* Collapsed header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-[var(--surface-raised)]/50 transition-colors cursor-pointer"
      >
        <span
          className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
          style={{
            backgroundColor: "var(--accent)",
            color: "var(--surface)",
          }}
        >
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-[var(--text)] truncate">
            {exercise.title}
          </h4>
          <span className="text-xs text-[var(--text-muted)]">{exercise.duration}</span>
        </div>
        <span className="text-[var(--text-dim)] text-sm">
          {expanded ? "▲" : "▼"}
        </span>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-[var(--border)] pt-3 space-y-4">
          {/* Steps */}
          <div>
            <h5 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-2">
              Steps
            </h5>
            <ol className="space-y-3">
              {exercise.steps.map((step, sIdx) => (
                <li key={sIdx} className="flex gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[var(--surface-raised)] flex items-center justify-center text-[10px] font-bold text-[var(--text-muted)] mt-0.5">
                    {sIdx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[var(--text)] leading-relaxed">{step}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startMiniTimer(sIdx);
                      }}
                      className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-md
                                 bg-[var(--surface-raised)] text-[var(--text-muted)] text-xs
                                 hover:bg-[var(--border)] transition-colors"
                    >
                      ▶ 計時
                      {miniTimers[sIdx]?.remaining !== undefined &&
                        miniTimers[sIdx]?.remaining > 0 && (
                          <span className="font-[var(--font-mono)] text-[var(--accent)] ml-1">
                            {formatMiniTime(miniTimers[sIdx].remaining)}
                          </span>
                        )}
                    </button>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Common mistakes */}
          {exercise.commonMistakes.length > 0 && (
            <div>
              <h5 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-2">
                Common Mistakes
              </h5>
              <ul className="space-y-1.5">
                {exercise.commonMistakes.map((mistake, mIdx) => {
                  // Parse ❌→✅ format or use as-is
                  const parts = mistake.split("→").map((s) => s.trim());
                  // Remove ❌ and ✅ emojis if they're already in the string
                  const wrong = parts[0]?.replace(/^[❌✗⨯]\s*/, "");
                  const correct = parts[1]?.replace(/^[✅✓✔]\s*/, "");

                  return (
                    <li key={mIdx} className="text-sm flex flex-col gap-0.5">
                      {wrong && (
                        <span className="text-[var(--danger)]">
                          ❌ {wrong}
                        </span>
                      )}
                      {correct && (
                        <span className="text-[var(--success)]">
                          ✅ {correct}
                        </span>
                      )}
                      {!wrong && !correct && (
                        <span className="text-[var(--text-muted)]">{mistake}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Verification standard */}
          {exercise.verification && (
            <div>
              <h5 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1.5">
                Verification
              </h5>
              <div className="p-3 rounded-lg bg-[var(--success)]/10 border border-[var(--success)]/20">
                <p className="text-sm text-[var(--text)]">{exercise.verification}</p>
              </div>
            </div>
          )}

          {/* Audio guide */}
          <div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAudioGuide();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                         bg-[var(--breath)]/15 text-[var(--breath)] font-medium text-sm
                         hover:bg-[var(--breath)]/25 transition-colors"
            >
              🎙️ {phaseName}語音指導
              <span className="text-xs opacity-60 font-normal">（本階段共用）</span>
            </button>
            {audioError && (
              <p className="mt-1.5 text-xs text-[var(--danger)]">{audioError}</p>
            )}
          </div>

          {/* Video guide */}
          {exercise.videoUrl && (
            <div>
              <a
                href={exercise.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                           bg-red-500/10 text-red-400 font-medium text-sm
                           hover:bg-red-500/20 transition-colors"
              >
                📺 示範影片
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
