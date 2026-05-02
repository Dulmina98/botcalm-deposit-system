import { Router, Request, Response, NextFunction } from "express";
import authenticate from "../middleware/auth";
import { createTransaction, getAllTransactions } from "../services/transactionService";
import { addDepositJob } from "../workers/depositWorker";
import { AppError, CreateDepositBody, TransactionFilters, TransactionStatus } from "../types";

const router = Router();

const VALID_STATUSES: TransactionStatus[] = ["pending", "processed", "failed"];

router.post("/deposits", authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { walletAddress, transactionHash, amount } = req.body as CreateDepositBody;

    if (!walletAddress || typeof walletAddress !== "string" || walletAddress.trim() === "") {
      throw new AppError("walletAddress is required", 400);
    }
    if (!transactionHash || typeof transactionHash !== "string" || transactionHash.trim() === "") {
      throw new AppError("transactionHash is required", 400);
    }
    if (typeof amount !== "number" || amount <= 0) {
      throw new AppError("amount must be a positive number", 400);
    }

    const transaction = await createTransaction({
      walletAddress: walletAddress.trim(),
      transactionHash: transactionHash.trim(),
      amount,
    });

    if (transaction === null) {
      return res.status(200).json({ success: true, duplicate: true });
    }

    await addDepositJob(transaction.id);
    res.status(201).json({ success: true, transaction });
  } catch (err) {
    next(err);
  }
});

router.get("/transactions", authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 20;

    const filters: TransactionFilters = { page, limit };

    const rawStatus = req.query.status as string | undefined;
    if (rawStatus && VALID_STATUSES.includes(rawStatus as TransactionStatus)) {
      filters.status = rawStatus as TransactionStatus;
    }

    const rawWalletAddress = req.query.walletAddress as string | undefined;
    if (rawWalletAddress && rawWalletAddress.trim() !== "") {
      filters.walletAddress = rawWalletAddress.trim();
    }

    const result = await getAllTransactions(filters);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
});

router.post("/callback/mock", (req: Request, res: Response) => {
  res.json({ received: true, timestamp: new Date().toISOString() });
});

export default router;
