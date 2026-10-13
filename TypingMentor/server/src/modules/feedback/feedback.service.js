import { feedbackRepository } from "./feedback.repository.js";
import { mailService } from "../auth/mail.service.js";
import { ApiError } from "../../utils/ApiError.js";

const COOLDOWN_MINUTES = 15;
const COOLDOWN_MS = COOLDOWN_MINUTES * 60 * 1000;

function buildCooldownQuery({ userId, email, ip, thresholdDate }) {
  const orConditions = [];

  if (email) {
    orConditions.push({ email: email.toLowerCase() });
  }
  if (userId) {
    orConditions.push({ userId });
  }
  if (ip && ip !== "127.0.0.1" && ip !== "::1") {
    orConditions.push({ ip });
  }

  return {
    createdAt: { $gte: thresholdDate },
    ...(orConditions.length > 0 ? { $or: orConditions } : {}),
  };
}

export const feedbackService = {
  async submitFeedback({ name, email, category, subject, message, userId = null, ip = null }) {
    const thresholdDate = new Date(Date.now() - COOLDOWN_MS);
    const query = buildCooldownQuery({ userId, email, ip, thresholdDate });

    const recent = await feedbackRepository.findRecentSubmission(query);

    if (recent) {
      const elapsed = Date.now() - new Date(recent.createdAt).getTime();
      const remainingSeconds = Math.max(1, Math.ceil((COOLDOWN_MS - elapsed) / 1000));
      const min = Math.floor(remainingSeconds / 60);
      const sec = remainingSeconds % 60;

      const timeString = min > 0 ? `${min}m ${sec}s` : `${sec}s`;

      throw new ApiError(
        429,
        `Please wait ${timeString} before submitting another feedback request.`,
        true,
        "FEEDBACK_COOLDOWN_ACTIVE"
      );
    }

    const created = await feedbackRepository.create({
      name,
      email: email.toLowerCase(),
      category,
      subject,
      message,
      userId,
      ip,
    });

    // Asynchronously dispatch notification email (won't block response)
    mailService
      .sendFeedbackNotification({
        name,
        email,
        category,
        subject,
        message,
      })
      .catch((err) => {
        console.error("Failed to dispatch feedback notification email:", err.message);
      });

    return created;
  },

  async getCooldownStatus({ userId = null, email = null, ip = null }) {
    const thresholdDate = new Date(Date.now() - COOLDOWN_MS);
    const query = buildCooldownQuery({ userId, email, ip, thresholdDate });

    const recent = await feedbackRepository.findRecentSubmission(query);

    if (!recent) {
      return { canSubmit: true, remainingSeconds: 0 };
    }

    const elapsed = Date.now() - new Date(recent.createdAt).getTime();
    const remainingSeconds = Math.max(0, Math.ceil((COOLDOWN_MS - elapsed) / 1000));

    return {
      canSubmit: remainingSeconds === 0,
      remainingSeconds,
    };
  },
};
