import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";

// register user

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;

    const result = await userService.createUserIntoDB(body);

    res.status(httpStatus.CREATED).json({
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User registered successfully",
      data: result,
    });
  },
);

export const userController = {
  createUser,
};
