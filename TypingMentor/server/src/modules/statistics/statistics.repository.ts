import { Types } from "mongoose";
import { ResultModel } from "../results/result.model";

interface AggregatedStats {
  bestWpm: number;
  bestNetWpm: number;
  averageWpm: number;
  averageAccuracy: number;
  totalTests: number;
  totalCharacters: number;
}

export const statisticsRepository = {
  async getAggregatedStats(userId: string): Promise<AggregatedStats | null> {
    const [stats] = await ResultModel.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$userId",
          bestWpm: { $max: "$wpm" },
          bestNetWpm: { $max: "$netWpm" },
          averageWpm: { $avg: "$wpm" },
          averageAccuracy: { $avg: "$accuracy" },
          totalTests: { $sum: 1 },
          totalCharacters: { $sum: "$totalCharacters" },
        },
      },
    ]);
    return stats ?? null;
  },

  getRecentTests(userId: string, limit: number) {
    return ResultModel.find({ userId }).sort({ createdAt: -1 }).limit(limit);
  },
};
