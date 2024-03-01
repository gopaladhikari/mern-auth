import mongoose from "mongoose";
import { env } from "../conf/env";

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(`${env.mongoUri}/mern-auth`);
    console.log("Mongodb connected", connection.connection.host);
  } catch (error) {
    console.log("Mongodb connection failed", error);
    process.exit(1);
  }
};
