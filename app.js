import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import globalErrorHandler from "./core-utility/globalErrorHandler.js";
import userRouter from "./routes/userRoutes.js";

const app = express();

app.use(helmet());

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));

app.use("/api/v1/users", userRouter);

app.use("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Path not found ${req.originalUrl}`,
  });
});

app.use(globalErrorHandler);

export default app;
