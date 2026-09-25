import { Types } from "mongoose";
import { ResultModel } from "../results/result.model.js";

export const statisticsRepository = {
  async getAggregatedStats(userId) {
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

  getRecentTests(userId, limit) {
    return ResultModel.find({ userId }).sort({ createdAt: -1 }).limit(limit);
  },
};
