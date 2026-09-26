export function TypingProgress({ percent, typedLength, totalLength }) {
  const calculatedPercent =
    percent !== undefined
      ? percent
      : totalLength === 0 || totalLength === undefined
      ? 0
      : Math.min(100, Math.round((typedLength / totalLength) * 100));

  return (
    <div className="h-2 w-full overflow-hidden border-2 border-nb-border bg-nb-card shadow-nb-sm">
      <div
        className="h-full bg-nb-yellow transition-all duration-150"
        style={{ width: `${percent}%` }}
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}
