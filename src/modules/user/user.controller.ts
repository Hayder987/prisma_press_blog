import { Request, Response } from "express";
import  httpStatus  from "http-status";
import { userService } from "./user.service";

// register user
const createUser = async(req:Request, res:Response)=>{
  try {
    const body = req.body;
    
    const result = await userService.createUserIntoDB(body);

    res.status(httpStatus.CREATED).json({
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User registered successfully",
        data : result
    });
    
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        message: (error as Error).message,
    });
  }
};

export const userController = {
    createUser
};