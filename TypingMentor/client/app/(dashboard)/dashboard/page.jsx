"use client";

import { ProtectedRoute } from "../../../features/auth/components/ProtectedRoute.jsx";
import { useAsync } from "../../../hooks/useAsync.js";
import { statisticsService } from "../../../features/dashboard/services/statisticsService.js";
import { StatCard } from "../../../features/dashboard/components/StatCard.jsx";
import { RecentTestsTable } from "../../../features/dashboard/components/RecentTestsTable.jsx";
import { Skeleton } from "../../../components/ui/Skeleton.jsx";
import { Alert } from "../../../components/ui/Alert.jsx";

function DashboardContent() {
  const { data: stats, isLoading, error } = useAsync(() => statisticsService.getStatistics(), []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return <Alert variant="error">{error ?? "Could not load statistics."}</Alert>;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <StatCard label="Best WPM" value={stats.bestWpm} />
        <StatCard label="Best Net WPM" value={stats.bestNetWpm} />
        <StatCard label="Average WPM" value={stats.averageWpm} />
        <StatCard label="Average Accuracy" value={`${stats.averageAccuracy}%`} />
        <StatCard label="Total Tests" value={stats.totalTests} />
      </div>

      <div>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-nb-sub">Recent tests</h2>
        <RecentTestsTable tests={stats.recentTests} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-5xl space-y-8 px-6 py-12">
        <h1 className="text-3xl font-black uppercase tracking-tight text-nb-text">Dashboard</h1>
        <DashboardContent />
      </div>
    </ProtectedRoute>
  );
}
