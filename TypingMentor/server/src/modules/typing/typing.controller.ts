import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/ApiResponse";
import { typingService } from "./typing.service";
import { Difficulty } from "./typing.types";

export const typingController = {
  listPassages: asyncHandler(async (req: Request, res: Response) => {
    const difficulty = req.query.difficulty as Difficulty | undefined;
    const passages = typingService.getPassages(difficulty);
    sendSuccess(res, 200, "Passages retrieved", passages);
  }),
};
