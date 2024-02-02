import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_SECRET_KEY } =
  process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_SECRET_KEY,
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
