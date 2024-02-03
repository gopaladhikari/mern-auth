import { config } from "dotenv";
import { app } from "./app.js";
import { connectDB } from "./db/index.js";

config();

const port = process.env.PORT || 8000;

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
});
