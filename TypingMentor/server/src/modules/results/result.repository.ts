import { ResultModel } from "./result.model";
import { SubmitResultInput } from "./result.types";

export const resultRepository = {
  create(userId: string, data: SubmitResultInput) {
    return ResultModel.create({ userId, ...data });
  },

  async findHistory(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [results, total] = await Promise.all([
      ResultModel.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      ResultModel.countDocuments({ userId }),
    ]);
    return { results, total };
  },

  findRecentForUser(userId: string, limit: number) {
    return ResultModel.find({ userId }).sort({ createdAt: -1 }).limit(limit);
  },
};
