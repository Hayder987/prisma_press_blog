import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/register", userController.createUser);
router.get("/me", auth(Role.ADMIN, Role.AUTHOR, Role.USER), userController.getMyProfile);
router.patch("/my-profile", auth(Role.ADMIN, Role.AUTHOR, Role.USER), userController.updateUser);
router.patch("/:id", auth(Role.ADMIN), userController.updateUserByAdmin );
router.delete("/delete-many", userController.deleteManyUsers);

export const userRouter = router;