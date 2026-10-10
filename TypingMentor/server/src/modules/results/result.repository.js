import { ResultModel } from "./result.model.js";

export const resultRepository = {
  create(userId, data) {
    return ResultModel.create({ userId, ...data });
  },

  async findHistory(userId, page, limit, filter = {}) {
    const skip = (page - 1) * limit;
    const query = {
      userId,
      ...(filter.mode ? { mode: filter.mode } : {}),
      ...(filter.duration ? { duration: Number(filter.duration) } : {}),
    };
    const [results, total] = await Promise.all([
      ResultModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      ResultModel.countDocuments(query),
    ]);
    return { results, total };
  },

  findRecentForUser(userId, limit) {
    return ResultModel.find({ userId }).sort({ createdAt: -1 }).limit(limit);
  },
};
