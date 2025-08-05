import { ResultModel } from "../results/result.model";
import { Types } from "mongoose";

interface RawLeaderboardRow {
  _id: Types.ObjectId;
  bestWpm: number;
  accuracy: number;
  user: { username: string }[];
}

/**
 * Aggregation pipeline: group results by user to find each user's best WPM
 * run (and that run's accuracy), sort by best WPM, then join user info in a
 * single $lookup so we avoid N+1 queries against the users collection.
 */
export const leaderboardRepository = {
  getTopUsers(limit: number, skip = 0): Promise<RawLeaderboardRow[]> {
    return ResultModel.aggregate<RawLeaderboardRow>([
      { $sort: { wpm: -1 } },
      {
        $group: {
          _id: "$userId",
          bestWpm: { $first: "$wpm" },
          accuracy: { $first: "$accuracy" },
        },
      },
      { $sort: { bestWpm: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
    ]).exec();
  },
};
