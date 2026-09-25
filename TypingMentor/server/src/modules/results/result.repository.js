import { ResultModel } from "./result.model.js";

export const resultRepository = {
  create(userId, data) {
    return ResultModel.create({ userId, ...data });
  },

  async findHistory(userId, page, limit) {
    const skip = (page - 1) * limit;
    const [results, total] = await Promise.all([
      ResultModel.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      ResultModel.countDocuments({ userId }),
    ]);
    return { results, total };
  },

  findRecentForUser(userId, limit) {
    return ResultModel.find({ userId }).sort({ createdAt: -1 }).limit(limit);
  },
};
