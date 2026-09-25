import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/ApiResponse.js";
import { typingService } from "./typing.service.js";

export const typingController = {
  listPassages: asyncHandler(async (req, res) => {
    const { difficulty } = req.query;
    const passages = typingService.getPassages(difficulty);
    sendSuccess(res, 200, "Passages retrieved", passages);
  }),
};
