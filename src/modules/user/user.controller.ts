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
    console.log(error)
  }
};

export const userController = {
    createUser
};