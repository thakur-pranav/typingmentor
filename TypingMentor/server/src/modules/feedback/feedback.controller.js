import { feedbackService } from "./feedback.service.js";
import { sendSuccess } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

/**
 * Uses Express's req.ip, which honours `app.set("trust proxy", 1)`: it takes the address
 * appended by our one trusted proxy (Render) and ignores any X-Forwarded-For entries the
 * client injected itself. Reading the first X-Forwarded-For entry directly is spoofable.
 */
function getClientIp(req) {
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
    const email = req.auth?.email;
    const ip = getClientIp(req);

    const status = await feedbackService.getCooldownStatus({
      userId,
      email,
      ip,
    });

    return sendSuccess(res, 200, "Cooldown status retrieved", status);
  }),
};
