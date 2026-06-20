import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import cookieParser from "cookie-parser";

const app:Application = express();

// using middleware
app.use(cors({
    origin : config.app_url,
    credentials : true,
}))

app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(cookieParser())

// root route
app.get("/", (req:Request, res:Response)=>{
    res.send("Welcome to prisma press blogs")
})

export default app;

