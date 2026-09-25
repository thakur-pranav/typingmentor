export function TypingTimer({ seconds }) {
  return (
    <div className="border-2 border-nb-border bg-nb-card px-4 py-2 text-center shadow-nb-sm">
      <p className="font-mono text-2xl font-bold tabular-nums text-nb-text">{seconds}s</p>
      <p className="text-[10px] font-bold uppercase tracking-widest text-nb-sub">Time</p>
    </div>
  );
}
