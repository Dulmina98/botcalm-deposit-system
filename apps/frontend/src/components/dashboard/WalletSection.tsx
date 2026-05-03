import type { Wallet } from '../../types';
import Card from '../ui/Card';
import WalletForm from './WalletForm';
import WalletList from './WalletList';

interface WalletSectionProps {
  wallets: Wallet[];
  loading: boolean;
  onWalletAdded: (wallet: Wallet) => void;
}

export default function WalletSection({ wallets, loading, onWalletAdded }: WalletSectionProps) {
  return (
    <Card>
      <div
        className="flex items-center justify-between"
        style={{
          padding: '18px 22px',
          borderBottom: '1px solid rgba(20,184,166,0.08)',
        }}
      >
        <span className="text-white text-[14px] font-semibold">Wallets</span>

        <span
          className="font-mono text-[11px] text-[#2dd4bf]"
          style={{
            background: 'rgba(20,184,166,0.1)',
            border: '1px solid rgba(20,184,166,0.15)',
            borderRadius: '10px',
            padding: '2px 10px',
          }}
        >
          {wallets.length}
        </span>
      </div>

      <div style={{ padding: '16px' }}>
        <WalletForm onWalletAdded={onWalletAdded} />

        <div
          style={{
            margin: '16px 0',
            borderTop: '1px solid rgba(20,184,166,0.06)',
          }}
        />

        <WalletList wallets={wallets} loading={loading} />
      </div>
    </Card>
  );
}
