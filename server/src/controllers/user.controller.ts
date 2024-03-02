import { RequestWithUser } from "../models/models";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { dbHandler } from "../utils/dbHandler";
import { sendEmail } from "../utils/emailSender";
import bcrypt from "bcrypt";
import { sendSms } from "../utils/sendSms";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../conf/env";

const generateAccessAndRefreshToken = async (id: string) => {
  try {
    const user = await User.findById(id);
    if (!user) throw new ApiError(400, "User not found");

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, `Internal Server Error ${error}`);
  }
};

const registerUser = dbHandler(async (req, res) => {
  const userDetails = req.body;
  const localAvatarPath = req.file?.path;
  if (!localAvatarPath) throw new ApiError(400, "Please upload an avatar");

  try {
    const avatar = await uploadOnCloudinary(localAvatarPath);

    if (!avatar) throw new ApiError(400, "Failed to upload avatar");

    const existedUser = await User.findOne({ email: userDetails.email });

    if (existedUser) throw new ApiError(400, "User already exists");

    const createdUser = await User.create({
      ...userDetails,
      avatar: avatar.url,
    });

    const user = await User.findById(createdUser._id).select("-password");

    if (!user) throw new ApiError(400, "User not found");
    await sendEmail(user.email, "verify", user._id);

    res
      .status(201)
      .json(new ApiResponse(201, "Verfication email sent", { user }));
  } catch (error) {
    throw new ApiError(500, `Internal Server Error ${error}`);
  }
});

const loginUser = dbHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) throw new ApiError(400, "Invalid credentials");

  try {
    const user = await User.findOne({ email });

    if (!user) throw new ApiError(400, "User not found");

    if (!user.isEmailVerified)
      throw new ApiError(400, "Please verify your email first");

    const isMatch = await user.comparePassword(password);

    if (!isMatch) throw new ApiError(400, "Invalid credentials");

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    const logginedUser = await User.findById(user._id).select(
      "-password -refreshToken -otp"
    );
    res.status(200).json(
      new ApiResponse(200, "User logged in successfully", {
        user: logginedUser,
        accessToken,
        refreshToken,
      })
    );
  } catch (error) {
    throw new ApiError(500, `Internal Server Error ${error}`);
  }
});

const logoutUser = dbHandler(async (req: RequestWithUser, res) => {
  try {
    const id = req.user?._id;
    await User.findByIdAndUpdate(id, {
      $unset: { refreshToken: 1 },
    });

    res.json(new ApiResponse(200, "User logged out successfully"));
  } catch (error) {
    throw new ApiError(500, `Internal Server Error ${error}`);
  }
});

const getCurrentUser = dbHandler(async (req: RequestWithUser, res) => {
  const _id = req.user?._id;

  try {
    const user = await User.findByIdAndUpdate(
      _id,
      {
        $unset: { refreshToken: 1 },
      },
      {
        new: true,
      }
    ).select("-password");
    res
      .status(200)
      .json(new ApiResponse(200, "User found successfully", { user }));
  } catch (error) {
    throw new ApiError(500, `Internal Server Error ${error}`);
  }
});

const verifyEmail = dbHandler(async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      {
        emailVerificationToken: token,
        emailVerificationTokenExpiry: { $gt: Date.now() },
      },
      {
        $set: { isEmailVerified: true },
        $unset: {
          emailVerificationToken: 1,
          emailVerificationTokenExpiry: 1,
        },
      },
      {
        new: true,
      }
    );

    if (!user) throw new ApiError(400, "Invalid token");

    res
      .status(200)
      .json(new ApiResponse(200, "Email verified successfully", { user }));
  } catch (error) {
    throw new ApiError(500, `Internal Server Error ${error}`);
  }
});

const requestForgotPassword = dbHandler(async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) throw new ApiError(400, "User not found");
    await sendEmail(user.email, "reset", user._id);

    res.status(200).json(new ApiResponse(200, "Password reset email sent", {}));
  } catch (error) {
    throw new ApiError(500, `Internal Server Error ${error}`);
  }
});

