import { Card } from "../../../components/ui/Card.jsx";

export function ProfileSummary({ user, stats }) {
  return (
    <Card className="space-y-4">
      <div>
        <p className="text-xs font-black uppercase tracking-wider text-nb-sub">Username</p>
        <p className="text-lg font-bold text-nb-text">{user?.username}</p>
      </div>
      <div>
        <p className="text-xs font-black uppercase tracking-wider text-nb-sub">Email</p>
        <p className="text-lg font-bold text-nb-text">{user?.email}</p>
      </div>
      <div>
        <p className="text-xs font-black uppercase tracking-wider text-nb-sub">Member since</p>
        <p className="text-lg font-bold text-nb-text">
          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
        </p>
      </div>
      {stats && (
        <div className="grid grid-cols-3 gap-4 border-t-2 border-nb-border pt-4">
          <div className="border-2 border-nb-border bg-nb-bg p-3 shadow-nb-sm">
            <p className="text-xs font-black uppercase tracking-wider text-nb-sub">Best WPM</p>
            <p className="text-xl font-mono font-black text-nb-text">{stats.bestWpm}</p>
          </div>
          <div className="border-2 border-nb-border bg-nb-bg p-3 shadow-nb-sm">
            <p className="text-xs font-black uppercase tracking-wider text-nb-sub">Average WPM</p>
            <p className="text-xl font-mono font-black text-nb-text">{stats.averageWpm}</p>
          </div>
          <div className="border-2 border-nb-border bg-nb-bg p-3 shadow-nb-sm">
            <p className="text-xs font-black uppercase tracking-wider text-nb-sub">Total Tests</p>
            <p className="text-xl font-mono font-black text-nb-text">{stats.totalTests}</p>
          </div>
        </div>
      )}
    </Card>
  );
}
