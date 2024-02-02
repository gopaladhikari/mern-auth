import { User } from "../models/user.model";
import { registerSchemas } from "../schemas/registerSchema";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { dbHandler } from "../utils/dbHandler";

const options = {
  httpOnly: true,
  secure: true,
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
  const validatedUserDetails = registerSchemas.safeParse(userDetails);

  if (!validatedUserDetails.success)
    throw new ApiError(400, "Invalid user credentials");

  const existedUser = await User.findOne({ email: userDetails.email });

  if (existedUser) throw new ApiError(400, "User already exists");
  const createdUser = await User.create(userDetails);
  const user = await User.findById(createdUser._id);

  if (!user) throw new ApiError(400, "User not found");
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
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(200, "User logged in successfully", {
        user,
        accessToken,
        refreshToken,
      })
    );
});

export { registerUser, loginUser };
