import { RequestHandler, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError, AuthRequest, JwtPayload } from "../types";
import logger from "../utils/logger";

const authenticate: RequestHandler = (req, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("No token provided", 401));
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    (req as AuthRequest).user = decoded;
    next();
  } catch (err) {
    logger.error("JWT verification failed", { error: (err as Error).message });
    next(new AppError("Invalid or expired token", 401));
  }
};

export default authenticate;
