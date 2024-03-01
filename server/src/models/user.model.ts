import { Schema, Model, model } from "mongoose";
import { IUser } from "./models";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { env } from "../conf/env";

const {
  accessTokenSecret,
  accessTokenExpiry,
  refreshTokenSecret,
  refreshTokenExpiry,
} = env;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
      lowercase: true,
      unique: true,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    isPhoneNumberVerified: {
      type: Boolean,
      default: false,
    },

    otp: {
      type: String,
    },

    otpSent: {
      type: Boolean,
      default: false,
    },

    avatar: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    emailVerificationToken: {
      type: String,
    },

    refreshToken: {
      type: String,
    },
    emailVerificationTokenExpiry: {
      type: Date,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordTokenExpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password"))
    this.password = await bcrypt.hash(this.password, 10);

  next();
});

userSchema.methods.generateAccessToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
    },
    accessTokenSecret,
    { expiresIn: accessTokenExpiry }
  );
  return token;
};

userSchema.methods.generateRefreshToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
    },
    refreshTokenSecret,
    {
      expiresIn: refreshTokenExpiry,
    }
  );

  return token;
};

userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

export const User: Model<IUser> = model<IUser>("User", userSchema);
