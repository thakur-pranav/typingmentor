import { statisticsRepository } from "./statistics.repository";
import { UserStatistics } from "./statistics.types";

const RECENT_TESTS_LIMIT = 10;

export const statisticsService = {
  async getForUser(userId: string): Promise<UserStatistics> {
    const [aggregated, recentTests] = await Promise.all([
      statisticsRepository.getAggregatedStats(userId),
      statisticsRepository.getRecentTests(userId, RECENT_TESTS_LIMIT),
    ]);

    if (!aggregated) {
      return {
        bestWpm: 0,
        bestNetWpm: 0,
        averageWpm: 0,
        averageAccuracy: 0,
        totalTests: 0,
        totalCharacters: 0,
        recentTests: [],
      };
    }

    return {
      bestWpm: Math.round(aggregated.bestWpm * 100) / 100,
      bestNetWpm: Math.round(aggregated.bestNetWpm * 100) / 100,
      averageWpm: Math.round(aggregated.averageWpm * 100) / 100,
      averageAccuracy: Math.round(aggregated.averageAccuracy * 100) / 100,
      totalTests: aggregated.totalTests,
      totalCharacters: aggregated.totalCharacters,
      recentTests,
    };
  },
};
