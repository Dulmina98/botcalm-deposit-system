import { useEffect, useState } from 'react';
import type { PaginatedTransactions, Transaction, Wallet } from '../../types';
import { getTransactions } from '../../api';
import Card from '../ui/Card';
import DepositForm from './DepositForm';
import TransactionFilters from './TransactionFilters';
import TransactionTable from './TransactionTable';
import Pagination from './Pagination';

interface TransactionSectionProps {
  wallets: Wallet[];
  latestUpdate: Transaction | null;
}

export default function TransactionSection({ wallets, latestUpdate }: TransactionSectionProps) {
  const [data, setData] = useState<PaginatedTransactions | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [walletFilter, setWalletFilter] = useState('');
  const [flashedIds, setFlashedIds] = useState<Set<number>>(new Set());

  async function fetchTransactions() {
    setLoading(true);
    try {
      const result = await getTransactions({
        page,
        limit: 15,
        status: statusFilter || undefined,
        walletAddress: walletFilter || undefined,
      });
      setData(result);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, [page, statusFilter]);

  useEffect(() => {
    if (!latestUpdate) return;

    setFlashedIds((prev) => new Set(prev).add(latestUpdate.id));
    const timer = setTimeout(() => {
      setFlashedIds((prev) => {
        const next = new Set(prev);
        next.delete(latestUpdate.id);
        return next;
      });
    }, 2000);

    fetchTransactions();

    return () => clearTimeout(timer);
  }, [latestUpdate]);

  function handleStatusChange(value: string) {
    setStatusFilter(value);
    setPage(1);
  }

  function handleWalletChange(value: string) {
    setWalletFilter(value);
    setPage(1);
  }

  function handleClear() {
    setStatusFilter('');
    setWalletFilter('');
    setPage(1);
  }

  return (
    <Card className="h-full">
      <div
        className="flex items-center justify-between"
        style={{
          padding: '18px 22px',
          borderBottom: '1px solid rgba(20,184,166,0.08)',
        }}
      >
        <span className="text-white text-[14px] font-semibold">Transactions</span>

        <div className="flex items-center gap-[10px]">
          <span
            className="font-mono text-[11px] text-[#2dd4bf]"
            style={{
              background: 'rgba(20,184,166,0.1)',
              border: '1px solid rgba(20,184,166,0.15)',
              borderRadius: '10px',
              padding: '2px 10px',
            }}
          >
            {data?.total ?? 0}
          </span>

          {latestUpdate && (
            <span
              className="font-mono text-[#22c55e] animate-pulse"
              style={{ fontSize: '11px' }}
            >
              ⚡ Live
            </span>
          )}
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        <DepositForm wallets={wallets} />
      </div>

      <TransactionFilters
        statusFilter={statusFilter}
        walletFilter={walletFilter}
        onStatusChange={handleStatusChange}
        onWalletChange={handleWalletChange}
        onClear={handleClear}
        totalResults={data?.total ?? 0}
      />

      <TransactionTable
        transactions={data?.transactions ?? []}
        loading={loading}
        flashedIds={flashedIds}
      />

      <Pagination
        page={page}
        totalPages={data?.totalPages ?? 1}
        total={data?.total ?? 0}
        onPageChange={setPage}
      />
    </Card>
  );
}
