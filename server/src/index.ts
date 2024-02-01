import { app } from "./app";
import { connectDB } from "./db";
import { config } from "dotenv";

config();

const port = process.env.PORT || 8000;

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
});
