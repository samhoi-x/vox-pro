"use client";

import { useRef, useCallback, useState, useEffect } from "react";

interface PianoKey {
  note: string;
  freq: number;
  isBlack: boolean;
  whiteIndex: number;
}

const KEYS: PianoKey[] = [
  { note: "C3", freq: 130.81, isBlack: false, whiteIndex: 0 },
  { note: "C#3", freq: 138.59, isBlack: true, whiteIndex: 0 },
  { note: "D3", freq: 146.83, isBlack: false, whiteIndex: 1 },
  { note: "D#3", freq: 155.56, isBlack: true, whiteIndex: 1 },
  { note: "E3", freq: 164.81, isBlack: false, whiteIndex: 2 },
  { note: "F3", freq: 174.61, isBlack: false, whiteIndex: 3 },
  { note: "F#3", freq: 185.0, isBlack: true, whiteIndex: 3 },
  { note: "G3", freq: 196.0, isBlack: false, whiteIndex: 4 },
  { note: "G#3", freq: 207.65, isBlack: true, whiteIndex: 4 },
  { note: "A3", freq: 220.0, isBlack: false, whiteIndex: 5 },
  { note: "A#3", freq: 233.08, isBlack: true, whiteIndex: 5 },
  { note: "B3", freq: 246.94, isBlack: false, whiteIndex: 6 },
  { note: "C4", freq: 261.63, isBlack: false, whiteIndex: 7 },
  { note: "A4", freq: 440.0, isBlack: false, whiteIndex: 8 },
];

const WHITE_KEY_WIDTH = 44;
const WHITE_KEY_HEIGHT = 160;
const BLACK_KEY_WIDTH = 28;
const BLACK_KEY_HEIGHT = 100;

