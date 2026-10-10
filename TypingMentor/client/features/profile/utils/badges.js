/**
 * Typist Rank Tiers and Milestone Badges utilities.
 */

export const WPM_TIERS = [
  { minWpm: 140, label: "Grandmaster", icon: "⚡", bg: "bg-[#ff006e]", text: "text-white" },
  { minWpm: 120, label: "Master", icon: "👑", bg: "bg-[#ff9f1c]", text: "text-[#0d0d0d]" },
  { minWpm: 100, label: "Pro", icon: "🔥", bg: "bg-[#ffd60a]", text: "text-[#0d0d0d]" },
  { minWpm: 80, label: "Swift", icon: "🚀", bg: "bg-[#06d6a0]", text: "text-[#0d0d0d]" },
  { minWpm: 60, label: "Touch Typist", icon: "⌨️", bg: "bg-[#00b4d8]", text: "text-[#0d0d0d]" },
  { minWpm: 0, label: "Novice", icon: "🌱", bg: "bg-[#e5e0d0]", text: "text-[#5a5a5a]" },
];

export function getWpmTier(wpm = 0) {
  const numericWpm = Number(wpm) || 0;
  for (const tier of WPM_TIERS) {
    if (numericWpm >= tier.minWpm) {
      return tier;
    }
  }
  return WPM_TIERS[WPM_TIERS.length - 1];
}

export const MILESTONES = [
  {
    id: "accuracy_sniper",
    title: "Sniper",
    icon: "🎯",
    description: "Achieve >= 98% accuracy on tests",
    check: (stats) => (stats?.averageAccuracy ?? 0) >= 98,
  },
  {
    id: "century_speed",
    title: "100+ Club",
    icon: "🔥",
    description: "Reach 100+ WPM personal best",
    check: (stats) => (stats?.bestWpm ?? 0) >= 100,
  },
  {
    id: "grandmaster_speed",
    title: "Grandmaster",
    icon: "⚡",
    description: "Reach 140+ WPM personal best",
    check: (stats) => (stats?.bestWpm ?? 0) >= 140,
  },
  {
    id: "centurion_tests",
    title: "Centurion",
    icon: "🛡️",
    description: "Complete 100+ test runs",
    check: (stats) => (stats?.totalTests ?? 0) >= 100,
  },
  {
    id: "veteran_tests",
    title: "Veteran",
    icon: "🏅",
    description: "Complete 25+ test runs",
    check: (stats) => (stats?.totalTests ?? 0) >= 25,
  },
  {
    id: "keystroke_warrior",
    title: "Key Warrior",
    icon: "⚔️",
    description: "Type over 5,000 total characters",
    check: (stats) => (stats?.totalCharacters ?? 0) >= 5000,
  },
];

export function evaluateMilestones(stats = {}) {
  return MILESTONES.map((m) => ({
    ...m,
    isUnlocked: m.check(stats),
  }));
}
