"use client";

type Props = {
  completedDays: number[];
  onToggleDay: (day: number) => void;
};

export default function ProgressGrid({ completedDays, onToggleDay }: Props) {
  const totalDays = 18;
  const completedCount = completedDays.length;
  const percent = Math.round((completedCount / totalDays) * 100);

  // Calculate consecutive days (from day 1)
  let consecutiveDays = 0;
  for (let i = 1; i <= totalDays; i++) {
    if (completedDays.includes(i)) {
      consecutiveDays++;
    } else {
      break;
    }
  }

  return (
    <div className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="text-center p-3 rounded-lg bg-[var(--surface-raised)]">
          <div className="text-2xl font-bold text-[var(--accent)]">
            {completedCount}/{totalDays}
          </div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1">已完成天數</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-[var(--surface-raised)]">
          <div className="text-2xl font-bold text-[var(--gold)]">{consecutiveDays}</div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1">連續天數</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-[var(--surface-raised)]">
          <div className="text-2xl font-bold text-[var(--success)]">{percent}%</div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1">總進度</div>
        </div>
      </div>

      {/* Progress grid */}
      <div className="grid grid-cols-6 max-sm:grid-cols-3 gap-2">
        {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => {
          const isCompleted = completedDays.includes(day);
          return (
            <button
              key={day}
              onClick={() => onToggleDay(day)}
              className={`
                aspect-square rounded-lg flex flex-col items-center justify-center gap-1
                transition-all duration-150 cursor-pointer border-2
                ${isCompleted
                  ? "bg-[var(--success)]/10 border-[var(--success)] hover:bg-[var(--success)]/20"
                  : "bg-[var(--surface-raised)] border-[var(--border)] hover:border-[var(--text-muted)]"
                }
              `}
              aria-label={`Day ${day}${isCompleted ? " (completed)" : ""}`}
            >
              <span
                className={`text-xs font-semibold ${
                  isCompleted ? "text-[var(--success)]" : "text-[var(--text-muted)]"
                }`}
              >
                第{day}日
              </span>
              <span className="text-lg">{isCompleted ? "⭐" : "☆"}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
