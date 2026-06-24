import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import {
  IRegisterUser,
  IUpdateUserAdmin,
  IUpdateUserMe,
} from "./user.interface";
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

// get single profile
const getMyProfileFromDB = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    omit: { password: true },
    include: {
      profile: true,
    },
  });

  return user;
};

// update user
const updateUserIntoDB = async (userId: string, payload: IUpdateUserMe) => {
  const { name, profilePhoto, bio } = payload;

  const updateUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      profile: {
        update: {
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

  return updateUser;
};

// update user by admin

const updateUserByAdminIntoDB = async (
  userId: string,
  payload: IUpdateUserAdmin,
) => {
  const { name, role, profilePhoto, bio, activeStatus } = payload;

  const updateUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      role,
      activeStatus,
      profile: {
        update: {
          profilePhoto,
          bio,
        },
      },
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });

  return updateUser;
};

export const userService = {
  createUserIntoDB,
  getMyProfileFromDB,
  updateUserIntoDB,
  updateUserByAdminIntoDB,
};
