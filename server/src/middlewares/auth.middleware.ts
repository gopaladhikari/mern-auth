import { Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { dbHandler } from "../utils/dbHandler";
import { ApiError } from "../utils/ApiError";
import { User } from "../models/user.model";
import { IUser } from "../models/models";

const { ACCESS_TOKEN_SECRET } = process.env;

interface CustomRequest extends Request {
  user?: IUser;
}

export const verifyJWT = dbHandler(async (req: CustomRequest, res, next) => {
  const incomingAccessToken = req.cookies.accessToken;

  if (!incomingAccessToken) throw new ApiError(400, "Unauthorized request");

  const decoded = jwt.verify(
    incomingAccessToken,
    ACCESS_TOKEN_SECRET!
  ) as JwtPayload;

  const user = await User.findById(decoded._id).select(
    "-password -refreshToken"
  );

  if (!user) throw new ApiError(400, "User not found");

  req.user = user;
  next();
});
