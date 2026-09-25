export function TypingStats({ stats, mode, timedDurationSeconds }) {
  const started = stats.elapsedSeconds > 0;

  const rightValue =
    mode === "timed"
      ? Math.max(0, (timedDurationSeconds ?? 0) - stats.elapsedSeconds)
      : stats.errors;

  return (
    <div
      className={`flex items-baseline justify-between font-mono transition-opacity duration-300 ${
        started ? "opacity-100" : "opacity-60"
      }`}
    >
      {/* Live WPM */}
      <span className="tabular-nums text-3xl font-black text-nb-text">
        {stats.wpm}
        <span className="ml-1 text-xs font-bold uppercase text-nb-sub">wpm</span>
      </span>

      {/* Countdown (timed) or error count (passage/code) */}
      <span className="tabular-nums text-3xl font-black text-nb-text">
        {rightValue}
        {mode === "timed" && (
          <span className="ml-1 text-xs font-bold uppercase text-nb-sub">s</span>
        )}
        {mode !== "timed" && stats.errors > 0 && (
          <span className="ml-1 text-xs font-bold uppercase text-nb-pink">err</span>
        )}
      </span>
    </div>
  );
}
