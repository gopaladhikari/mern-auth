import { CookieOptions } from "express";
import { RequestWithUser } from "../models/models";
import { User } from "../models/user.model";
import { registerSchemas } from "../schemas/registerSchema";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { dbHandler } from "../utils/dbHandler";
import { sendEmail } from "../utils/emailSender";

const options: CookieOptions = {
	httpOnly: true,
	secure: true,
	domain: process.env.FRONTEND_DOMAIN,
	sameSite: "none",
};

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

	const validatedUserDetails = registerSchemas.safeParse(userDetails);

	if (!validatedUserDetails.success)
		throw new ApiError(400, "Invalid user credentials");

	const existedUser = await User.findOne({ email: userDetails.email });

	if (existedUser) throw new ApiError(400, "User already exists");

	const createdUser = await User.create({ ...userDetails, avatar: avatar.url });

	const user = await User.findById(createdUser._id).select("-password");

	if (!user) throw new ApiError(400, "User not found");
	await sendEmail(user.email, "verify", user._id);

	return res
		.status(201)
		.json(new ApiResponse(201, "User created successfully", { user }));
});

const loginUser = dbHandler(async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) throw new ApiError(400, "Invalid credentials");

	const user = await User.findOne({ email });

	if (!user) throw new ApiError(400, "User not found");

	const isMatch = await user.comparePassword(password);

	if (!isMatch) throw new ApiError(400, "Invalid credentials");

	const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
		user._id
	);
	return res
		.status(200)
		.cookie("refreshToken", refreshToken, {
			...options,
			maxAge: 1000 * 60 * 60 * 24,
		})
		.cookie("accessToken", accessToken, {
			...options,
			maxAge: 1000 * 60 * 60 * 24 * 30,
		})
		.json(
			new ApiResponse(200, "User logged in successfully", {
				user,
				accessToken,
				refreshToken,
			})
		);
});

const logoutUser = dbHandler(async (req, res) => {
	res
		.clearCookie("refreshToken")
		.clearCookie("accessToken")
		.json(new ApiResponse(200, "User logged out successfully"));
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
				emailVerificationTokenExpiry: {
					$gt: Date.now(),
				},
			},
			{
				$set: { isVerified: true },
				$unset: {
					emailVerificationToken: 1,
					emailVerificationTokenExpiry: 1,
				},
			},
			{
				new: true,
			}
		);

		console.log("user", user);

		if (!user) throw new ApiError(400, "Invalid token");

		return res.status(200).json(
			new ApiResponse(200, "Email verified successfully", {
				user,
			})
		);
	} catch (error) {
		console.error(error); // Log the error for debugging purposes
		res.status(500).json(new ApiResponse(500, "Failed to verify email"));
	}
});

export { registerUser, loginUser, getCurrentUser, logoutUser, verifyEmail };
