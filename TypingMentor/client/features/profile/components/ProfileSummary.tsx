import { Card } from "../../../components/ui/Card";
import { AuthUser } from "../../auth/types";
import { UserStatistics } from "../../dashboard/types";

export function ProfileSummary({ user, stats }: { user: AuthUser; stats: UserStatistics | null }) {
  return (
    <Card className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">Username</p>
        <p className="text-lg font-medium text-white">{user.username}</p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">Email</p>
        <p className="text-lg font-medium text-white">{user.email}</p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">Member since</p>
        <p className="text-lg font-medium text-white">{new Date(user.createdAt).toLocaleDateString()}</p>
      </div>
      {stats && (
        <div className="grid grid-cols-3 gap-4 border-t border-slate-800 pt-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Best WPM</p>
            <p className="text-lg font-semibold text-white">{stats.bestWpm}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Average WPM</p>
            <p className="text-lg font-semibold text-white">{stats.averageWpm}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Total Tests</p>
            <p className="text-lg font-semibold text-white">{stats.totalTests}</p>
          </div>
        </div>
      )}
    </Card>
  );
}
