import { PostWhereInput } from "./../../../generated/prisma/models/Post";
import { prisma } from "../../lib/prisma";
import { IPostQuery } from "../post/post.interface";
import { CommentStatus } from "../../../generated/prisma/enums";

// get all premium post
const getPremiumPostFromDB = async (query: IPostQuery) => {
  const limit = query?.limit ? Number(query?.limit) : 6;
  const page = query?.page ? Number(query?.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query?.sortBy ? query?.sortBy : "createdAt";
  const sortOrder = query?.sortOrder ? query?.sortOrder : "desc";
  const tags = query?.tags ? JSON.parse(query?.tags as string) : null;
  const tagsArray = Array.isArray(tags) ? tags : [];

  let andConditions: PostWhereInput[] = [];

  if (query?.searchTerm) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: query?.searchTerm,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: query?.searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (query.authorId) {
    andConditions.push({
      authorId: query.authorId,
    });
  }

  if (query.isFeatured) {
    andConditions.push({
      isFeatured: Boolean(query.isFeatured),
    });
  }

  if (query.tags) {
    andConditions.push({
      tags: {
        hasSome: tagsArray,
      },
    });
  }

  if (query.status) {
    andConditions.push({
      status: query.status,
    });
  }

  andConditions.push({
    isPremium: true,
  });

  const posts = await prisma.post.findMany({
    where: {
      AND: andConditions,
    },

    take: limit,
    skip: skip,

    orderBy: {
      [sortBy]: sortOrder,
    },

    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  const totalPostCount = await prisma.post.count({
    where: {
      AND: andConditions,
    },
  });

  return {
    data: posts,
    meta: {
      total: posts.length === 0 ? 0 : totalPostCount,
      limit: limit,
      page: page,
      totalPage: posts?.length === 0 ? 0 : Math.ceil(totalPostCount / limit),
    },
  };
};

// get premium news by id
const getPremiumPostByIdFromDB = async (postId:string)=>{
   const transactionResult = await prisma.$transaction(async (tx) => {
      await tx.post.update({
        where: {
          id: postId,
        },
        data: {
          views: {
            increment: 1,
          },
        },
      });
  
      const post = await tx.post.findUniqueOrThrow({
        where: {
          id: postId,
          isPremium: true
        },
        include: {
          author: {
            omit: {
              password: true,
            },
          },
          comments: {
            where: {
              status: CommentStatus.APPROVED,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
  
          _count: {
            select: {
              comments: true,
            },
          },
        },
      });
  
      return post;
    });
  
    return transactionResult;

};


export const premiumServices = {
  getPremiumPostFromDB,
  getPremiumPostByIdFromDB
};
