import { Transaction } from "../types";
import logger from "../utils/logger";

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function triggerCallback(
  transaction: Transaction,
  attempt: number = 0
): Promise<void> {
  const maxRetries = Number(process.env.CALLBACK_MAX_RETRIES ?? 3);

  logger.info("Triggering callback", {
    wallet_address: transaction.wallet_address,
    amount: transaction.amount,
    transaction_hash: transaction.transaction_hash,
    status: transaction.status,
    attempt,
  });

  try {
    // Simulated callback no real HTTP call
    logger.info("Callback succeeded", {
      transaction_hash: transaction.transaction_hash,
      attempt,
    });
  } catch (err) {
    if (attempt < maxRetries) {
      const backoff = Math.pow(2, attempt) * 1000;
      logger.warn("Callback failed, retrying", {
        transaction_hash: transaction.transaction_hash,
        attempt,
        nextAttempt: attempt + 1,
        backoffMs: backoff,
        error: (err as Error).message,
      });
      await delay(backoff);
      return triggerCallback(transaction, attempt + 1);
    }

    logger.error("Callback failed after max retries", {
      transaction_hash: transaction.transaction_hash,
      maxRetries,
      error: (err as Error).message,
    });
  }
}
