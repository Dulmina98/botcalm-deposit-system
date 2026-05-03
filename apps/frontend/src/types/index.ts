export type TransactionStatus = 'pending' | 'processed' | 'failed';

export interface Wallet {
  id: number;
  address: string;
  created_at: string;
}

export interface Transaction {
  id: number;
  wallet_address: string;
  transaction_hash: string;
  amount: number;
  status: TransactionStatus;
  retry_count: number;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedTransactions {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuthContextType {
  token: string | null;
  username: string | null;
  isAuthenticated: boolean;
  login: (token: string, username: string) => void;
  logout: () => void;
}

export interface DepositFormData {
  walletAddress: string;
  transactionHash: string;
  amount: string;
}

export interface TransactionFilters {
  page?: number;
  limit?: number;
  status?: TransactionStatus;
  walletAddress?: string;
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

export interface ToastContextType {
  addToast: (type: ToastType, message: string) => void;
}
