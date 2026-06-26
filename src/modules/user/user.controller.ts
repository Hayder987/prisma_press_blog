import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";

// register user
const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;

    const user = await userService.createUserIntoDB(body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User registered successfully",
      data: { user },
    });
  },
);

// get single profile
const getMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.user as JwtPayload;

    const user = await userService.getMyProfileFromDB(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Profile Update successfully",
      data: { user },
    });
  },
);

// get all user 
const getAllUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) =>{
  
   const result = await userService.getAllUserFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All User Retrieve successfully",
      data: result,
    });
  }
);

// update user profile
const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const { id } = req.user as JwtPayload;

    const updateUser = await userService.updateUserIntoDB(id, payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Retrieved successfully",
      data: updateUser,
    });
  },
);

// update user By Admin
const updateUserByAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const payload = req.body;

    const updateUser = await userService.updateUserByAdminIntoDB(id, payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Update successfully",
      data: updateUser,
    });
  },
);

// delete many user
const deleteManyUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userService.deleteManyUsersIntoDB(req.body.ids);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "All User Deleted successfully!",
      data: result,
    });
  },
);

//delete single user by id
const deleteUserById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await userService.deleteUserByIdIntoDB(id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User Deleted successfully!",
      data: result,
    });
  },
);

export const userController = {
  createUser,
  getMyProfile,
  getAllUser,
  updateUser,
  updateUserByAdmin,
  deleteManyUsers,
  deleteUserById,
};
