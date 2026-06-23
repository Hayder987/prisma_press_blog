import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILogin } from "./auth.interface";
import { JwtPayload, SignOptions } from "jsonwebtoken";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";
import { ActiveStatus } from "../../../generated/prisma/enums";


// login user
const loginUserIntoDB = async (payload: ILogin) => {
  const { email, password } = payload;

  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
  });

  if(user.activeStatus === ActiveStatus.BLOCKED){
       throw new Error("Your account has been Blocked. Please contact support."); 
  };

  const isPasswordMatch = await bcrypt.compare(password, user?.password);

  if (!isPasswordMatch) {
    throw new Error("Password Incorrect");
  }

  // create jwt token
  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  } as JwtPayload;

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions,
  );

  return { accessToken, refreshToken };
};

export const authService = {
  loginUserIntoDB,
};
