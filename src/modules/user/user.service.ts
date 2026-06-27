import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import {
  IRegisterUser,
  IUpdateUserAdmin,
  IUpdateUserMe,
  TGetAllUserQuery,
} from "./user.interface";
import config from "../../config";
import { deletedUserLogs } from "../../utils/logs.deleted.user";

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

// get all user
const getAllUserFromDB = async (queryData: TGetAllUserQuery) => {
  const { emails, role , year} = queryData || {};

  const where: any = {};
  
  // Email filter
  if (emails && emails?.length > 0) {
    where.email = {
      in: emails,
    };
  }

  // Role filter
  if (role) {
    where.role = role;
  };

  // email filter
   if (year) {
    where.createdAt = {
      gte: new Date(`${year}-01-01T00:00:00.000Z`),
      lt: new Date(`${Number(year) + 1}-01-01T00:00:00.000Z`),
    };
  };

  console.log(where);

  const result = await prisma.user.findMany({
    where,
    orderBy: {
      id: "desc",
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });

  const total = await prisma.user.count({
    where
  });

  return {result, total};
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

// delete many user
const deleteManyUsersIntoDB = async (ids: string[]) => {
  const users = await prisma.user.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  });

  if (!users.length) {
    throw new Error("Users not found");
  }

  await prisma.user.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });

  for (const user of users) {
    await deletedUserLogs({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  }

  return {
    count: users.length,
  };
};

// delete user by single
const deleteUserByIdIntoDB = async (userId: string) => {
  const userExists = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!userExists) {
    throw new Error("User not found");
  }

  const result = await prisma.user.delete({
    where: { id: userId },
  });

  await deletedUserLogs({
    name: result?.name,
    email: result?.email,
    role: result?.role,
  });

  return result;
};

export const userService = {
  createUserIntoDB,
  getMyProfileFromDB,
  getAllUserFromDB,
  updateUserIntoDB,
  updateUserByAdminIntoDB,
  deleteManyUsersIntoDB,
  deleteUserByIdIntoDB,
};
