"use client";

import { useState } from "react";
import { ProtectedRoute } from "../../../features/auth/components/ProtectedRoute.jsx";
import { useAsync } from "../../../hooks/useAsync.js";
import { historyService } from "../../../features/history/services/historyService.js";
import { HistoryTable } from "../../../features/history/components/HistoryTable.jsx";
import { PaginationControls } from "../../../features/history/components/PaginationControls.jsx";
import { exportHistoryToCsv } from "../../../features/history/utils/exportCsv.js";
import { Skeleton } from "../../../components/ui/Skeleton.jsx";
import { Alert } from "../../../components/ui/Alert.jsx";
import { TIMED_DURATIONS } from "../../../features/typing/constants/durations.js";
import { cn } from "../../../lib/utils/cn.js";

const MODE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "timed", label: "Time" },
  { value: "passage", label: "Passage" },
  { value: "code", label: "Code" },
];

function HistoryContent() {
  const [page, setPage] = useState(1);
  const [mode, setMode] = useState("all");
  const [duration, setDuration] = useState(60);

  const { data, isLoading, error } = useAsync(() => {
    const filter = {};
    if (mode !== "all") {
      filter.mode = mode;
      if (mode === "timed") {
        filter.duration = duration;
      }
    }
    return historyService.getHistory(page, 10, filter);
  }, [page, mode, duration]);

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    setPage(1);
  };

  const handleDurationChange = (nextDuration) => {
    setDuration(nextDuration);
    setPage(1);
  };

  const handleExportCsv = () => {
    if (data?.results && data.results.length > 0) {
      exportHistoryToCsv(data.results);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar: Filter Pills + Export Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Unboxed Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div role="tablist" aria-label="History mode filter" className="inline-flex flex-wrap gap-2">
            {MODE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                role="tab"
                aria-selected={mode === opt.value}
                onClick={() => handleModeChange(opt.value)}
                className={cn(
                  "border-2 border-[#0d0d0d] px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffd60a]",
                  mode === opt.value
                    ? "bg-[#ffd60a] text-[#0d0d0d] shadow-[2px_2px_0_#0d0d0d]"
                    : "bg-[#ffffff] text-[#5a5a5a] shadow-[2px_2px_0_#0d0d0d] hover:translate-x-[1px] hover:translate-y-[1px] hover:text-[#0d0d0d] hover:shadow-none"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {mode === "timed" && (
            <>
              <span className="mx-1 text-base font-black text-nb-sub" aria-hidden="true">
                ·
              </span>
              <div role="tablist" aria-label="History duration filter" className="inline-flex flex-wrap gap-2">
                {TIMED_DURATIONS.map((d) => (
                  <button
                    key={d}
                    role="tab"
                    aria-selected={duration === d}
                    onClick={() => handleDurationChange(d)}
                    className={cn(
                      "border-2 border-[#0d0d0d] px-3 py-1.5 text-xs font-bold uppercase tracking-widest transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffd60a]",
                      duration === d
                        ? "bg-[#ffd60a] text-[#0d0d0d] shadow-[2px_2px_0_#0d0d0d]"
                        : "bg-[#ffffff] text-[#5a5a5a] shadow-[2px_2px_0_#0d0d0d] hover:translate-x-[1px] hover:translate-y-[1px] hover:text-[#0d0d0d] hover:shadow-none"
                    )}
                  >
                    {d}s
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* CSV Export Button */}
        {data?.results && data.results.length > 0 && (
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 border-2 border-nb-border bg-nb-card px-4 py-2 text-xs font-bold uppercase tracking-widest text-nb-text shadow-nb-sm transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
            aria-label="Export history as CSV"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export CSV
          </button>
        )}
      </div>

      {isLoading && <Skeleton className="h-64" />}
      {error && <Alert variant="error">{error}</Alert>}
      {!isLoading && !error && data && (
        <>
          <HistoryTable results={data.results} />
          {data.totalPages > 1 && (
            <PaginationControls page={data.page} totalPages={data.totalPages} onChange={setPage} />
          )}
        </>
      )}
    </div>
  );
}

export default function HistoryPage() {
  return (
    <ProtectedRoute>
      <div className="mx-auto w-full max-w-5xl space-y-8 px-6 py-12">
        <h1 className="text-3xl font-black uppercase tracking-tight text-nb-text">Typing History</h1>
        <HistoryContent />
      </div>
    </ProtectedRoute>
  );
}
