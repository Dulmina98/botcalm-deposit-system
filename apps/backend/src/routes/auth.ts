import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/db";
import { AppError, LoginBody } from "../types";
import logger from "../utils/logger";

const router = Router();

router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body as LoginBody;

    if (!username || !password) {
      throw new AppError("Username and password are required", 400);
    }

    const result = await pool.query(
      "SELECT id, username, password_hash FROM users WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      throw new AppError("Invalid credentials", 401);
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: (process.env.JWT_EXPIRES_IN || "24h") as any }
    );

    logger.info("User logged in successfully", { username: user.username });

    res.json({ token, username: user.username });
  } catch (err) {
    next(err);
  }
});

export default router;
