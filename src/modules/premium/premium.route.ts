import { Router } from "express";
import { premiumController } from "./premium.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { premiumGuard } from "../../middlewares/premiumGurd";

const router = Router();

router.get(
  "/posts",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  premiumGuard(),
  premiumController.getPremiumPosts,
);

export const premiumRouter = router;
