import axios from 'axios';
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { DepositFormData, PaginatedTransactions, Transaction, TransactionFilters, Wallet } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export async function login(username: string, password: string): Promise<{ token: string; username: string }> {
  const response = await api.post('/auth/login', { username, password });
  return response.data;
}

export async function getWallets(): Promise<Wallet[]> {
  const response = await api.get('/wallets');
  return response.data.wallets;
}

export async function createWallet(address: string): Promise<Wallet> {
  const response = await api.post('/wallets', { address });
  return response.data.wallet;
}

export async function getTransactions(filters?: TransactionFilters): Promise<PaginatedTransactions> {
  const response = await api.get('/transactions', { params: filters });
  return response.data;
}

export async function createDeposit(data: DepositFormData): Promise<Transaction | { duplicate: boolean }> {
  const response = await api.post('/deposits', {
    walletAddress: data.walletAddress,
    transactionHash: data.transactionHash,
    amount: parseFloat(data.amount),
  });
  return response.data;
}
