export function TypingProgress({
  typedLength,
  totalLength,
}: {
  typedLength: number;
  totalLength: number;
}) {
  const percent =
    totalLength === 0 ? 0 : Math.min(100, Math.round((typedLength / totalLength) * 100));

  return (
    <div className="h-[2px] w-full overflow-hidden rounded-full bg-[#2c2e31]">
      <div
        className="h-full rounded-full bg-[#e2b714] transition-all duration-150"
        style={{ width: `${percent}%` }}
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}
