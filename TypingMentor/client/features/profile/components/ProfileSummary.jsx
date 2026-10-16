import { Card } from "../../../components/ui/Card.jsx";
import { getWpmTier, evaluateMilestones } from "../utils/badges.js";
import { cn } from "../../../lib/utils/cn.js";

export function ProfileAccountCard({ user, stats }) {
  const currentTier = getWpmTier(stats?.bestWpm ?? 0);

  return (
    <Card className="flex flex-col justify-between space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-nb-border pb-4">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-nb-sub">Account</p>
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

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="border-2 border-nb-border bg-nb-bg p-3 shadow-nb-sm">
          <p className="text-[10px] font-black uppercase tracking-wider text-nb-sub">Email</p>
          <p className="mt-0.5 truncate text-sm font-bold text-nb-text" title={user?.email}>
            {user?.email}
          </p>
        </div>
        <div className="border-2 border-nb-border bg-nb-bg p-3 shadow-nb-sm">
          <p className="text-[10px] font-black uppercase tracking-wider text-nb-sub">Member since</p>
          <p className="mt-0.5 text-sm font-bold text-nb-text">
            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
          </p>
        </div>
      </div>
    </Card>
  );
}

export function ProfileStatsRow({ stats }) {
  return (
    <div>
      <h2 className="mb-3 text-xs font-black uppercase tracking-widest text-nb-sub">
        Lifetime Performance
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="border-2 border-nb-border bg-nb-card p-5 shadow-nb border-t-4 border-t-nb-yellow">
          <p className="text-xs font-black uppercase tracking-wider text-nb-sub">Best WPM</p>
          <p className="mt-2 font-mono text-4xl font-black text-nb-text">{stats?.bestWpm ?? 0}</p>
        </div>
        <div className="border-2 border-nb-border bg-nb-card p-5 shadow-nb border-t-4 border-t-nb-cyan">
          <p className="text-xs font-black uppercase tracking-wider text-nb-sub">Average WPM</p>
          <p className="mt-2 font-mono text-4xl font-black text-nb-text">{stats?.averageWpm ?? 0}</p>
        </div>
        <div className="border-2 border-nb-border bg-nb-card p-5 shadow-nb border-t-4 border-t-nb-green">
          <p className="text-xs font-black uppercase tracking-wider text-nb-sub">Total Tests</p>
          <p className="mt-2 font-mono text-4xl font-black text-nb-text">{stats?.totalTests ?? 0}</p>
        </div>
      </div>
    </div>
  );
}

export function ProfileBadgesSection({ stats }) {
  const milestones = evaluateMilestones(stats ?? {});
  const unlockedCount = milestones.filter((m) => m.isUnlocked).length;
  const percentage = Math.round((unlockedCount / milestones.length) * 100);

  return (
    <div className="border-2 border-nb-border bg-nb-card p-4 sm:p-6 shadow-nb">
      <div className="flex items-center justify-between border-b-2 border-nb-border pb-4">
        <div>
          <h3 className="text-base font-black uppercase tracking-wider text-nb-text">
            Milestone Badges
          </h3>
          <p className="mt-0.5 text-xs text-nb-sub">
            {unlockedCount} of {milestones.length} unlocked
          </p>
        </div>
        <span className="border-2 border-nb-border bg-nb-yellow px-3 py-1 font-mono text-xs font-black text-nb-text shadow-nb-sm">
          {percentage}% Complete
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {milestones.map((m) => (
          <div
            key={m.id}
            className={cn(
              "border-2 p-4 transition-all shadow-nb-sm",
              m.isUnlocked
                ? "border-nb-border bg-nb-bg"
                : "border-nb-border/40 bg-nb-card/40 opacity-60"
            )}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl">{m.icon}</span>
              <span className="text-xs font-black uppercase tracking-wide text-nb-text">
                {m.title}
              </span>
            </div>
            <p className="mt-2 text-xs text-nb-sub line-clamp-2 min-h-[32px]">{m.description}</p>
            <div className="mt-3 border-t border-nb-border/30 pt-2 text-xs font-mono font-bold">
              {m.isUnlocked ? (
                <span className="font-black text-[#06d6a0]">✓ Unlocked</span>
              ) : (
                <span className="text-nb-sub">🔒 Locked</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProfileSummary({ user, stats }) {
  return (
    <div className="space-y-8">
      <ProfileAccountCard user={user} stats={stats} />
      <ProfileStatsRow stats={stats} />
      <ProfileBadgesSection stats={stats} />
    </div>
  );
}

