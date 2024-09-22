import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";

mongoose
  .connect(process.env.DATABASE_URL, {})
  .then(() => console.log("DB connection successfully!"))
  .catch((err) => {
    console.log(err.name, err.message);
    console.log("UNHANDLED REJECTION! Shutting Down....");
    process.exit(1);
  });

const port = process.env.PORT || 3000;
const host = "127.0.0.1";

app.listen(port, host, () => {
  console.log(`Server Started at http://${host}:${port}`);
});
