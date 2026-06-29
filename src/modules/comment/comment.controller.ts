import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { commentService } from "./comment.service";

// create comment
const createComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const payload = req.body;

    const comment = await commentService.createCommentIntoDB(userId, payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Comment created successfully",
      data: { comment },
    });
  },
);

// get comment by author id
const getCommentByAuthorId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.params.authorId;

    const comments = await commentService.getCommentByAuthorFromDB(
      authorId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Author Comment Get successfully",
      data: { comments },
    });
  },
);

// get comment by comment id
const getCommentByCommentId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.commentId;

    const comment = await commentService.getCommentByIdFromDB(
      commentId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Comment Get successfully",
      data: comment,
    });
  },
);

// update comment by comment id
const updateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const commentId = req.params.commentId;
    const payload = req.body;
    const isAdmin = req.user?.role === "ADMIN";

    const result = await commentService.updateCommentByIdIntoDB(
      userId as string,
      commentId as string,
      payload,
      isAdmin as boolean,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Comment Update successfully",
      data: result,
    });
  },
);

const deleteComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    
    const commentId = req.params.commentId;
    const userId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN";

     await commentService.deleteCommentFromDBById(commentId as string, userId as string, isAdmin)

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Comment Deleted successfully",
      data: null,
    });
  },
);

const moderateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    const commentId = req.params.commentId;
    const payload = req.body;

    const result = await commentService.moderateCommentIntoDB(commentId as string, payload);
    
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Comment status update successfully",
      data: result,
    });

  },
);

export const commentController = {
  createComment,
  getCommentByAuthorId,
  getCommentByCommentId,
  updateComment,
  deleteComment,
  moderateComment,
};
