export function TypingTimer({ seconds }: { seconds: number }) {
  return (
    <div className="rounded-lg border border-slate-800 px-4 py-2 text-center">
      <p className="text-2xl font-semibold tabular-nums text-white">{seconds}s</p>
      <p className="text-xs text-slate-500">Time</p>
    </div>
  );
}
