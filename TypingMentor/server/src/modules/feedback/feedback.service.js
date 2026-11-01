import { feedbackRepository } from "./feedback.repository.js";
import { mailService } from "../auth/mail.service.js";
import { ApiError } from "../../utils/ApiError.js";
import { UserModel } from "../users/user.model.js";
import { feedbackCooldownStore } from "../../utils/rateLimiter.js";

const COOLDOWN_MINUTES = 15;
const COOLDOWN_MS = COOLDOWN_MINUTES * 60 * 1000;

function getCooldownKeys({ userId, email, ip }) {
  const keys = [];
  if (userId) keys.push(`user:${userId}`);
  if (email) keys.push(`email:${email.toLowerCase()}`);
  if (ip && ip !== "127.0.0.1" && ip !== "::1") keys.push(`ip:${ip}`);
  return keys;
}

function buildCooldownQuery({ userId, email, ip, thresholdDate }) {
  const orConditions = [];

  if (userId) {
    orConditions.push({ userId });
  }
  if (email) {
    orConditions.push({ email: email.toLowerCase() });
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
  async submitFeedback({ name, category, subject, message, userId, ip = null }) {
    if (!userId) {
      throw ApiError.unauthorized("Authentication is required to submit feedback");
    }

    const user = await UserModel.findById(userId).select("isEmailVerified email");
    if (!user) {
      throw ApiError.unauthorized("User account not found");
    }

    if (!user.isEmailVerified) {
      throw new ApiError(
        403,
        "Please verify your email address before sending feedback. Check your inbox for the verification link.",
        true,
        "EMAIL_NOT_VERIFIED"
      );
    }

    const email = user.email.toLowerCase();
    const cooldownKeys = getCooldownKeys({ userId, email, ip });

    // FAST PATH: In-memory O(1) cooldown check (avoids disk-bound MongoDB query)
    const memCooldown = feedbackCooldownStore.check(cooldownKeys);
    if (memCooldown.isLimited) {
      const min = Math.floor(memCooldown.remainingSeconds / 60);
      const sec = memCooldown.remainingSeconds % 60;
      const timeString = min > 0 ? `${min}m ${sec}s` : `${sec}s`;

      throw new ApiError(
        429,
        `Please wait ${timeString} before submitting another feedback request.`,
        true,
        "FEEDBACK_COOLDOWN_ACTIVE"
      );
    }

    // COLD-START / RECOVERY PATH: In case server recently restarted, query DB once
    const thresholdDate = new Date(Date.now() - COOLDOWN_MS);
    const query = buildCooldownQuery({ userId, email, ip, thresholdDate });

    const recent = await feedbackRepository.findRecentSubmission(query);

    if (recent) {
      const elapsed = Date.now() - new Date(recent.createdAt).getTime();
      const remainingMs = COOLDOWN_MS - elapsed;
      if (remainingMs > 0) {
        // Hydrate in-memory cache with remaining TTL
        feedbackCooldownStore.set(cooldownKeys, remainingMs);

        const remainingSeconds = Math.max(1, Math.ceil(remainingMs / 1000));
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
    }

    const created = await feedbackRepository.create({
      name,
      email,
      category,
      subject,
      message,
      userId,
      ip,
    });

    // Record cooldown in memory for all compound keys
    feedbackCooldownStore.set(cooldownKeys, COOLDOWN_MS);

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

  async getCooldownStatus({ userId, email = null, ip = null }) {
    if (!userId) {
      return { canSubmit: false, remainingSeconds: 0 };
    }

    let normalizedEmail = email ? email.toLowerCase() : null;
    if (!normalizedEmail) {
      const user = await UserModel.findById(userId).select("email");
      normalizedEmail = user?.email?.toLowerCase() || null;
    }

    const cooldownKeys = getCooldownKeys({ userId, email: normalizedEmail, ip });

    // FAST PATH: In-memory check
    const memCooldown = feedbackCooldownStore.check(cooldownKeys);
    if (memCooldown.isLimited) {
      return {
        canSubmit: false,
        remainingSeconds: memCooldown.remainingSeconds,
      };
    }

    // COLD-START / RECOVERY PATH: Query DB as fallback
    const thresholdDate = new Date(Date.now() - COOLDOWN_MS);
    const query = buildCooldownQuery({ userId, email: normalizedEmail, ip, thresholdDate });

    const recent = await feedbackRepository.findRecentSubmission(query);

    if (!recent) {
      return { canSubmit: true, remainingSeconds: 0 };
    }

    const elapsed = Date.now() - new Date(recent.createdAt).getTime();
    const remainingMs = COOLDOWN_MS - elapsed;
    if (remainingMs <= 0) {
      return { canSubmit: true, remainingSeconds: 0 };
    }

    // Hydrate memory cache
    feedbackCooldownStore.set(cooldownKeys, remainingMs);
    const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000));

    return {
      canSubmit: remainingSeconds === 0,
      remainingSeconds,
    };
  },
};
