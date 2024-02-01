import { User } from "../models/user.model";
import { registerSchemas } from "../schemas/registerSchema";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { dbHandler } from "../utils/dbHandler";

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

export { registerUser };
