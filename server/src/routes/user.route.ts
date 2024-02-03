import express from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const userRouter = express.Router();

userRouter.route("/register").post(upload.single("avatar"), registerUser);
userRouter.route("/login").post(loginUser);

// secured routes
userRouter.route("/get-current-user").get(verifyJWT, getCurrentUser);
userRouter.route("/logout").post(verifyJWT, logoutUser);

export { userRouter };
