import { Card } from "../../../components/ui/Card.jsx";
import { getWpmTier, evaluateMilestones } from "../utils/badges.js";
import { cn } from "../../../lib/utils/cn.js";

export function ProfileSummary({ user, stats }) {
  const currentTier = getWpmTier(stats?.bestWpm ?? 0);
  const milestones = evaluateMilestones(stats ?? {});
  const unlockedCount = milestones.filter((m) => m.isUnlocked).length;

  return (
    <div className="space-y-6">
      {/* Account Info Card */}
      <Card className="space-y-4">
        {/* Header with Username & Current Tier Rank */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-nb-border pb-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-nb-sub">Username</p>
            <p className="text-2xl font-black text-nb-text">{user?.username}</p>
          </div>
          <div
            className={cn(
              "inline-flex items-center gap-1.5 border-2 border-nb-border px-3 py-1 font-mono text-xs font-black uppercase tracking-widest shadow-nb-sm",
              currentTier.bg,
              currentTier.text
            )}
          >
            <span>{currentTier.icon}</span>
            <span>{currentTier.label}</span>
          </div>
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-wider text-nb-sub">Email</p>
          <p className="text-sm font-bold text-nb-text">{user?.email}</p>
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-wider text-nb-sub">Member since</p>
          <p className="text-sm font-bold text-nb-text">
            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
          </p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-3 gap-3 border-t-2 border-nb-border pt-4">
            <div className="border-2 border-nb-border bg-nb-bg p-3 shadow-nb-sm text-center">
              <p className="text-[10px] font-black uppercase tracking-wider text-nb-sub">Best WPM</p>
              <p className="mt-1 text-2xl font-mono font-black text-nb-text">{stats.bestWpm}</p>
            </div>
            <div className="border-2 border-nb-border bg-nb-bg p-3 shadow-nb-sm text-center">
              <p className="text-[10px] font-black uppercase tracking-wider text-nb-sub">Avg WPM</p>
              <p className="mt-1 text-2xl font-mono font-black text-nb-text">{stats.averageWpm}</p>
            </div>
            <div className="border-2 border-nb-border bg-nb-bg p-3 shadow-nb-sm text-center">
              <p className="text-[10px] font-black uppercase tracking-wider text-nb-sub">Total Tests</p>
              <p className="mt-1 text-2xl font-mono font-black text-nb-text">{stats.totalTests}</p>
            </div>
          </div>
        )}
      </Card>

      {/* Milestone Badges Showcase */}
      <div className="border-2 border-nb-border bg-nb-card p-6 shadow-nb">
        <div className="flex items-center justify-between border-b-2 border-nb-border pb-3">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-nb-text">
              Milestone Badges
            </h3>
            <p className="text-xs text-nb-sub">
              {unlockedCount} of {milestones.length} unlocked
            </p>
          </div>
          <span className="border-2 border-nb-border bg-nb-yellow px-2.5 py-0.5 font-mono text-xs font-black text-nb-text shadow-nb-sm">
            {Math.round((unlockedCount / milestones.length) * 100)}%
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {milestones.map((m) => (
            <div
              key={m.id}
              className={cn(
                "border-2 p-3 transition-all",
                m.isUnlocked
                  ? "border-nb-border bg-nb-bg shadow-nb-sm"
                  : "border-nb-border/40 bg-nb-card/40 opacity-50"
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{m.icon}</span>
                <span className="text-xs font-black uppercase tracking-wide text-nb-text">
                  {m.title}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-nb-sub line-clamp-2">{m.description}</p>
              <div className="mt-2 text-[10px] font-mono font-bold">
                {m.isUnlocked ? (
                  <span className="text-[#06d6a0]">✓ Unlocked</span>
                ) : (
                  <span className="text-nb-sub">🔒 Locked</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
