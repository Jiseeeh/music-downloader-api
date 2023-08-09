import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

import { PORT } from "@config";
import { ErrorMiddleware } from "src/middlewares/error.middleware";
import { downloadRouter } from "src/routes/download.route";
import { downloadLimiter } from "@limiters/download.limiter";

const app = express();
dotenv.config();

// middleware
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());

// routes
app.use("/api/download", downloadRouter);
// app.use("/api/download", downloadLimiter, downloadRouter);

// error handler
app.use(ErrorMiddleware);

app.listen(PORT, () => {
  console.log(`\nRunning at http://localhost:${PORT}`);
});
