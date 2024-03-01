import cors from "cors";
import express from "express";

import { userRouter } from "./routes/user.route";

const { FRONTEND_DOMAIN } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  cors({
    origin: FRONTEND_DOMAIN!,
    credentials: true,
  })
);

app.get("/", (_, res) => {
  res.json({ message: "Hello from gopal! 🦈" });
});

// imports

app.use("/api/v1/user", userRouter);

export { app };
