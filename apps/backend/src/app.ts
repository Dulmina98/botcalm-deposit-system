import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { initSocket } from "./socket";
import { runMigrations } from "./config/db";
import errorHandler from "./middleware/errorHandler";
import authRouter from "./routes/auth";
import walletsRouter from "./routes/wallets";
import transactionsRouter from "./routes/transactions";
import logger from "./utils/logger";

const app = express();
const httpServer = http.createServer(app);
initSocket(httpServer);

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/wallets", walletsRouter);
app.use("/api/v1", transactionsRouter);

app.use(errorHandler);

async function start(): Promise<void> {
  await runMigrations();
  logger.info("Database migrations completed");

  const PORT = process.env.PORT || "5000";
  httpServer.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

start();

export { app, httpServer };
