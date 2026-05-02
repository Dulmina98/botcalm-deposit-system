import { Request } from "express";

export type TransactionStatus = "pending" | "processed" | "failed";

export interface User {
    id: number;
    username: string;
    password_hash: string;
    created_at: Date;
}

export interface Wallet {
    id: number;
    address: string;
    created_at: Date;
}

export interface Transaction {
    id: number;
    wallet_address: string;
    transaction_hash: string;
    amount: number;
    status: TransactionStatus;
    retry_count: number;
    error_message?: string;
    created_at: Date;
    updated_at: Date;
}

export interface CreateTransactionInput {
    walletAddress: string;
    transactionHash: string;
    amount: number;
}

export interface PaginatedTransactions {
    transactions: Transaction[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface TransactionFilters {
    page?: number;
    limit?: number;
    status?: TransactionStatus;
    walletAddress?: string;
}

export interface DepositJobPayload {
    transactionId: number;
}

export interface JwtPayload {
    id: number;
    username: string;
}

export interface AuthRequest extends Request {
    user?: JwtPayload;
}

export interface LoginBody {
    username: string;
    password: string;
}

export interface CreateWalletBody {
    address: string;
}

export interface CreateDepositBody {
    walletAddress: string;
    transactionHash: string;
    amount: number;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
}

export class AppError extends Error {
    status: number;
    field?: string;

    constructor(message: string, status: number, field?: string) {
        super(message);
        this.status = status;
        this.field = field;

        Object.setPrototypeOf(this, AppError.prototype);
    }
}