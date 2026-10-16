import { EmptyState } from "../../../components/ui/EmptyState";

export function RecentTestsTable({ tests }) {
  if (!tests || tests.length === 0) {
    return <EmptyState title="No tests yet" description="Take a typing test to see your results here." />;
  }

  return (
    <div className="w-full overflow-x-auto no-scrollbar border-2 border-nb-border shadow-nb">
      <table className="w-full text-left text-xs sm:text-sm">
        <thead className="border-b-2 border-nb-border bg-nb-yellow">
          <tr>
            {["Date", "Mode", "WPM", "Net WPM", "Accuracy"].map((h) => (
              <th key={h} className="px-2.5 sm:px-4 py-2.5 sm:py-3 text-[11px] sm:text-xs font-black uppercase tracking-widest text-nb-text whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tests.map((test, i) => (
            <tr key={test.id} className={`border-t-2 border-nb-border ${i % 2 === 0 ? "bg-nb-card" : "bg-nb-bg"}`}>
              <td className="px-2.5 sm:px-4 py-2.5 sm:py-3 text-nb-sub whitespace-nowrap">{new Date(test.createdAt).toLocaleDateString()}</td>
              <td className="px-2.5 sm:px-4 py-2.5 sm:py-3 font-bold uppercase text-nb-text whitespace-nowrap">{test.mode}</td>
              <td className="px-2.5 sm:px-4 py-2.5 sm:py-3 font-mono font-black text-nb-text whitespace-nowrap">{test.wpm}</td>
              <td className="px-2.5 sm:px-4 py-2.5 sm:py-3 font-mono text-nb-sub whitespace-nowrap">{test.netWpm}</td>
              <td className="px-2.5 sm:px-4 py-2.5 sm:py-3 font-mono text-nb-sub whitespace-nowrap">{test.accuracy}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
