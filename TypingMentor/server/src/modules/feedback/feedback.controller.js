import { feedbackService } from "./feedback.service.js";
import { sendSuccess } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.ip || null;
}

export const feedbackController = {
  submitFeedback: asyncHandler(async (req, res) => {
    const { name, category, subject, message } = req.body;
    const userId = req.auth?.userId;
    const ip = getClientIp(req);

    const feedback = await feedbackService.submitFeedback({
      name,
      category,
      subject,
      message,
      userId,
      ip,
    });

    return sendSuccess(
      res,
      201,
      "Thank you! Your feedback has been received and sent to our team.",
      feedback
    );
  }),

  getCooldownStatus: asyncHandler(async (req, res) => {
    const userId = req.auth?.userId;
    const ip = getClientIp(req);

    const status = await feedbackService.getCooldownStatus({
      userId,
      ip,
    });

    return sendSuccess(res, 200, "Cooldown status retrieved", status);
  }),
};
