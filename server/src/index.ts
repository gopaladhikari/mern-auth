import { config } from "dotenv";
import { app } from "./app";
import { connectDB } from "./db";
import { env } from "./conf/env";

config();

const port = env.port;

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
});
