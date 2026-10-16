"use client";

import { useState } from "react";
import { useAsync } from "../../../hooks/useAsync.js";
import { leaderboardService } from "../../../features/leaderboard/services/leaderboardService.js";
import { LeaderboardTable } from "../../../features/leaderboard/components/LeaderboardTable.jsx";
import { Skeleton } from "../../../components/ui/Skeleton.jsx";
import { Alert } from "../../../components/ui/Alert.jsx";
import { TIMED_DURATIONS } from "../../../features/typing/constants/durations.js";
import { cn } from "../../../lib/utils/cn.js";

const MODE_OPTIONS = [
  { value: "timed", label: "Time" },
  { value: "passage", label: "Passage" },
  { value: "code", label: "Code" },
  { value: "all", label: "All" },
];

export default function LeaderboardPage() {
  const [mode, setMode] = useState("timed");
  const [duration, setDuration] = useState(60);

  const { data: entries, isLoading, error } = useAsync(() => {
    const params = {};
    if (mode !== "all") {
      params.mode = mode;
      if (mode === "timed") {
        params.duration = duration;
      }
    }
    return leaderboardService.getLeaderboard(params);
  }, [mode, duration]);

  const activeCategoryLabel =
    mode === "timed"
      ? `Timed (${duration}s)`
      : mode === "passage"
      ? "Passage"
      : mode === "code"
      ? "Code"
      : "All Categories";

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 sm:px-6 py-6 sm:py-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-nb-text">
          Global Leaderboard
        </h1>
        <p className="mt-1 text-xs sm:text-sm font-bold uppercase tracking-wider text-nb-sub">
          Category: <span className="text-nb-text">{activeCategoryLabel}</span>
          {entries && ` · ${entries.length} typists ranked`}
        </p>
      </div>

      {/* Unboxed Segmented Toolbar */}
      <div className="w-full overflow-x-auto no-scrollbar py-1">
        <div className="flex items-center justify-start gap-2 min-w-max">
          <div role="tablist" aria-label="Leaderboard mode" className="inline-flex gap-2">
          {MODE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              role="tab"
              aria-selected={mode === opt.value}
              onClick={() => setMode(opt.value)}
              className={cn(
                "border-2 border-[#0d0d0d] px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffd60a]",
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
            <div role="tablist" aria-label="Leaderboard duration" className="inline-flex flex-wrap gap-2">
              {TIMED_DURATIONS.map((d) => (
                <button
                  key={d}
                  role="tab"
                  aria-selected={duration === d}
                  onClick={() => setDuration(d)}
                  className={cn(
                    "border-2 border-[#0d0d0d] px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffd60a]",
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
      </div>

      {isLoading && <Skeleton className="h-64" />}
      {error && <Alert variant="error">{error}</Alert>}
      {!isLoading && !error && entries && <LeaderboardTable entries={entries} />}
    </div>
  );
}
