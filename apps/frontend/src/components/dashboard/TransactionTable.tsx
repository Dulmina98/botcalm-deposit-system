import type { Transaction } from '../../types';
import Badge from '../ui/Badge';
import SkeletonRow from '../ui/SkeletonRow';

interface TransactionTableProps {
  transactions: Transaction[];
  loading: boolean;
  flashedIds: Set<number>;
}

function truncateHash(hash: string, start: number, end: number): string {
  if (hash.length <= start + end) return hash;
  return `${hash.slice(0, start)}...${hash.slice(-end)}`;
}

function relativeTime(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const TD = 'px-[14px] py-[11px] align-middle';

const HEADERS = ['HASH', 'WALLET', 'AMOUNT', 'STATUS', 'RETRIES', 'TIME'];

export default function TransactionTable({
  transactions,
  loading,
  flashedIds,
}: TransactionTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr
            style={{
              background: 'rgba(20,184,166,0.03)',
              borderBottom: '1px solid rgba(20,184,166,0.08)',
            }}
          >
            {HEADERS.map((h) => (
              <th
                key={h}
                className="px-[14px] py-[10px] text-left text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.06em] whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {/* Loading */}
          {loading && Array.from({ length: 5 }).map((_, i) => (
            <SkeletonRow key={i} cols={6} />
          ))}

          {!loading && transactions.length === 0 && (
            <tr>
              <td colSpan={6}>
                <div className="flex flex-col items-center justify-center text-center" style={{ padding: '48px 24px' }}>
                  <div
                    className="flex items-center justify-center mx-auto"
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      background: 'rgba(20,184,166,0.06)',
                      border: '1px solid rgba(20,184,166,0.1)',
                    }}
                  >
                    <span className="text-[#14b8a6] text-[24px] leading-none">◎</span>
                  </div>
                  <p className="font-medium" style={{ color: '#94a3b8', fontSize: '14px', marginTop: 16 }}>
                    No transactions found
                  </p>
                  <p style={{ color: '#64748b', fontSize: '12px', marginTop: 4 }}>
                    Try adjusting filters or submit a deposit
                  </p>
                </div>
              </td>
            </tr>
          )}

          {!loading && transactions.map((tx) => {
            const flashed = flashedIds.has(tx.id);
            return (
              <tr
                key={tx.id}
                className="transition-colors duration-150"
                style={{
                  borderBottom: '1px solid rgba(20,184,166,0.04)',
                  background: flashed ? 'rgba(234,179,8,0.08)' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (!flashed)
                    (e.currentTarget as HTMLTableRowElement).style.background =
                      'rgba(20,184,166,0.04)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLTableRowElement).style.background = flashed
                    ? 'rgba(234,179,8,0.08)'
                    : 'transparent';
                }}
              >
                <td className={TD} title={tx.transaction_hash}>
                  <span className="font-mono text-[12px] text-[#2dd4bf] cursor-default">
                    {truncateHash(tx.transaction_hash, 6, 4)}
                  </span>
                </td>

                <td className={TD}>
                  <span className="font-mono text-[11px] text-[#94a3b8]">
                    {truncateHash(tx.wallet_address, 6, 4)}
                  </span>
                </td>

                <td className={TD}>
                  <span className="font-mono text-[12px] text-white font-medium">
                    {tx.amount.toFixed(8)}
                  </span>
                </td>

                <td className={TD}>
                  <Badge status={tx.status} />
                </td>

                <td className={TD}>
                  <span
                    className="font-mono text-[12px]"
                    style={{ color: tx.retry_count > 0 ? '#eab308' : '#64748b' }}
                  >
                    {tx.retry_count}
                  </span>
                </td>

                <td className={TD}>
                  <span className="text-[11px] text-[#64748b] whitespace-nowrap">
                    {relativeTime(tx.created_at)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
