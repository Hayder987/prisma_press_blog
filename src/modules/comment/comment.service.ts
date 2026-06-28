import { prisma } from "../../lib/prisma";

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

export const commentService = {
  createCommentIntoDB,
};
