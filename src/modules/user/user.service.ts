import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { IRegisterUser } from "./user.interface";
import config from "../../config";

// register user into db
const createUserIntoDB = async (payload: IRegisterUser) => {
  const { name, email, password, profilePhoto, bio } = payload;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  //   insert user Profile Data intoDB
  const result = prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword,
      profile: {
        create: {
          profilePhoto,
          bio,
        },
      },
    },
    omit: { password: true },
    include: {
      profile: true,
    },
  });

  return result;
};




export const userService = {
  createUserIntoDB,
};
