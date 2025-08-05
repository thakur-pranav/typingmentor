import { LiveTypingStats } from "../types";

interface TypingStatsProps {
  stats: LiveTypingStats;
  mode: "timed" | "passage";
  timedDurationSeconds?: number;
}

export function TypingStats({ stats, mode, timedDurationSeconds }: TypingStatsProps) {
  const started = stats.elapsedSeconds > 0;

  const rightValue =
    mode === "timed"
      ? Math.max(0, (timedDurationSeconds ?? 0) - stats.elapsedSeconds)
      : stats.errors;

  return (
    <div
      className={`flex items-baseline justify-between font-mono transition-opacity duration-300 ${
        started ? "opacity-100" : "opacity-40"
      }`}
    >
      {/* Live WPM */}
      <span className="tabular-nums text-3xl font-medium text-[#e2b714]">
        {stats.wpm}
        <span className="ml-1 text-sm font-normal text-[#646669]">wpm</span>
      </span>

      {/* Countdown (timed) or error count (passage) */}
      <span className="tabular-nums text-3xl font-medium text-[#e2b714]">
        {rightValue}
        {mode === "timed" && (
          <span className="ml-1 text-sm font-normal text-[#646669]">s</span>
        )}
        {mode === "passage" && stats.errors > 0 && (
          <span className="ml-1 text-sm font-normal text-[#646669]">err</span>
        )}
      </span>
    </div>
  );
}
