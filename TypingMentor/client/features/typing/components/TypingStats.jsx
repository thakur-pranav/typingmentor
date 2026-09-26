export function TypingStats({
  stats,
  timedDurationSeconds = 0,
  elapsedSeconds,
  remainingSeconds,
}) {
  const safeStats = stats ?? {
    elapsedSeconds: elapsedSeconds ?? 0,
  };

  const elapsed = safeStats.elapsedSeconds ?? elapsedSeconds ?? 0;
  const started = elapsed > 0;
  const isTimed = timedDurationSeconds > 0;

  const displayTime = isTimed
    ? remainingSeconds !== undefined
      ? remainingSeconds
      : Math.max(0, timedDurationSeconds - elapsed)
    : elapsed;

  return (
    <div
      className={`flex items-baseline justify-end font-mono transition-opacity duration-300 ${
        started ? "opacity-100" : "opacity-60"
      }`}
    >
      {/* Timer countdown (timed/code) or elapsed seconds (passage) */}
      <span className="tabular-nums text-3xl font-black text-nb-text">
        {displayTime}
        <span className="ml-1 text-xs font-bold uppercase text-nb-sub">s</span>
      </span>
    </div>
  );
}
