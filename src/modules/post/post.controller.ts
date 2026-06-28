import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { postService } from "./post.service";

// create post
const createPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req?.user?.id;

    const post = await postService.createPostIntoDB(req.body, id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "post create successfully",
      data: { post },
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
      data: { posts },
    });
  },
);

// get post by id
const getPostById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId;

    const post = await postService.getPostByIdFromDB(postId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "post Retrieve successfully",
      data: { post },
    });
  },
);

// update post
const updatePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN";
    const payload = req.body;
    const postId = req.params.postId;

    if (!postId) {
      throw new Error("Required postId in Params");
    }

    const updatePost = await postService.updatePostByIdIntoDB(
      userId as string,
      isAdmin,
      payload,
      postId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "post Update successfully",
      data: updatePost,
    });
  },
);

// delete post by id
const deletePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    const postId = req.params.postId;
    const isAdmin = req.user?.role === "ADMIN";
    const userId = req.user?.id;

    if (!postId) {
      throw new Error("Required postId in Params");
    }

    await postService.deletePostByIdIntoDB(postId as string, isAdmin, userId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Post Delete successfully",
      data: null,
    });
  },
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
