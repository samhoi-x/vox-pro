"use client";

import { useRef, useCallback, useState } from "react";

interface PianoKey {
  note: string;
  freq: number;
  isBlack: boolean;
  /** Position index among white keys (0-based) */
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
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  const [sequencePlaying, setSequencePlaying] = useState(false);
  const activeOscRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const stopActive = useCallback(() => {
    if (activeOscRef.current) {
      try {
        activeOscRef.current.stop();
      } catch {
        // already stopped
      }
      activeOscRef.current = null;
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect();
      gainNodeRef.current = null;
    }
  }, []);

  const playNote = useCallback(
    (freq: number, note: string, durationMs: number = 600) => {
      stopActive();
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + durationMs / 1000);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + durationMs / 1000);

      activeOscRef.current = osc;
      gainNodeRef.current = gain;

      setPlaying(note);
      setTimeout(() => setPlaying(null), durationMs);
    },
    [getAudioContext, stopActive]
  );

  const playSequence = useCallback(
    async (ascending: boolean) => {
      if (sequencePlaying) return;
      setSequencePlaying(true);

      // Only white keys for sequences
      const whiteKeys = KEYS.filter((k) => !k.isBlack);
      const order = ascending ? whiteKeys : [...whiteKeys].reverse();

      for (let i = 0; i < order.length; i++) {
        const key = order[i];
        await new Promise<void>((resolve) => {
          playNote(key.freq, key.note, 400);
          setTimeout(resolve, 500);
        });
      }

      setSequencePlaying(false);
    },
    [playNote, sequencePlaying]
  );

  // Layout calculations
  const whiteKeys = KEYS.filter((k) => !k.isBlack);
  const totalWhiteWidth = whiteKeys.length * WHITE_KEY_WIDTH;

  return (
    <div className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-4">
      <h3 className="text-center text-lg font-semibold mb-4 text-[var(--text)]">
        🎹 音階輔助（點擊發聲）
      </h3>

      {/* Piano keys */}
      <div
        className="relative mx-auto"
        style={{
          width: totalWhiteWidth,
          height: WHITE_KEY_HEIGHT + 8,
        }}
      >
        {/* White keys */}
        <div className="flex">
          {whiteKeys.map((key) => (
            <button
              key={key.note}
              onClick={() => playNote(key.freq, key.note)}
              className={`
                border border-[var(--border)] rounded-b-md cursor-pointer
                transition-all duration-100 select-none
                hover:bg-[var(--surface-raised)]
                active:bg-[var(--accent)]/20
                ${playing === key.note ? "bg-[var(--accent)]/30" : "bg-[var(--bg)]"}
              `}
              style={{
                width: WHITE_KEY_WIDTH,
                height: WHITE_KEY_HEIGHT,
              }}
              aria-label={key.note}
            >
              <span className="block mt-auto pb-2 text-[10px] font-medium text-[var(--text-dim)]">
                {key.note}
              </span>
            </button>
          ))}
        </div>

        {/* Black keys (positioned absolutely over white keys) */}
        {KEYS.filter((k) => k.isBlack).map((key) => {
          // Black keys sit between two white keys, offset from the left of their white key
          const left = key.whiteIndex * WHITE_KEY_WIDTH + WHITE_KEY_WIDTH - BLACK_KEY_WIDTH / 2;

          return (
            <button
              key={key.note}
              onClick={() => playNote(key.freq, key.note)}
              className={`
                absolute top-0 rounded-b-md cursor-pointer
                transition-all duration-100 select-none z-10
                hover:bg-[#3a3a50]
                active:bg-[var(--accent)]/40
                ${playing === key.note ? "bg-[var(--accent)]/50" : "bg-[#1a1a2e]"}
              `}
              style={{
                left,
                width: BLACK_KEY_WIDTH,
                height: BLACK_KEY_HEIGHT,
              }}
              aria-label={key.note}
            >
              <span className="block mt-auto pb-1.5 text-[8px] font-medium text-[var(--text-dim)]/60">
                {key.note}
              </span>
            </button>
          );
        })}
      </div>

      {/* Play sequence buttons */}
      <div className="flex gap-3 justify-center mt-5">
        <button
          onClick={() => playSequence(true)}
          disabled={sequencePlaying}
          className="px-5 py-2.5 rounded-lg bg-[var(--accent)] text-white font-semibold text-sm
                     hover:brightness-110 transition-all duration-150
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ▶ Play Ascending
        </button>
        <button
          onClick={() => playSequence(false)}
          disabled={sequencePlaying}
          className="px-5 py-2.5 rounded-lg bg-[var(--surface-raised)] text-[var(--text-muted)] font-semibold text-sm
                     hover:bg-[var(--border)] transition-all duration-150
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ◀ Play Descending
        </button>
      </div>
    </div>
  );
}
