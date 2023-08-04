import express from "express";
import dotenv from "dotenv";

import { PORT } from "@config";

const app = express();
dotenv.config();

app.listen(PORT, () => {
  console.log(`\nRunning at http://localhost:${PORT}`);
});
