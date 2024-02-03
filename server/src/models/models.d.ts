import { Request } from "express";
import { Document } from "mongoose";

interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatar: string;
  refreshToken?: string;
  comparePassword: (password: string) => Promise<boolean>;
  generateAccessToken: () => string;
  generateRefreshToken: () => string;
}

interface RequestWithUser extends Request {
  user?: IUser;
}

export { IUser, RequestWithUser };
