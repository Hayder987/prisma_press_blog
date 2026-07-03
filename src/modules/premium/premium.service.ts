import { PostWhereInput } from "./../../../generated/prisma/models/Post";
import { prisma } from "../../lib/prisma";
import { IPostQuery } from "../post/post.interface";

const getPremiumPostFromDB = async (query: IPostQuery) => {
  const limit = query?.limit ? Number(query?.limit) : 10;
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
          content : {
            contains : query?.searchTerm,
            mode : "insensitive"
          }
        }
      ],
    });
  };

  if(query.authorId){
        andConditions.push({
            authorId : query.authorId
        })
    }

    if(query.isFeatured) {
        andConditions.push({
            isFeatured: Boolean(query.isFeatured)
        })
    }

    if(query.tags){
        andConditions.push({
            tags : {
                hasSome : tagsArray
            }
        })
    }

    if(query.status) {
        andConditions.push({
            status: query.status
        })
    }

    andConditions.push({
        isPremium : true
    });

    const posts = await prisma.post.findMany({
     where : {
      AND : andConditions
     },

     take : limit,
     skip : skip,

     orderBy : {
      [sortBy] : sortOrder
     },

     include : {
      author :{
        omit : {
          password : true
        }
      },
      comments : true
     }

    });

    const totalPostCount = await prisma.post.count({
      where : {
        AND : andConditions
      }
    });

    return {
      data : posts,
      meta : {
        total : totalPostCount,
        limit : limit,
        page: page,
        totalPage : Math.ceil(totalPostCount / limit)
      }
    }

};


export const premiumServices = {
  getPremiumPostFromDB,
};
