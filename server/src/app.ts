import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRouter } from "./routes/user.route.js";

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

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// imports

app.use("/api/v1/user", userRouter);

export { app };