export default function PianoScale() {
  // ── Safari-compatible audio state ──────────────────────────────
  // Safari requires AudioContext to be created INSIDE a user gesture.
  // We store the raw context (not wrapped in useCallback promises).
  const ctxRef = useRef<AudioContext | null>(null);
  // Track if context was ever resumed successfully
  const ctxReadyRef = useRef(false);
  const activeOscRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  const [sequencePlaying, setSequencePlaying] = useState(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try { activeOscRef.current?.stop(); } catch {}
      try { ctxRef.current?.close(); } catch {}
    };
  }, []);

  // ── Safari-safe: create AudioContext inside the user gesture ──
  const ensureCtx = useCallback((): AudioContext | null => {
    // Already have a running context
    if (ctxRef.current && ctxReadyRef.current) return ctxRef.current;

    // Create on first use (happens inside click → Safari allows it)
    if (!ctxRef.current) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        ctxRef.current = new AudioCtx();
      } catch {
        return null;
      }
    }

    // Resume if suspended (Safari starts in "suspended" state)
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") {
      // Fire resume — don't await, we use the context below synchronously
      ctx.resume().then(() => {
        ctxReadyRef.current = true;
      });
      // Mark as ready optimistically — Safari should process resume quickly
      ctxReadyRef.current = true;
    } else {
      ctxReadyRef.current = true;
    }

    return ctx;
  }, []);

  const stopActive = useCallback(() => {
    if (activeOscRef.current) {
      try { activeOscRef.current.stop(); } catch {}
      activeOscRef.current = null;
    }
    if (gainNodeRef.current) {
      try { gainNodeRef.current.disconnect(); } catch {}
      gainNodeRef.current = null;
    }
  }, []);

  // ── Core note player ──────────────────────────────────────────
  const playNoteNow = useCallback(
    (freq: number, note: string, durationMs: number) => {
      const ctx = ctxRef.current;
      if (!ctx || !ctxReadyRef.current) return;

      stopActive();

      // Safari: if context got suspended again, try to resume
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + durationMs / 1000
      );

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + durationMs / 1000 + 0.05);

      activeOscRef.current = osc;
      gainNodeRef.current = gain;

      setPlaying(note);
      setTimeout(() => setPlaying(null), durationMs + 100);
    },
    [stopActive]
  );

  const playNote = useCallback(
    (freq: number, note: string, durationMs: number = 600) => {
      const ctx = ensureCtx();
      if (!ctx) return;

      // If context was just created (first click), it's still in "suspended".
      // Wait briefly for Safari to process resume, then play.
      if (ctx.state === "suspended") {
        // Resume was called in ensureCtx. Chain the play after resume completes.
        ctx.resume().then(() => {
          ctxReadyRef.current = true;
          playNoteNow(freq, note, durationMs);
        });
      } else {
        ctxReadyRef.current = true;
        playNoteNow(freq, note, durationMs);
      }
    },
    [ensureCtx, playNoteNow]
  );

  // ── Sequence player ───────────────────────────────────────────
  const playSequence = useCallback(
    async (ascending: boolean) => {
      if (sequencePlaying) return;
      setSequencePlaying(true);

      const whiteKeys = KEYS.filter((k) => !k.isBlack);
      const order = ascending ? whiteKeys : [...whiteKeys].reverse();

      for (let i = 0; i < order.length; i++) {
        const key = order[i];
        // Use playNoteNow directly (context is already ensured by first note)
        const ctx = ctxRef.current;
        if (ctx && ctxReadyRef.current) {
          playNoteNow(key.freq, key.note, 400);
        } else {
          playNote(key.freq, key.note, 400);
        }
        await new Promise<void>((resolve) => setTimeout(resolve, 500));
      }

      setSequencePlaying(false);
    },
    [playNote, playNoteNow, sequencePlaying]
  );

  // ── Layout ────────────────────────────────────────────────────
  const whiteKeys = KEYS.filter((k) => !k.isBlack);
  const totalWhiteWidth = whiteKeys.length * WHITE_KEY_WIDTH;

  return (
    <div className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-4">
      <h3 className="text-center text-lg font-semibold mb-4 text-[var(--text)]">
        🎹 音階輔助（點擊發聲）
      </h3>

      <div
        className="relative mx-auto"
        style={{ width: totalWhiteWidth, height: WHITE_KEY_HEIGHT + 8 }}
      >
        {/* White keys */}
        <div className="flex">
          {whiteKeys.map((key) => (
            <button
              key={key.note}
              onPointerDown={() => playNote(key.freq, key.note)}
              className={`
                border border-[var(--border)] rounded-b-md cursor-pointer
                transition-all duration-100 select-none touch-manipulation
                hover:bg-[var(--surface-raised)] active:bg-[var(--accent)]/20
                ${playing === key.note ? "bg-[var(--accent)]/30" : "bg-[var(--bg)]"}
              `}
              style={{ width: WHITE_KEY_WIDTH, height: WHITE_KEY_HEIGHT }}
              aria-label={key.note}
            >
              <span className="block mt-auto pb-2 text-[10px] font-medium text-[var(--text-dim)]">
                {key.note}
              </span>
            </button>
          ))}
        </div>

        {/* Black keys */}
        {KEYS.filter((k) => k.isBlack).map((key) => {
          const left =
            key.whiteIndex * WHITE_KEY_WIDTH +
            WHITE_KEY_WIDTH -
            BLACK_KEY_WIDTH / 2;

          return (
            <button
              key={key.note}
              onPointerDown={() => playNote(key.freq, key.note)}
              className={`
                absolute top-0 rounded-b-md cursor-pointer
                transition-all duration-100 select-none touch-manipulation z-10
                hover:bg-[#3a3a50] active:bg-[var(--accent)]/40
                ${playing === key.note ? "bg-[var(--accent)]/50" : "bg-[#1a1a2e]"}
              `}
              style={{ left, width: BLACK_KEY_WIDTH, height: BLACK_KEY_HEIGHT }}
              aria-label={key.note}
            >
              <span className="block mt-auto pb-1.5 text-[8px] font-medium text-[var(--text-dim)]/60">
                {key.note}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sequence buttons */}
      <div className="flex gap-3 justify-center mt-5">
        <button
          onClick={() => playSequence(true)}
          disabled={sequencePlaying}
          className="px-5 py-2.5 rounded-lg bg-[var(--accent)] text-white font-semibold text-sm
                     hover:brightness-110 transition-all duration-150
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ▶ 上行音階
        </button>
        <button
          onClick={() => playSequence(false)}
          disabled={sequencePlaying}
          className="px-5 py-2.5 rounded-lg bg-[var(--surface-raised)] text-[var(--text-muted)] font-semibold text-sm
                     hover:bg-[var(--border)] transition-all duration-150
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ◀ 下行音階
        </button>
      </div>
    </div>
  );
}
