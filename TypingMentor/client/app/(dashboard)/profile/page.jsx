"use client";

import { ProtectedRoute } from "../../../features/auth/components/ProtectedRoute.jsx";
import { useAuth } from "../../../features/auth/hooks/AuthProvider.jsx";
import { useAsync } from "../../../hooks/useAsync.js";
import { statisticsService } from "../../../features/dashboard/services/statisticsService.js";
import { ProfileSummary } from "../../../features/profile/components/ProfileSummary.jsx";
import { UpdateUsernameForm } from "../../../features/profile/components/UpdateUsernameForm.jsx";
import { Skeleton } from "../../../components/ui/Skeleton.jsx";

function ProfileContent() {
  const { user } = useAuth();
  const { data: stats, isLoading } = useAsync(() => statisticsService.getStatistics(), []);

  if (!user) return null;

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {isLoading ? <Skeleton className="h-64" /> : <ProfileSummary user={user} stats={stats} />}
      <div>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-nb-sub">Update profile</h2>
        <UpdateUsernameForm />
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-4xl space-y-8 px-6 py-12">
        <h1 className="text-3xl font-black uppercase tracking-tight text-nb-text">Profile</h1>
        <ProfileContent />
      </div>
    </ProtectedRoute>
  );
}
