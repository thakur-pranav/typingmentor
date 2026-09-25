import { EmptyState } from "../../../components/ui/EmptyState";

export function HistoryTable({ results }) {
  if (!results || results.length === 0) {
    return <EmptyState title="No typing history" description="Complete a test while logged in to build your history." />;
  }

  return (
    <div className="overflow-x-auto border-2 border-nb-border shadow-nb">
      <table className="w-full text-left text-sm">
        <thead className="border-b-2 border-nb-border bg-nb-yellow">
          <tr>
            {["Date", "Mode", "Duration", "WPM", "Net WPM", "Accuracy"].map((h) => (
              <th key={h} className="px-4 py-3 text-xs font-black uppercase tracking-widest text-nb-text">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {results.map((result, i) => (
            <tr
              key={result.id}
              className={`border-t-2 border-nb-border ${i % 2 === 0 ? "bg-nb-card" : "bg-nb-bg"}`}
            >
              <td className="px-4 py-3 text-nb-sub">{new Date(result.createdAt).toLocaleString()}</td>
              <td className="px-4 py-3 font-bold uppercase text-nb-text">{result.mode}</td>
              <td className="px-4 py-3 font-mono text-nb-sub">{Math.round(result.duration)}s</td>
              <td className="px-4 py-3 font-mono font-black text-nb-text">{result.wpm}</td>
              <td className="px-4 py-3 font-mono text-nb-sub">{result.netWpm}</td>
              <td className="px-4 py-3 font-mono text-nb-sub">{result.accuracy}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
