"use client";

import { ProtectedRoute } from "../../../features/auth/components/ProtectedRoute.jsx";
import { useAuth } from "../../../features/auth/hooks/AuthProvider.jsx";
import { useAsync } from "../../../hooks/useAsync.js";
import { statisticsService } from "../../../features/dashboard/services/statisticsService.js";
import {
  ProfileAccountCard,
  ProfileStatsRow,
  ProfileBadgesSection,
} from "../../../features/profile/components/ProfileSummary.jsx";
import { UpdateUsernameForm } from "../../../features/profile/components/UpdateUsernameForm.jsx";
import { Card } from "../../../components/ui/Card.jsx";
import { Skeleton } from "../../../components/ui/Skeleton.jsx";

function ProfileContent() {
  const { user } = useAuth();
  const { data: stats, isLoading } = useAsync(() => statisticsService.getStatistics(), []);

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-44" />
          <Skeleton className="h-44" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Row 1: Account Info & Update Profile */}
      <div className="grid gap-6 md:grid-cols-2">
        <ProfileAccountCard user={user} stats={stats} />
        <Card className="flex flex-col justify-between space-y-4">
          <div className="border-b-2 border-nb-border pb-3">
            <h2 className="text-sm font-black uppercase tracking-wider text-nb-text">
              Update Profile
            </h2>
            <p className="mt-0.5 text-xs text-nb-sub">
              Change your display name visible across public leaderboards.
            </p>
          </div>
          <UpdateUsernameForm />
        </Card>
      </div>

      {/* Row 2: Lifetime Performance */}
      <ProfileStatsRow stats={stats} />

      {/* Row 3: Milestone Badges */}
      <ProfileBadgesSection stats={stats} />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-5xl space-y-8 px-6 py-12">
        <h1 className="text-3xl font-black uppercase tracking-tight text-nb-text">Profile</h1>
        <ProfileContent />
      </div>
    </ProtectedRoute>
  );
}

