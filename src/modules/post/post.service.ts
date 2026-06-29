import { CommentStatus, PostStatus } from "../../../generated/prisma/enums";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import {
  ICreatePostPayload,
  IPostQuery,
  IUpdatePostPayload,
} from "./post.interface";

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
const getAllPosts = async (query: IPostQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";
  const tags = query.tags ? JSON.parse(query.tags as string) : null;
  const tagsArray = Array.isArray(tags) ? tags : [];

  const andConditions: PostWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (query.title) {
    andConditions.push({
      title: query.title,
    });
  }

  if (query.content) {
    andConditions.push({
      content: query.content,
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

  const posts = await prisma.post.findMany({
    where: {
      AND: andConditions,
    },

    take: limit,
    skip: skip,

    orderBy: {
      // sortBy : sortOrder
      [sortBy]: sortOrder,
    },

    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
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
      page: page,
      limit: limit,
      total: totalPostCount,
      totalPages: Math.ceil(totalPostCount / limit),
    },
  };
};

// get post by id with transaction rollback
const getPostByIdFromDB = async (postId: string) => {
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

// update post by id
const updatePostByIdIntoDB = async (
  userId: string,
  isAdmin: boolean,
  payload: IUpdatePostPayload,
  postId: string,
) => {
  const existPost = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && existPost.authorId !== userId) {
    throw new Error("You are not the owner of this post!");
  }

  const result = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      ...payload,
    },
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });

  return result;
};

// delete post by admin
const deletePostByIdIntoDB = async (
  postId: string,
  isAdmin: boolean,
  userId: string,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post.authorId !== userId) {
    throw new Error("You are not the owner of this post!");
  }

  await prisma.post.delete({
    where: {
      id: postId,
    },
  });
};

// get post stats with using Promise all
const getPostStatsFromDB = async () => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const [
      totalPosts,
      totalPublishedPosts,
      totalDraftPosts,
      totalArchivedPosts,
      totalComments,
      totalApprovedComments,
      totalRejectedComments,
      totalPostViewsAggregate,
    ] = await Promise.all([
      await tx.post.count(),

      await tx.post.count({
        where: {
          status: PostStatus.PUBLISHED,
        },
      }),

      await tx.post.count({
        where: {
          status: PostStatus.DRAFT,
        },
      }),

      await tx.post.count({
        where: {
          status: PostStatus.ARCHIVED,
        },
      }),

      await tx.comment.count(),

      await tx.comment.count({
        where: {
          status: CommentStatus.APPROVED,
        },
      }),

      await tx.comment.count({
        where: {
          status: CommentStatus.REJECT,
        },
      }),

      await tx.post.aggregate({
        _sum: {
          views: true,
        },
        _max: {
          views: true,
        },
        _avg: {
          views: true,
        },
      }),
    ]);

    return {
      totalPosts,
      totalPublishedPosts,
      totalDraftPosts,
      totalArchivedPosts,
      totalComments,
      totalApprovedComments,
      totalRejectedComments,
      viewsData: {
        totalView: totalPostViewsAggregate._sum.views,
        avgView: Math.round(Number(totalPostViewsAggregate._avg.views)),
        maxView: totalPostViewsAggregate._max.views,
      },
    };
  });

  return transactionResult;
};

// get my post
const getMyPostsFromDB = async (userId: string) => {
  const result = await prisma.post.findMany({
    where: {
      authorId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      comments: true,
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });
  return result;
};

export const postService = {
  createPostIntoDB,
  getAllPosts,
  getPostByIdFromDB,
  updatePostByIdIntoDB,
  deletePostByIdIntoDB,
  getPostStatsFromDB,
  getMyPostsFromDB,
};
