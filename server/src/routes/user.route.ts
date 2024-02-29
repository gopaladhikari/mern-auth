import express from "express";
import {
  registerUser,
  loginUser,
  verifyEmail,
  getCurrentUser,
  logoutUser,
  requestForgotPassword,
  resetPassword,
  changePassword,
  requestVerifyPhoneNumber,
  verifyPhoneNumber,
} from "../controllers/user.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";

const userRouter = express.Router();

userRouter.route("/register").post(upload.single("avatar"), registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/verify-email").post(verifyEmail);
userRouter.route("/request-forgot-password").post(requestForgotPassword);
userRouter.route("/reset-password").post(resetPassword);

// secured routes
userRouter.route("/get-current-user").get(verifyJWT, getCurrentUser);
userRouter.route("/logout").post(verifyJWT, logoutUser);
userRouter.route("/change-password").post(verifyJWT, changePassword);
userRouter
  .route("/request-verify-phone-number")
  .post(verifyJWT, requestVerifyPhoneNumber);
userRouter.route("/verify-phone-number").post(verifyJWT, verifyPhoneNumber);

export { userRouter };
