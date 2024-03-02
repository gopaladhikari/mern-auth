import { Response, NextFunction } from "express";
import jwt, {
  JwtPayload,
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from "jsonwebtoken";
import { RequestWithUser } from "../models/models";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { dbHandler } from "../utils/dbHandler";
import { env } from "../conf/env";

export const verifyJWT = dbHandler(
  async (req: RequestWithUser, _: Response, next: NextFunction) => {
    const incomingAccessToken = req.headers.authorization?.replace(
      "Bearer ",
      ""
    );

    try {
      if (!incomingAccessToken) throw new ApiError(401, "Unauthorized request");

      const decoded = jwt.verify(
        incomingAccessToken,
        env.accessTokenSecret
      ) as JwtPayload;

      const user = await User.findById(decoded._id).select(
        "-password -refreshToken"
      );

      if (!user) throw new ApiError(400, "User not found");

      req.user = user;
      next();
    } catch (error) {
      if (error instanceof TokenExpiredError)
        throw new ApiError(401, "Token has expired");
      else if (error instanceof NotBeforeError)
        throw new ApiError(401, "Token not yet valid");
      else if (error instanceof JsonWebTokenError)
        throw new ApiError(401, "Malformed token");
      else throw new ApiError(500, "Internal Server Error");
    }
  }
);
