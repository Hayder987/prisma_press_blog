import { Router } from "express";
import { postController } from "./post.controller";

const router = Router();

router.post("/", postController.createPost);
router.get("/", postController.getAllPosts);
router.get("/stats", postController.getPostsStats);
router.get("/my-posts", postController.getMyPosts);
router.get("/:postId", postController.getPostById);
router.patch("/:postId", postController.updatePost);
router.delete("/:postId", postController.deletePost);

export const postRouter = router;
