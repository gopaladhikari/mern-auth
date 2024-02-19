import express from "express";
import {
	registerUser,
	loginUser,
	verifyEmail,
	getCurrentUser,
	logoutUser,
} from "../controllers/user.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";

const userRouter = express.Router();

userRouter.route("/register").post(upload.single("avatar"), registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/verify-email").post(verifyEmail);

// secured routes
userRouter.route("/get-current-user").get(verifyJWT, getCurrentUser);
userRouter.route("/logout").post(verifyJWT, logoutUser);

export { userRouter };
