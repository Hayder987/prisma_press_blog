import  httpStatus  from 'http-status';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { commentService } from './comment.service';

const createComment = catchAsync(
    async(req:Request, res:Response, next:NextFunction)=>{
     const userId = req.user?.id;
     const payload = req.body;
     
     const comment = await commentService.createCommentIntoDB(userId, payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Comment created successfully",
      data: {comment},
    });
    }
);

const getCommentByAuthorId = catchAsync(
    async(req:Request, res:Response, next:NextFunction)=>{

    }
);

const getCommentByCommentId = catchAsync(
    async(req:Request, res:Response, next:NextFunction)=>{

    }
);

const updateComment = catchAsync(
    async(req:Request, res:Response, next:NextFunction)=>{

    }
);

const deleteComment = catchAsync(
    async(req:Request, res:Response, next:NextFunction)=>{

    }
);

const moderateComment = catchAsync(
    async(req:Request, res:Response, next:NextFunction)=>{

    }
);

export const commentController = {
    createComment,
    getCommentByAuthorId,
    getCommentByCommentId,
    updateComment,
    deleteComment,
    moderateComment

}