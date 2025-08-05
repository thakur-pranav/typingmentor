export const TIMED_DURATIONS = [15, 30, 60, 120] as const;
export type TimedDuration = (typeof TIMED_DURATIONS)[number];
