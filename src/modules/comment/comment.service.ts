import { prisma } from "../../lib/prisma";
import { IUpdateCommentPayload } from "./comment.interface";

// create comment
const createCommentIntoDB = async (userId: string, payload: any) => {
  const postExist = await prisma.post.findUniqueOrThrow({
    where: {
      id: payload?.postId,
    },
  });

  const comment = await prisma.comment.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });

  return comment;
};

// get comment by authorID
const getCommentByAuthorFromDB = async (authorId: string) => {
  const result = await prisma.comment.findMany({
    where: {
      authorId,
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
  return result;
};

// get comment by comment id
const getCommentByIdFromDB = async (commentId: string) => {
  const result = await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
  return result;
};

// update comment by comment id
const updateCommentByIdIntoDB = async (
  userId: string,
  commentId: string,
  payload: IUpdateCommentPayload,
  isAdmin: boolean,
) => {
  const commentExist = await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
    },
  });

  if (!isAdmin && commentExist.authorId !== userId) {
    throw new Error("This is Not Your Comment");
  }

  const result = await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      ...payload,
    },
  });

  return result;
};

// delete comment by id
const deleteCommentFromDBById = async (
  commentId: string,
  userId: string,
  isAdmin: boolean,
) => {

  const commentData = await prisma.comment.findUniqueOrThrow({
    where : {
      id : commentId
    },
    select:{
      id: true,
      authorId : true
    }
  });

  if(!isAdmin && commentData.authorId !== userId){
    throw new Error("This is not your comment")
  };

   await prisma.comment.delete({
    where : {
      id: commentData.id
    }
  });

};

export const commentService = {
  createCommentIntoDB,
  getCommentByAuthorFromDB,
  getCommentByIdFromDB,
  updateCommentByIdIntoDB,
  deleteCommentFromDBById,
};
