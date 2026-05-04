import { app, httpServer } from "./app";
import { runMigrations } from "./config/db";
import logger from "./utils/logger";

async function start(): Promise<void> {
  await runMigrations();
  logger.info("Database migrations completed");

  const PORT = process.env.PORT || "5000";
  httpServer.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

start();
