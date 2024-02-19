import { config } from "dotenv";
import { app } from "./app";
import { connectDB } from "./db";

config();

const port = process.env.PORT || 8000;

connectDB().then(() => {
	app.listen(port, () => {
		console.log(`Server started on port ${port}`);
	});
});
