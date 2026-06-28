import  httpStatus  from 'http-status';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { postService } from './post.service';

// create post
const createPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req?.user?.id;

    const post = await postService.createPostIntoDB(req.body, id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "post create successfully",
      data: {post},
    });
  },
);

// get all post
const getAllPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
   
    const posts = await postService.getAllPosts();

   sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "All post Retrieve successfully",
      data: {posts},
    });
  },
);

// get post by id
const getPostById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const updatePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const deletePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const getPostsStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const getMyPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export const postController = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getPostsStats,
  getMyPosts,
};
