import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILogin } from "./auth.interface";

// login user
const loginUserIntoDB = async (payload: ILogin) => {
  const { email, password } = payload;

  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
  });

  const isPasswordMatch = await bcrypt.compare(password, user?.password);

  if (!isPasswordMatch) {
    throw new Error("Password Incorrect");
  }

  const { password: _, ...userWithoutPassword } = user;

  return userWithoutPassword;
};

export const authService = {
  loginUserIntoDB,
};
