import rateLimit from "express-rate-limit";

const downloadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 req every 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many downloads, please try again later.",
});

export { downloadLimiter };
