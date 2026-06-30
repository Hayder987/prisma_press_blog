import { prisma } from "../../lib/prisma";

const createCheckoutSession = async (userId: string) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      include:{
        subscription : true
      }
    });

   


  });
};

export const subscriptionService = {
  createCheckoutSession,
};
