import { userRouter } from "./modules/user/user.route";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import cookieParser from "cookie-parser";
import httpStatus from "http-status";
import { authRouter } from "./modules/auth/auth.route";
import { postRouter } from "./modules/post/post.route";
import { commentRouter } from "./modules/comment/comment.route";
import { notFound } from "./middlewares/notFound";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { subscriptionRouter } from "./modules/subscription/subscription.route";

const app: Application = express();

// using middleware
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//User route middleware
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);
app.use("/api/subscription", subscriptionRouter);

// root route
app.get("/", (req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: "Welcome to prisma press blogs",
    data: [],
  });
});

// error middleware
app.use(notFound);
app.use(globalErrorHandler);

export default app;
