"use client";

type Props = {
  activeDay: number;
  completedDays: number[];
  onSelectDay: (day: number) => void;
  phase: string;
};

const phaseColors: Record<string, string> = {
  breath: "#60a5fa",
  chest: "#fbbf24",
  head: "#a78bfa",
  range: "#34d399",
  mixed: "#fb923c",
};

const phaseRanges: { phase: string; label: string; start: number; end: number }[] = [
  { phase: "breath", label: "氣息基礎", start: 1, end: 4 },
  { phase: "chest", label: "胸腔共鳴", start: 5, end: 8 },
  { phase: "head", label: "頭腔共鳴", start: 9, end: 12 },
  { phase: "range", label: "高低音轉換", start: 13, end: 15 },
  { phase: "mixed", label: "混聲整合", start: 16, end: 18 },
];

export default function DaySelector({ activeDay, completedDays, onSelectDay, phase }: Props) {
  const activeColor = phaseColors[phase] ?? "#a78bfa";

  return (
    <div className="w-full">
      {/* Day dots — grouped by phase */}
      <div className="flex flex-wrap items-center gap-1 justify-center mb-4">
        {phaseRanges.map((range, rangeIdx) => (
          <div key={range.phase} className="flex items-center gap-1">
            {/* Phase group */}
            {Array.from({ length: range.end - range.start + 1 }, (_, i) => range.start + i).map((day) => {
              const isActive = day === activeDay;
              const isCompleted = completedDays.includes(day);
              const color = phaseColors[range.phase] ?? "#a78bfa";

              return (
                <button
                  key={day}
                  onClick={() => onSelectDay(day)}
                  className={`
                    relative w-[38px] h-[38px] rounded-full border-2 flex items-center justify-center
                    text-sm font-semibold transition-all duration-200 cursor-pointer
                    ${isActive
                      ? "scale-110 shadow-[0_0_12px_var(--phase-color)] border-[var(--phase-color)]"
                      : "border-[var(--border)] hover:border-[var(--text-muted)]"
                    }
                  `}
                  style={{
                    ["--phase-color" as string]: isActive ? activeColor : isCompleted ? color : undefined,
                    borderColor: isActive
                      ? activeColor
                      : isCompleted
                        ? color
                        : undefined,
                    backgroundColor: isActive
                      ? `${activeColor}22`
                      : isCompleted
                        ? `${color}18`
                        : "var(--surface)",
                    color: isActive ? activeColor : isCompleted ? color : "var(--text-muted)",
                  }}
                  aria-label={`Day ${day}${isCompleted ? " (completed)" : ""}`}
                  title={`Day ${day}${isCompleted ? " ✓" : ""}`}
                >
                  {isCompleted ? "✓" : day}
                </button>
              );
            })}
            {/* Phase divider (except after last group) */}
            {rangeIdx < phaseRanges.length - 1 && (
              <div
                className="w-[2px] h-[28px] rounded-full mx-1"
                style={{ backgroundColor: `${phaseColors[range.phase] ?? "#a78bfa"}30` }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Phase timeline */}
      <div className="flex items-center justify-center gap-0 w-full max-w-2xl mx-auto">
        {phaseRanges.map((range, idx) => {
          const color = phaseColors[range.phase] ?? "#a78bfa";
          const days = range.end - range.start + 1;
          const isActivePhase = phase === range.phase;
          // Check if all days in this phase are completed
          const phaseDays = Array.from({ length: days }, (_, i) => range.start + i);
          const isPhaseCompleted = phaseDays.every((d) => completedDays.includes(d));

          return (
            <div key={range.phase} className="flex items-center flex-1" style={{ flex: days }}>
              {/* Connector line before (except first) */}
              {idx > 0 && (
                <div className="h-[3px] flex-1" style={{ backgroundColor: `${color}40` }} />
              )}

              {/* Phase segment */}
              <div
                className={`
                  flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-md transition-all duration-200
                  ${isActivePhase ? "bg-[var(--phase-color)]/10 ring-1 ring-[var(--phase-color)]/30" : ""}
                  ${isPhaseCompleted ? "opacity-80" : ""}
                `}
                style={{ ["--phase-color" as string]: color }}
              >
                <div
                  className="h-[6px] w-full rounded-full"
                  style={{
                    backgroundColor: isPhaseCompleted ? `${color}80` : color,
                  }}
                />
                <span
                  className="text-[10px] font-medium whitespace-nowrap leading-tight"
                  style={{ color }}
                >
                  {isPhaseCompleted ? "✅ " : ""}{range.label}
                </span>
                <span className="text-[9px] text-[var(--text-dim)]">
                  Day {range.start}–{range.end}
                </span>
                {/* "You are here" indicator */}
                {isActivePhase && (
                  <span
                    className="text-[9px] font-bold mt-0.5"
                    style={{ color }}
                  >
                    ▼ 你在此
                  </span>
                )}
              </div>

              {/* Connector line after (except last) */}
              {idx < phaseRanges.length - 1 && (
                <div className="h-[3px] flex-1" style={{ backgroundColor: `${color}40` }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
