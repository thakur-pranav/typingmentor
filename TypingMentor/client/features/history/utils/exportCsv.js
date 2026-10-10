/**
 * Converts typing test results into standard CSV format and initiates a browser download.
 */
export function exportHistoryToCsv(results, filename = "typingmentor_history.csv") {
  if (!results || results.length === 0) return;

  const headers = [
    "Date",
    "Mode",
    "Duration(s)",
    "WPM",
    "Net WPM",
    "Accuracy(%)",
    "Total Chars",
    "Correct Chars",
    "Incorrect Chars",
  ];

  const rows = results.map((r) => [
    `"${new Date(r.createdAt).toISOString()}"`,
    `"${r.mode}"`,
    Math.round(r.duration),
    r.wpm,
    r.netWpm,
    r.accuracy,
    r.totalCharacters ?? "",
    r.correctCharacters ?? "",
    r.incorrectCharacters ?? "",
  ]);

  const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
