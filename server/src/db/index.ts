import mongoose from "mongoose";

const { MONGO_URI } = process.env;

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(`${MONGO_URI}/mern-auth`);
    console.log("Mongodb connected", connection.connection.host);
  } catch (error) {
    console.log("Mongodb connection failed", error);
    process.exit(1);
  }
};
