"use client";

import { useAsync } from "../../../hooks/useAsync";
import { leaderboardService } from "../../../features/leaderboard/services/leaderboardService";
import { LeaderboardTable } from "../../../features/leaderboard/components/LeaderboardTable";
import { Skeleton } from "../../../components/ui/Skeleton";
import { Alert } from "../../../components/ui/Alert";

export default function LeaderboardPage() {
  const { data: entries, isLoading, error } = useAsync(() => leaderboardService.getLeaderboard(), []);

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-6 py-12">
      <h1 className="text-3xl font-black uppercase tracking-tight text-nb-text">Global Leaderboard</h1>
      {isLoading && <Skeleton className="h-64" />}
      {error && <Alert variant="error">{error}</Alert>}
      {entries && <LeaderboardTable entries={entries} />}
    </div>
  );
}
