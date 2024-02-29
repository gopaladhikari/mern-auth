import { RequestWithUser } from "../models/models";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { dbHandler } from "../utils/dbHandler";
import { sendEmail } from "../utils/emailSender";
import bcrypt from "bcrypt";
import { sendSms } from "../utils/sendSms";

const generateAccessAndRefreshToken = async (id: string) => {
  const user = await User.findById(id);
  if (!user) throw new ApiError(400, "User not found");

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;

  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const registerUser = dbHandler(async (req, res) => {
  const userDetails = req.body;

  const localAvatarPath = req.file?.path;

  if (!localAvatarPath) throw new ApiError(400, "Please upload an avatar");

  const avatar = await uploadOnCloudinary(localAvatarPath);

  if (!avatar) throw new ApiError(400, "Failed to upload avatar");

  const existedUser = await User.findOne({ email: userDetails.email });

  if (existedUser) throw new ApiError(400, "User already exists");

  const createdUser = await User.create({ ...userDetails, avatar: avatar.url });

  const user = await User.findById(createdUser._id).select("-password");

  if (!user) throw new ApiError(400, "User not found");
  await sendEmail(user.email, "verify", user._id);

  return res
    .status(201)
    .json(new ApiResponse(201, "Verfication email sent", { user }));
});

const loginUser = dbHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, "Invalid credentials");

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
    "-password -refreshToken"
  );
  return res.status(200).json(
    new ApiResponse(200, "User logged in successfully", {
      user: logginedUser,
      accessToken,
      refreshToken,
    })
  );
});

const logoutUser = dbHandler(async (req: RequestWithUser, res) => {
  const id = req.user?._id;
  await User.findByIdAndUpdate(id, {
    $unset: { refreshToken: 1 },
  });

  res.json(new ApiResponse(200, "User logged out successfully"));
});

const getCurrentUser = dbHandler(async (req: RequestWithUser, res) => {
  const _id = req.user?._id;

  const user = await User.findByIdAndUpdate(
    _id,
    {
      $unset: { refreshToken: 1 },
    },
    {
      new: true,
    }
  ).select("-password");
  return res
    .status(200)
    .json(new ApiResponse(200, "User found successfully", { user }));
});

const verifyEmail = dbHandler(async (req, res) => {
  try {
    const { token } = req.body;
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

    return res
      .status(200)
      .json(new ApiResponse(200, "Email verified successfully", { user }));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, "Failed to verify email"));
  }
});

const requestForgotPassword = dbHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) throw new ApiError(400, "User not found");
    await sendEmail(user.email, "reset", user._id);

    return res
      .status(200)
      .json(new ApiResponse(200, "Password reset email sent", {}));
  } catch (error) {
    throw new ApiError(500, "Internal server error");
  }
});

const resetPassword = dbHandler(async (req, res) => {
  const { token, password, confirmPassword } = req.body;

  if (password !== confirmPassword)
    throw new ApiError(400, "Passwords do not match");
  if (!token) throw new ApiError(400, "Token is required");

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

  res.status(200).json(new ApiResponse(200, "Password reset successfully", {}));
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

  const user = await User.findById(req.user?._id);

  if (!user) throw new ApiError(400, "User not found");

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new ApiError(400, "Old password is incorrect");

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  res
    .status(200)
    .json(new ApiResponse(200, "Password changed successfully", { user }));
});

const requestVerifyPhoneNumber = dbHandler(
  async (req: RequestWithUser, res) => {
    try {
      const { phoneNumber } = req.body;

      if (!phoneNumber) throw new ApiError(400, "Phone number is required");

      const otp = Math.floor(Math.random() * 900000 + 100000).toString();

      const message = await sendSms(phoneNumber, otp);

      if (!message) throw new ApiError(500, "Failed to send SMS");

      console.log("otp", otp);

      const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
          $set: { otp },
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const verifyPhoneNumber = dbHandler(async (req, res) => {});

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
};
