import { Feedback } from "./feedback.model.js";

export const feedbackRepository = {
  async create(data) {
    return Feedback.create(data);
  },

  async findRecentSubmission(query) {
    return Feedback.findOne(query).sort({ createdAt: -1 });
  },
};
