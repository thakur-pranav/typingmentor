import { apiClient } from "../../../lib/api/apiClient";

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  bestWpm: number;
  accuracy: number;
}

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export const leaderboardService = {
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const { data } = await apiClient.get<ApiEnvelope<LeaderboardEntry[]>>("/leaderboard");
    return data.data;
  },
};
