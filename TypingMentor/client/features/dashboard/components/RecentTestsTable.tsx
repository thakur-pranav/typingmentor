import { TestResultSummary } from "../types";
import { EmptyState } from "../../../components/ui/EmptyState";

export function RecentTestsTable({ tests }: { tests: TestResultSummary[] }) {
  if (tests.length === 0) {
    return <EmptyState title="No tests yet" description="Take a typing test to see your results here." />;
  }

  return (
    <div className="overflow-x-auto border-2 border-nb-border shadow-nb">
      <table className="w-full text-left text-sm">
        <thead className="border-b-2 border-nb-border bg-nb-yellow">
          <tr>
            {["Date", "Mode", "WPM", "Net WPM", "Accuracy"].map((h) => (
              <th key={h} className="px-4 py-3 text-xs font-black uppercase tracking-widest text-nb-text">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tests.map((test, i) => (
            <tr key={test.id} className={`border-t-2 border-nb-border ${i % 2 === 0 ? "bg-nb-card" : "bg-nb-bg"}`}>
              <td className="px-4 py-3 text-nb-sub">{new Date(test.createdAt).toLocaleString()}</td>
              <td className="px-4 py-3 font-bold uppercase text-nb-text">{test.mode}</td>
              <td className="px-4 py-3 font-mono font-black text-nb-text">{test.wpm}</td>
              <td className="px-4 py-3 font-mono text-nb-sub">{test.netWpm}</td>
              <td className="px-4 py-3 font-mono text-nb-sub">{test.accuracy}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
