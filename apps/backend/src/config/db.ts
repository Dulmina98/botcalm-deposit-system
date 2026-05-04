import fs from "fs";
import path from "path";
import { Pool } from "pg";
import logger from "../utils/logger";
import { Transaction, Wallet } from "../types";

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 20,
});

pool.on("connect", () => {
  logger.debug("New client connected to PostgreSQL pool");
});

pool.on("error", (err) => {
  logger.error("Unexpected error on idle PostgreSQL client", { error: err.message });
});

export async function runMigrations(): Promise<void> {
  const sql = fs.readFileSync(
    path.join(__dirname, "../migrations/init.sql"),
    "utf-8"
  );
  await pool.query(sql);
  logger.info("Database migrations executed successfully");
}

export function toWallet(row: Record<string, unknown>): Wallet {
  return {
    id: row.id as number,
    address: row.address as string,
    created_at: row.created_at as Date,
  };
}

export function toTransaction(row: Record<string, unknown>): Transaction {
  return {
    id: row.id as number,
    wallet_address: row.wallet_address as string,
    transaction_hash: row.transaction_hash as string,
    amount: parseFloat(row.amount as string),
    status: row.status as Transaction["status"],
    retry_count: row.retry_count as number,
    error_message: row.error_message as string | undefined,
    created_at: row.created_at as Date,
    updated_at: row.updated_at as Date,
  };
}
