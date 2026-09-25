import { EmptyState } from "../../../components/ui/EmptyState.jsx";

export function LeaderboardTable({ entries = [] }) {
  if (entries.length === 0) {
    return <EmptyState title="No leaderboard data yet" description="Be the first to set a record!" />;
  }

  const MEDAL = { 1: "🥇", 2: "🥈", 3: "🥉" };

  return (
    <div className="overflow-x-auto border-2 border-nb-border shadow-nb">
      <table className="w-full text-left text-sm">
        <thead className="border-b-2 border-nb-border bg-nb-yellow">
          <tr>
            {["Rank", "Username", "Best WPM", "Accuracy"].map((h) => (
              <th key={h} className="px-4 py-3 text-xs font-black uppercase tracking-widest text-nb-text">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, i) => (
            <tr
              key={entry.userId}
              className={`border-t-2 border-nb-border ${
                entry.rank === 1 ? "bg-nb-yellow/30" :
                entry.rank === 2 ? "bg-nb-cyan/20" :
                entry.rank === 3 ? "bg-nb-card" :
                i % 2 === 0 ? "bg-nb-card" : "bg-nb-bg"
              }`}
            >
              <td className="px-4 py-3 font-black text-nb-text">
                {MEDAL[entry.rank] ?? `#${entry.rank}`}
              </td>
              <td className="px-4 py-3 font-bold text-nb-text">{entry.username}</td>
              <td className="px-4 py-3 font-mono font-black text-nb-text">{entry.bestWpm}</td>
              <td className="px-4 py-3 font-mono text-nb-sub">{entry.accuracy}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
