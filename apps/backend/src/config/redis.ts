import Redis from "ioredis";
import logger from "../utils/logger";

export default function createRedisClient(): Redis {
  const client = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });

  client.on("connect", () => {
    logger.debug("Redis client connected");
  });

  client.on("error", (err) => {
    logger.error("Redis client error", { error: err.message });
  });

  return client;
}
