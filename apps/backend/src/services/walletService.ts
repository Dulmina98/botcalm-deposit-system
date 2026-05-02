import { pool, toWallet } from "../config/db";
import { AppError, Wallet } from "../types";
import logger from "../utils/logger";

export async function createWallet(address: string): Promise<Wallet> {
  try {
    const result = await pool.query(
      "INSERT INTO wallets (address) VALUES ($1) RETURNING *",
      [address]
    );
    const wallet = toWallet(result.rows[0]);
    logger.info("Wallet created", { address: wallet.address });
    return wallet;
  } catch (err: any) {
    if (err.code === "23505") {
      throw new AppError("Wallet address already exists", 409);
    }
    throw err;
  }
}

export async function getAllWallets(): Promise<Wallet[]> {
  const result = await pool.query(
    "SELECT * FROM wallets ORDER BY created_at DESC"
  );
  return result.rows.map(toWallet);
}
