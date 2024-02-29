import { Request } from "express";
import { Document } from "mongoose";

interface IUser extends Document {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatar: string;
  refreshToken?: string;
  isEmailVerified?: boolean;
  phoneNumber: string;
  isPhoneNumberVerified?: boolean;
  otp: string;
  forgotPasswordToken?: string;
  forgotPasswordTokenExpiry?: Date;
  emailVerificationToken?: string;
  emailVerificationTokenExpiry?: Date;
  comparePassword: (password: string) => Promise<boolean>;
  generateAccessToken: () => string;
  generateRefreshToken: () => string;
}

interface RequestWithUser extends Request {
  user?: IUser;
}

export { IUser, RequestWithUser };
