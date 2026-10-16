import { EmptyState } from "../../../components/ui/EmptyState";

export function HistoryTable({ results }) {
  if (!results || results.length === 0) {
    return <EmptyState title="No typing history" description="Complete a test while logged in to build your history." />;
  }

  return (
    <div className="w-full overflow-x-auto no-scrollbar border-2 border-nb-border shadow-nb">
      <table className="w-full text-left text-xs sm:text-sm">
        <thead className="border-b-2 border-nb-border bg-nb-yellow">
          <tr>
            {["Date", "Mode", "Duration", "WPM", "Net WPM", "Accuracy"].map((h) => (
              <th key={h} className="px-2.5 sm:px-4 py-2.5 sm:py-3 text-[11px] sm:text-xs font-black uppercase tracking-widest text-nb-text whitespace-nowrap">
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
              <td className="px-2.5 sm:px-4 py-2.5 sm:py-3 text-nb-sub whitespace-nowrap">{new Date(result.createdAt).toLocaleDateString()}</td>
              <td className="px-2.5 sm:px-4 py-2.5 sm:py-3 font-bold uppercase text-nb-text whitespace-nowrap">{result.mode}</td>
              <td className="px-2.5 sm:px-4 py-2.5 sm:py-3 font-mono text-nb-sub whitespace-nowrap">{Math.round(result.duration)}s</td>
              <td className="px-2.5 sm:px-4 py-2.5 sm:py-3 font-mono font-black text-nb-text whitespace-nowrap">{result.wpm}</td>
              <td className="px-2.5 sm:px-4 py-2.5 sm:py-3 font-mono text-nb-sub whitespace-nowrap">{result.netWpm}</td>
              <td className="px-2.5 sm:px-4 py-2.5 sm:py-3 font-mono text-nb-sub whitespace-nowrap">{result.accuracy}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
