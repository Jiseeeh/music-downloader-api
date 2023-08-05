import { Request, Response, NextFunction } from "express";

import { HttpException } from "@exceptions/httpException";
import logger from "@logger";

export const ErrorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const status = error.status || 500;
    const message = error.message || "Something went wrong!";

    logger.error(
      `[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`
    );

    res.status(status).json({ message });
  } catch (error) {
    next(error);
  }
};
