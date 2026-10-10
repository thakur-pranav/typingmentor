import { ResultModel } from "../results/result.model.js";

/**
 * Aggregation pipeline: group results by user to find each user's best WPM
 * run (and that run's accuracy), sort by best WPM, then join user info in a
 * single $lookup so we avoid N+1 queries against the users collection.
 */
export const leaderboardRepository = {
  getTopUsers(limit, skip = 0, filter = {}) {
    const match = {};
    if (filter.mode) {
      match.mode = filter.mode;
    } else {
      match.mode = { $in: ["timed", "passage", "code"] };
    }
    if (filter.duration) {
      match.duration = Number(filter.duration);
    }

    const pipeline = [];
    if (Object.keys(match).length > 0) {
      pipeline.push({ $match: match });
    }

    pipeline.push(
      { $sort: { wpm: -1, accuracy: -1 } },
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
      }
    );

    return ResultModel.aggregate(pipeline).exec();
  },
};
