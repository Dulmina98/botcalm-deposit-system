import { useState } from 'react';
import type { AxiosError } from 'axios';
import { createWallet } from '../../api';
import { useToast } from '../../context/ToastContext';
import Button from '../ui/Button';
import type { Wallet } from '../../types';

interface WalletFormProps {
  onWalletAdded: (wallet: Wallet) => void;
}

export default function WalletForm({ onWalletAdded }: WalletFormProps) {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmed = address.trim();
    if (!trimmed) return;

    setLoading(true);
    try {
      const wallet = await createWallet(trimmed);
      onWalletAdded(wallet);
      setAddress('');
      addToast('success', 'Wallet added successfully');
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      const message =
        axiosErr.response?.data?.message ??
        axiosErr.message ??
        'Failed to add wallet';
      addToast('error', message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#94a3b8] mb-2">
        Wallet Address
      </div>

      <div className="flex items-center gap-[10px]">
        <input
          id="wallet-address-input"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="0x..."
          disabled={loading}
          className={[
            'flex-1 bg-[#0f1f35] border border-[rgba(20,184,166,0.15)] rounded-[10px]',
            'px-[14px] py-[10px] text-white text-[13px] font-mono',
            'placeholder:text-[#64748b] outline-none',
            'transition-all duration-150',
            'focus:border-[#14b8a6] focus:shadow-[0_0_0_3px_rgba(20,184,166,0.15)]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          ].join(' ')}
        />

        <Button
          type="submit"
          variant="primary"
          disabled={loading || address.trim() === ''}
          loading={loading}
          className="whitespace-nowrap"
        >
          + Add Wallet
        </Button>
      </div>
    </form>
  );
}
