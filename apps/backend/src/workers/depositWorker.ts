import Bull, { Job } from "bull";
import createRedisClient from "../config/redis";
import { triggerCallback } from "../services/callbackService";
import {
  getTransactionById,
  incrementRetryCount,
  updateTransactionStatus,
} from "../services/transactionService";
import { emitTransactionUpdate } from "../socket";
import { DepositJobPayload } from "../types";
import logger from "../utils/logger";

const depositQueue = new Bull<DepositJobPayload>("deposit-processing", {
  createClient: createRedisClient,
});

export async function addDepositJob(
  transactionId: number
): Promise<Job<DepositJobPayload>> {
  return depositQueue.add(
    { transactionId },
    {
      attempts: 3,
      backoff: { type: "exponential", delay: 2000 },
      removeOnComplete: true,
      removeOnFail: false,
    }
  );
}

depositQueue.process(async (job) => {
  const { transactionId } = job.data as DepositJobPayload;

  const transaction = await getTransactionById(transactionId);
  if (!transaction) {
    throw new Error(`Transaction ${transactionId} not found`);
  }

  await new Promise<void>((resolve) => setTimeout(resolve, 1000));

  try {
    await updateTransactionStatus(transactionId, "processed");

    const updatedTransaction = await getTransactionById(transactionId);
    if (updatedTransaction) {
      await triggerCallback(updatedTransaction);
      emitTransactionUpdate(updatedTransaction);
    }
  } catch (err) {
    await incrementRetryCount(transactionId);

    const refreshed = await getTransactionById(transactionId);
    if (refreshed && refreshed.retry_count >= 3) {
      await updateTransactionStatus(
        transactionId,
        "failed",
        (err as Error).message
      );
      const failed = await getTransactionById(transactionId);
      if (failed) emitTransactionUpdate(failed);
    }

    throw err;
  }
});

depositQueue.on("completed", (job) => {
  logger.info("Deposit job completed", { jobId: job.id, transactionId: job.data.transactionId });
});

depositQueue.on("failed", (job, err) => {
  logger.error("Deposit job failed", {
    jobId: job.id,
    transactionId: job.data.transactionId,
    error: err.message,
    attemptsMade: job.attemptsMade,
  });
});

depositQueue.on("stalled", (job) => {
  logger.warn("Deposit job stalled", { jobId: job.id, transactionId: job.data.transactionId });
});

export default depositQueue;
