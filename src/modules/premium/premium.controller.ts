import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { premiumServices } from "./premium.service";

// get all premium post
const getPremiumPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const posts = await premiumServices.getPremiumPostFromDB(query);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All Premium Post retrieved successfully",
      data: posts.data,
      meta : posts.meta
    });
  },
);

// get premium post by id

const getPremiumPostById = catchAsync (
  async (req: Request, res: Response, next: NextFunction) =>{
    const {id} = req.params;

    const result = await premiumServices.getPremiumPostByIdFromDB(id as string)

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Premium Post retrieved successfully",
      data: result,
    });
  }
)



export const premiumController = {
  getPremiumPosts,
  getPremiumPostById
};
