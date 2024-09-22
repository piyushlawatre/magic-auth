import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {});
    console.log("DB connection successful!");
  } catch (err) {
    const errorDetails = {
      name: err.name,
      message: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString(),
    };
    console.error("Database connection error:", JSON.stringify(errorDetails));
    console.error("UNHANDLED REJECTION! Shutting Down...");
    process.exit(1);
  }
};

const startServer = () => {
  const port = process.env.PORT || 3000;
  const host = process.env.HOST || "127.0.0.1";

  app.listen(port, host, () => {
    console.log(`Server started at http://${host}:${port}`);
  });
};

(async () => {
  await connectToDatabase();
  startServer();
})();
