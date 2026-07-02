import { prisma } from "../../lib/prisma";

const getPremiumPostFromDB = async () =>{

    const posts = await prisma.post.findMany({
        where : {
            isPremium : true
        }
    });

    return posts
};


export const premiumServices = {
    getPremiumPostFromDB
};