import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { userRouter } from "./routes/user.route";

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
  res.json({ message: "Hello from gopal! 🦈" });
});

// imports

app.use("/api/v1/user", userRouter);

export { app };
