import http from "http";
import jwt from "jsonwebtoken";
import { Server as SocketIOServer } from "socket.io";
import { AppError, JwtPayload, Transaction } from "../types";
import logger from "../utils/logger";

let io: SocketIOServer | null = null;

export function initSocket(server: http.Server): SocketIOServer {
  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.CLIENT_ORIGIN,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token as string | undefined;

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    logger.info("Socket client connected", { socketId: socket.id });

    socket.on("disconnect", () => {
      logger.info("Socket client disconnected", { socketId: socket.id });
    });
  });

  return io;
}

export function getIO(): SocketIOServer {
  if (!io) {
    throw new AppError("Socket.IO has not been initialized", 500);
  }
  return io;
}

export function emitTransactionUpdate(transaction: Transaction): void {
  getIO().emit("transaction_updated", transaction);
}
