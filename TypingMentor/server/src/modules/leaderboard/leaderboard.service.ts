import { leaderboardRepository } from "./leaderboard.repository";
import { LeaderboardEntry } from "./leaderboard.types";

const MAX_LEADERBOARD_SIZE = 100;

export const leaderboardService = {
  async getLeaderboard(page: number, limit: number): Promise<LeaderboardEntry[]> {
    const effectiveLimit = Math.min(limit, MAX_LEADERBOARD_SIZE);
    const skip = (page - 1) * effectiveLimit;
    const rows = await leaderboardRepository.getTopUsers(effectiveLimit, skip);

    return rows
      .filter((row) => row.user.length > 0)
      .map((row, index) => ({
        rank: skip + index + 1,
        userId: row._id.toString(),
        username: row.user[0].username,
        bestWpm: row.bestWpm,
        accuracy: Math.round(row.accuracy * 100) / 100,
      }));
  },
};
