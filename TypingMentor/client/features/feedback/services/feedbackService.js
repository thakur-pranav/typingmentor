import { apiClient } from "../../../lib/api/apiClient";

export const feedbackService = {
  async submitFeedback({ name, email, category, subject, message }) {
    const res = await apiClient.post("/feedback", {
      name,
      email,
      category,
      subject,
      message,
    });
    return res.data;
  },

  async getCooldownStatus() {
    const res = await apiClient.get("/feedback/cooldown");
    return res.data?.data;
  },
};
