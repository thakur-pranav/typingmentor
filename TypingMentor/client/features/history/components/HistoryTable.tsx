import { TestResultSummary } from "../../dashboard/types";
import { EmptyState } from "../../../components/ui/EmptyState";

export function HistoryTable({ results }: { results: TestResultSummary[] }) {
  if (results.length === 0) {
    return <EmptyState title="No typing history" description="Complete a test while logged in to build your history." />;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-900 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Mode</th>
            <th className="px-4 py-3">Duration</th>
            <th className="px-4 py-3">WPM</th>
            <th className="px-4 py-3">Net WPM</th>
            <th className="px-4 py-3">Accuracy</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr key={result.id} className="border-t border-slate-800">
              <td className="px-4 py-3 text-slate-400">{new Date(result.createdAt).toLocaleString()}</td>
              <td className="px-4 py-3 capitalize">{result.mode}</td>
              <td className="px-4 py-3">{Math.round(result.duration)}s</td>
              <td className="px-4 py-3 font-medium text-white">{result.wpm}</td>
              <td className="px-4 py-3">{result.netWpm}</td>
              <td className="px-4 py-3">{result.accuracy}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
