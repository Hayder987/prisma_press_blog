import { Router } from "express";
import { premiumController } from "./premium.controller";

const router = Router();

router.get("/posts", premiumController.getPremiumPosts);


export const premiumRouter = router;