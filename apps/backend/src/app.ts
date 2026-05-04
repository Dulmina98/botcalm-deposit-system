import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import errorHandler from "./middleware/errorHandler";
import authRouter from "./routes/auth";
import walletsRouter from "./routes/wallets";
import transactionsRouter from "./routes/transactions";

const app = express();
const httpServer = http.createServer(app);

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

export { app, httpServer };
