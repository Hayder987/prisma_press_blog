import { prisma } from "../../lib/prisma";

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
const getCommentByAuthorFromDB = async (authorId:string)=>{
  const result = await prisma.comment.findMany({
    where : {
      authorId
    },
    include:{
      post :{
        select :{
          id: true,
          title : true
        }
      }
    }
  });
  return result
};


export const commentService = {
  createCommentIntoDB,
  getCommentByAuthorFromDB
};
