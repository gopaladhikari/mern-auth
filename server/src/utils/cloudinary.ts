import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { env } from "../conf/env";

const { cloudinaryName, cloudinaryApi, cloudinarySecretKey } = env;

cloudinary.config({
  cloud_name: cloudinaryName,
  api_key: cloudinaryApi,
  api_secret: cloudinarySecretKey,
});

export const uploadOnCloudinary = async (localFilePath: string) => {
  if (!localFilePath) return null;

  // upload file in cloudinary

  try {
    if (fs.existsSync(localFilePath)) {
      const result = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto",
      });
      fs.unlinkSync(localFilePath);
      return result;
    }
  } catch (error) {
    fs.unlinkSync(localFilePath);
  }
};
