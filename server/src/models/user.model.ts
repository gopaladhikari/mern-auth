import { Model, model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUser } from "./models";

const {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
} = process.env;

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
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
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
    ACCESS_TOKEN_SECRET!,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );

  return token;
};

userSchema.methods.generateAccessToken = function () {};
userSchema.methods.generateRefreshToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
    },
    REFRESH_TOKEN_SECRET!,
    {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    }
  );

  return token;
};

userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

export const User: Model<IUser> = model<IUser>("User", userSchema);
