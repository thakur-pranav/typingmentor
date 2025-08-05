"use client";

import { ProtectedRoute } from "../../../features/auth/components/ProtectedRoute";
import { useAuth } from "../../../features/auth/hooks/AuthProvider";
import { useAsync } from "../../../hooks/useAsync";
import { statisticsService } from "../../../features/dashboard/services/statisticsService";
import { ProfileSummary } from "../../../features/profile/components/ProfileSummary";
import { UpdateUsernameForm } from "../../../features/profile/components/UpdateUsernameForm";
import { Skeleton } from "../../../components/ui/Skeleton";

function ProfileContent() {
  const { user } = useAuth();
  const { data: stats, isLoading } = useAsync(() => statisticsService.getStatistics(), []);

  if (!user) return null;

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {isLoading ? <Skeleton className="h-64" /> : <ProfileSummary user={user} stats={stats} />}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-white">Update profile</h2>
        <UpdateUsernameForm />
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-4xl space-y-8 px-6 py-12">
        <h1 className="text-2xl font-semibold text-white">Profile</h1>
        <ProfileContent />
      </div>
    </ProtectedRoute>
  );
}
