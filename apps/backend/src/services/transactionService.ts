import { pool, toTransaction } from "../config/db";
import {
  AppError,
  CreateTransactionInput,
  PaginatedTransactions,
  Transaction,
  TransactionFilters,
  TransactionStatus,
} from "../types";
import logger from "../utils/logger";

export async function createTransaction(
  input: CreateTransactionInput
): Promise<Transaction | null> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const walletResult = await client.query(
      "SELECT id FROM wallets WHERE address = $1",
      [input.walletAddress]
    );
    if (walletResult.rows.length === 0) {
      await client.query("ROLLBACK");
      throw new AppError("Wallet not found", 404);
    }

    const insertResult = await client.query(
      `INSERT INTO transactions (wallet_address, transaction_hash, amount)
       VALUES ($1, $2, $3)
       ON CONFLICT (transaction_hash) DO NOTHING
       RETURNING *`,
      [input.walletAddress, input.transactionHash, input.amount]
    );

    await client.query("COMMIT");

    if (insertResult.rows.length === 0) {
      logger.info("Duplicate transaction detected", {
        transactionHash: input.transactionHash,
      });
      return null;
    }

    const transaction = toTransaction(insertResult.rows[0]);
    logger.info("Transaction created", {
      id: transaction.id,
      transactionHash: transaction.transaction_hash,
    });
    return transaction;
  } finally {
    client.release();
  }
}

export async function updateTransactionStatus(
  id: number,
  status: TransactionStatus,
  errorMessage?: string
): Promise<void> {
  if (errorMessage !== undefined) {
    await pool.query(
      `UPDATE transactions
       SET status = $1, error_message = $2, updated_at = NOW()
       WHERE id = $3`,
      [status, errorMessage, id]
    );
  } else {
    await pool.query(
      `UPDATE transactions
       SET status = $1, updated_at = NOW()
       WHERE id = $2`,
      [status, id]
    );
  }
}

export async function incrementRetryCount(id: number): Promise<void> {
  await pool.query(
    `UPDATE transactions
     SET retry_count = retry_count + 1, updated_at = NOW()
     WHERE id = $1`,
    [id]
  );
}

export async function getAllTransactions(
  filters: TransactionFilters
): Promise<PaginatedTransactions> {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 20;
  const offset = (page - 1) * limit;

  const conditions: string[] = [];
  const params: unknown[] = [];

  if (filters.status) {
    params.push(filters.status);
    conditions.push(`status = $${params.length}`);
  }

  if (filters.walletAddress) {
    params.push(filters.walletAddress);
    conditions.push(`wallet_address = $${params.length}`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total FROM transactions ${where}`,
    params
  );
  const total: number = countResult.rows[0].total;

  const dataParams = [...params, limit, offset];
  const dataResult = await pool.query(
    `SELECT * FROM transactions ${where}
     ORDER BY created_at DESC
     LIMIT $${dataParams.length - 1} OFFSET $${dataParams.length}`,
    dataParams
  );

  return {
    transactions: dataResult.rows.map(toTransaction),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getTransactionById(
  id: number
): Promise<Transaction | undefined> {
  const result = await pool.query(
    "SELECT * FROM transactions WHERE id = $1",
    [id]
  );
  if (result.rows.length === 0) return undefined;
  return toTransaction(result.rows[0]);
}
