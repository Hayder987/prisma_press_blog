import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { ActiveStatus, Role } from "../../generated/prisma/enums";
import { jwtUtils } from "../utils/jwt";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";

export const auth = (...requiredRole: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer")
        ? req.headers.authorization?.split(" ")[1]
        : req.headers.authorization;

    if(!token){
        throw new Error ("you are not logged in Please Login and generate Token")
    };

    const decodedToken = jwtUtils.verifyToken(token, config.jwt_access_secret) as JwtPayload;
    
    if(!decodedToken.success){
        throw new Error(decodedToken.error)
    }

     const { email, name, id, role } = decodedToken.data;

     if(requiredRole.length && !requiredRole.includes(role)){
        throw new Error("Forbidden. You don't have permission to access this resource.");
     };

     const user = await prisma.user.findUnique({
        where : {email, name, id, role}
     });

     if(!user){
         throw new Error("User not found. Please log in again.");
     }

     if(user.activeStatus === ActiveStatus.BLOCKED){
       throw new Error("Your account has been Blocked. Please contact support."); 
     };
     
     const decodedUser = decodedToken?.data
     req.user = decodedUser;

    next();
  });
};
