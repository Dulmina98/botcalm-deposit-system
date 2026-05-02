import { ErrorRequestHandler } from "express";
import { AppError } from "../types";
import logger from "../utils/logger";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const status = err instanceof AppError ? err.status : 500;
  const message = err instanceof AppError ? err.message : "Internal server error";

  logger.error("Request error", {
    message: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
  });

  res.status(status).json({
    success: false,
    message,
    status,
  });
};

export default errorHandler;
