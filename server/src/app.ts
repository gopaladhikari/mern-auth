import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const { CORS_ORIGIN } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(
  cors({
    origin: CORS_ORIGIN!,
    credentials: true,
  })
);

// imports

import { userRouter } from "./routes/user.route";

app.use("/api/v1/users", userRouter);

export { app };