const resetPassword = dbHandler(async (req, res) => {
  const { token, password, confirmPassword } = req.body;

  if (password !== confirmPassword)
    throw new ApiError(400, "Passwords do not match");
  if (!token) throw new ApiError(400, "Token is required");

  try {
    const user = await User.findOneAndUpdate(
      {
        forgotPasswordToken: token,
        forgotPasswordTokenExpiry: { $gt: Date.now() },
      },
      {
        $set: { password: await bcrypt.hash(password, 10) },
        $unset: { forgotPasswordToken: 1, forgotPasswordTokenExpiry: 1 },
      }
    );

    if (!user) throw new ApiError(400, "Invalid token");

    res
      .status(200)
      .json(new ApiResponse(200, "Password reset successfully", {}));
  } catch (error) {
    throw new ApiError(500, `Internal Server Error ${error}`);
  }
});

const changePassword = dbHandler(async (req: RequestWithUser, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  switch (true) {
    case !oldPassword:
      throw new ApiError(400, "Old password is required");
    case !newPassword:
      throw new ApiError(400, "New password is required");
    case !confirmPassword:
      throw new ApiError(400, "Confirm password is required");
    case newPassword !== confirmPassword:
      throw new ApiError(400, "Passwords do not match");
    default:
      break;
  }

  try {
    const user = await User.findById(req.user?._id);

    if (!user) throw new ApiError(400, "User not found");

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new ApiError(400, "Old password is incorrect");

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
    res
      .status(200)
      .json(new ApiResponse(200, "Password changed successfully", { user }));
  } catch (error) {
    throw new ApiError(500, `Internal Server Error ${error}`);
  }
});

const requestVerifyPhoneNumber = dbHandler(
  async (req: RequestWithUser, res) => {
    const { phoneNumber } = req.body;
    if (!phoneNumber) throw new ApiError(400, "Phone number is required");
    const otp = Math.floor(Math.random() * 900000 + 100000).toString();

    try {
      const message = await sendSms(phoneNumber, otp);

      if (!message) throw new ApiError(500, "Failed to send SMS");

      const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
          $set: { otp, otpSent: true },
        },
        {
          new: true,
        }
      );

      res
        .status(200)
        .json(new ApiResponse(200, "Verification code successfully", { user }));
    } catch (error) {
      throw new ApiError(500, "Internal server error");
    }
  }
);

const verifyPhoneNumber = dbHandler(async (req: RequestWithUser, res) => {
  const userOtp = req.user?.otp;

  const { otp } = req.body;

  if (!otp) throw new ApiError(400, "OTP is required");

  if (userOtp !== otp) throw new ApiError(400, "Invalid OTP");

  try {
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: { isPhoneNumberVerified: true },
        $unset: {
          otp: 1,
          otpSent: 1,
        },
      },
      {
        new: true,
      }
    );

    res
      .status(200)
      .json(new ApiResponse(200, "OTP verified successfully", { user }));
  } catch (error) {
    throw new ApiError(500, `Internal Server Error ${error}`);
  }
});

const refreshAccessAndRefreshToken = dbHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) throw new ApiError(400, "Refresh token is required");

  const decoded = jwt.verify(
    refreshToken,
    env.refreshTokenSecret
  ) as JwtPayload;

  try {
    const user = await User.findById(decoded._id);

    if (!user) throw new ApiError(400, "Invalid refresh token");

    if (refreshToken !== user.refreshToken)
      throw new ApiError(400, "Refresh token is expired or used");

    const tokens = await generateAccessAndRefreshToken(user._id);

    res.status(200).json(
      new ApiResponse(200, "Refreshed successfully", {
        user,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      })
    );
  } catch (error) {
    throw new ApiError(500, `Internal Server Error ${error}`);
  }
});

export {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  verifyEmail,
  requestForgotPassword,
  resetPassword,
  changePassword,
  requestVerifyPhoneNumber,
  verifyPhoneNumber,
  refreshAccessAndRefreshToken,
};
