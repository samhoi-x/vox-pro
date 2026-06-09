"use client";

import { useState, useEffect, useRef, useCallback } from "react";

type TimerState = "idle" | "running" | "paused";

const PRESETS = [
  { label: "1m", seconds: 60 },
  { label: "3m", seconds: 180 },
  { label: "5m", seconds: 300 },
  { label: "7m", seconds: 420 },
  { label: "10m", seconds: 600 },
  { label: "25m", seconds: 1500 },
];

function formatTime(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default function Timer() {
  const [state, setState] = useState<TimerState>("idle");
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  // Start countdown
  useEffect(() => {
    if (state === "running" && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clearTimer();
            setState("idle");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearTimer();
  }, [state, remaining, clearTimer]);

  const handlePreset = (seconds: number) => {
    clearTimer();
    setTotalSeconds(seconds);
    setRemaining(seconds);
    setState("idle");
  };

  const handleStartPause = () => {
    if (state === "running") {
      clearTimer();
      setState("paused");
    } else {
      if (remaining <= 0) return;
      setState("running");
    }
  };

  const handleReset = () => {
    clearTimer();
    setRemaining(totalSeconds);
    setState("idle");
  };

  const isWarning = remaining > 0 && remaining <= 60;
  const isCritical = remaining > 0 && remaining <= 10;

  const displayColor = isCritical
    ? "var(--danger)"
    : isWarning
      ? "#fbbf24"
      : "var(--text)";

  const pulseClass = isCritical ? "animate-pulse" : "";

  return (
    <div className="flex flex-col items-center gap-4 p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
      {/* Display */}
      <div
        className={`font-[var(--font-mono)] ${pulseClass}`}
        style={{
          fontSize: "3rem",
          color: displayColor,
          fontVariantNumeric: "tabular-nums",
          lineHeight: 1,
        }}
      >
        {formatTime(remaining)}
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={handleStartPause}
          disabled={remaining <= 0 && state === "idle"}
          className="px-5 py-2 rounded-lg bg-[var(--accent)] text-white font-semibold text-sm
                     hover:brightness-110 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {state === "running" ? "Pause" : "Start"}
        </button>
        <button
          onClick={handleReset}
          disabled={state === "idle" && remaining === totalSeconds}
          className="px-5 py-2 rounded-lg bg-[var(--surface-raised)] text-[var(--text-muted)] font-semibold text-sm
                     hover:bg-[var(--border)] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Reset
        </button>
      </div>

      {/* Quick presets */}
      <div className="flex flex-wrap gap-1.5 justify-center">
        {PRESETS.map((preset) => (
          <button
            key={preset.seconds}
            onClick={() => handlePreset(preset.seconds)}
            className={`
              px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150
              ${
                totalSeconds === preset.seconds && state !== "running"
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--surface-raised)] text-[var(--text-muted)] hover:bg-[var(--border)]"
              }
            `}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
