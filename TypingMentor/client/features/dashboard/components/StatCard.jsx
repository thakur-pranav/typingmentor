export function StatCard({ label, value }) {
  return (
    <div className="border-2 border-nb-border bg-nb-card p-5 shadow-nb text-center">
      <p className="font-mono text-3xl font-black tabular-nums text-nb-text">{value}</p>
      <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-nb-sub">{label}</p>
    </div>
  );
}
