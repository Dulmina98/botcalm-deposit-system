import { Router, Request, Response, NextFunction } from "express";
import authenticate from "../middleware/auth";
import { createWallet, getAllWallets } from "../services/walletService";
import { AppError, CreateWalletBody } from "../types";

const router = Router();

router.get("/", authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const wallets = await getAllWallets();
    res.json({ success: true, wallets });
  } catch (err) {
    next(err);
  }
});

router.post("/", authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { address } = req.body as CreateWalletBody;

    if (!address || typeof address !== "string" || address.trim() === "") {
      throw new AppError("Wallet address is required", 400);
    }

    const wallet = await createWallet(address.trim());
    res.status(201).json({ success: true, wallet });
  } catch (err) {
    next(err);
  }
});

export default router;
