"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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

// ── WAV generator (no Web Audio API needed) ─────────────────────
function generateWavBlob(freq: number, durationSec: number): Blob {
  const sampleRate = 44100;
  const numSamples = Math.floor(sampleRate * durationSec);
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  // WAV header
  const writeStr = (off: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i));
  };
  writeStr(0, "RIFF");
  view.setUint32(4, 36 + numSamples * 2, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);          // chunk size
  view.setUint16(20, 1, true);           // PCM
  view.setUint16(22, 1, true);           // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // byte rate
  view.setUint16(32, 2, true);           // block align
  view.setUint16(34, 16, true);          // bits per sample
  writeStr(36, "data");
  view.setUint32(40, numSamples * 2, true);

  // Sine wave samples with fade-out
  const fadeStart = Math.floor(numSamples * 0.8);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let amplitude = 0.3;
    // Fade out in last 20%
    if (i >= fadeStart) {
      amplitude *= 1 - (i - fadeStart) / (numSamples - fadeStart);
    }
    // Apply quick fade-in (5ms) to avoid click
    if (i < Math.floor(sampleRate * 0.005)) {
      amplitude *= i / (sampleRate * 0.005);
    }
    const sample = Math.sin(2 * Math.PI * freq * t) * amplitude;
    const int16 = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
    view.setInt16(44 + i * 2, int16, true);
  }

  return new Blob([buffer], { type: "audio/wav" });
}

// Cache generated WAV URLs (one per frequency+duration pair)
const wavCache = new Map<string, string>();

function getWavUrl(freq: number, durationSec: number): string {
  const key = `${freq}_${durationSec}`;
  if (!wavCache.has(key)) {
    const blob = generateWavBlob(freq, durationSec);
    wavCache.set(key, URL.createObjectURL(blob));
  }
  return wavCache.get(key)!;
}

// ── Play using HTMLAudioElement (works everywhere) ──────────────
function playWav(freq: number, durationMs: number): HTMLAudioElement {
  const url = getWavUrl(freq, durationMs / 1000);
  const audio = new Audio(url);
  audio.play().catch(() => {}); // ignore autoplay errors (won't happen on click)
  return audio;
}

export default function PianoScale() {
  const [playing, setPlaying] = useState<string | null>(null);
  const [sequencePlaying, setSequencePlaying] = useState(false);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);

  // Stop any playing note when the component unmounts
  useEffect(() => {
    return () => {
      activeAudioRef.current?.pause();
      activeAudioRef.current = null;
    };
  }, []);

  const playNote = useCallback(
    (freq: number, note: string, durationMs: number = 600) => {
      // Stop previous note
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
        activeAudioRef.current = null;
      }

      const audio = playWav(freq, durationMs);
      activeAudioRef.current = audio;

      setPlaying(note);
      setTimeout(() => setPlaying(null), durationMs + 100);
    },
    []
  );

  const playSequence = useCallback(
    async (ascending: boolean) => {
      if (sequencePlaying) return;
      setSequencePlaying(true);

      const whiteKeys = KEYS.filter((k) => !k.isBlack);
      const order = ascending ? whiteKeys : [...whiteKeys].reverse();

      for (let i = 0; i < order.length; i++) {
        playNote(order[i].freq, order[i].note, 400);
        await new Promise<void>((resolve) => setTimeout(resolve, 500));
      }

      setSequencePlaying(false);
    },
    [playNote, sequencePlaying]
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
        className="relative mx-auto select-none"
        style={{ width: totalWhiteWidth, height: WHITE_KEY_HEIGHT + 8 }}
      >
        {/* White keys */}
        <div className="flex">
          {whiteKeys.map((key) => (
            <button
              key={key.note}
              onClick={() => playNote(key.freq, key.note)}
              className={`
                border border-[var(--border)] rounded-b-md cursor-pointer
                transition-all duration-100 touch-manipulation
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
              onClick={() => playNote(key.freq, key.note)}
              className={`
                absolute top-0 rounded-b-md cursor-pointer
                transition-all duration-100 touch-manipulation z-10
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
