import type { Wallet } from '../../types';

interface WalletListProps {
  wallets: Wallet[];
  loading: boolean;
}

function formatAddress(address: string): string {
  if (address.length <= 16) return address;
  return `${address.slice(0, 10)}...${address.slice(-6)}`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function WalletList({ wallets, loading }: WalletListProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-[44px] rounded-[10px] animate-shimmer"
            style={{
              background:
                'linear-gradient(90deg, #0f1f35 25%, rgba(20,184,166,0.06) 50%, #0f1f35 75%)',
              backgroundSize: '200% 100%',
            }}
          />
        ))}
      </div>
    );
  }

  if (wallets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
        <div
          className="flex items-center justify-center w-12 h-12 rounded-full"
          style={{
            background: 'rgba(20,184,166,0.08)',
            border: '1px solid rgba(20,184,166,0.12)',
          }}
        >
          <span className="text-[#14b8a6] text-[20px] leading-none">◎</span>
        </div>

        <p
          className="mt-3 font-medium"
          style={{ color: '#94a3b8', fontSize: '14px' }}
        >
          No wallets registered
        </p>
        <p
          className="mt-1"
          style={{ color: '#64748b', fontSize: '12px' }}
        >
          Add a wallet address above to get started
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {wallets.map((wallet, index) => (
        <div
          key={wallet.id}
          className="animate-fade-in flex items-center justify-between px-[14px] py-[10px] rounded-[10px] transition-all duration-150 cursor-default"
          style={{
            background: 'rgba(20,184,166,0.04)',
            border: '1px solid rgba(20,184,166,0.08)',
            animationDelay: `${index * 0.05}s`,
            animationFillMode: 'both',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.background =
              'rgba(20,184,166,0.08)';
            (e.currentTarget as HTMLDivElement).style.borderColor =
              'rgba(20,184,166,0.15)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.background =
              'rgba(20,184,166,0.04)';
            (e.currentTarget as HTMLDivElement).style.borderColor =
              'rgba(20,184,166,0.08)';
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center w-7 h-7 rounded-full shrink-0"
              style={{ background: 'rgba(20,184,166,0.1)' }}
            >
              <span className="text-[#14b8a6] text-[12px] leading-none">◈</span>
            </div>
            <span
              className="font-mono text-[12px]"
              style={{ color: '#94a3b8' }}
            >
              {formatAddress(wallet.address)}
            </span>
          </div>

          <span
            className="text-[11px] shrink-0"
            style={{ color: '#64748b' }}
          >
            {formatDate(wallet.created_at)}
          </span>
        </div>
      ))}
    </div>
  );
}
