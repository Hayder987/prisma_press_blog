import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { premiumServices } from "./premium.service";

const getPremiumPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const posts = await premiumServices.getPremiumPostFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All Premium Post retrieved successfully",
      data: { posts },
    });
  },
);

export const premiumController = {
  getPremiumPosts,
};
