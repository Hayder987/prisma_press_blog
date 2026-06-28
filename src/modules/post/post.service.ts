import { prisma } from "../../lib/prisma";
import { ICreatePostPayload } from "./post.interface";

// create post
const createPostIntoDB = async (
  payload: ICreatePostPayload,
  userId: string,
) => {
  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });

  return result;
};

// get all posts
const getAllPosts = async () => {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
      comments: true,
    },
  });
  return posts;
};

export const postService = {
  createPostIntoDB,
  getAllPosts,
};
