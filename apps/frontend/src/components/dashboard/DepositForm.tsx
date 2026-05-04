import { useState } from 'react';
import type { AxiosError } from 'axios';
import type { DepositFormData, Wallet } from '../../types';
import { createDeposit } from '../../api';
import { useToast } from '../../context/ToastContext';
import Button from '../ui/Button';

interface DepositFormProps {
  wallets: Wallet[];
}

const EMPTY_FORM: DepositFormData = {
  walletAddress: '',
  transactionHash: '',
  amount: '',
};

function formatAddress(address: string): string {
  if (address.length <= 14) return address;
  return `${address.slice(0, 8)}...${address.slice(-6)}`;
}

const inputClass = [
  'w-full bg-[#0f1f35] border border-[rgba(20,184,166,0.15)] rounded-[10px]',
  'px-[14px] py-[10px] text-white text-[13px] font-mono',
  'placeholder:text-[#64748b] outline-none appearance-none',
  'transition-all duration-150',
  'focus:border-[#14b8a6] focus:shadow-[0_0_0_3px_rgba(20,184,166,0.15)]',
  'disabled:opacity-50 disabled:cursor-not-allowed',
].join(' ');

const labelClass = 'block text-[11px] font-medium uppercase tracking-[0.06em] text-[#94a3b8] mb-2';

export default function DepositForm({ wallets }: DepositFormProps) {
  const [form, setForm] = useState<DepositFormData>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { addToast } = useToast();

  const isComplete =
    form.walletAddress.trim() !== '' &&
    form.transactionHash.trim() !== '' &&
    form.amount.trim() !== '' &&
    parseFloat(form.amount) > 0;

  function handleChange(field: keyof DepositFormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isComplete) return;

    setLoading(true);
    try {
      const result = await createDeposit(form);

      if ('duplicate' in result && result.duplicate) {
        addToast('warning', 'Transaction already processed — duplicate ignored');
      } else {
        addToast('success', 'Deposit submitted successfully');
        setForm(EMPTY_FORM);
      }
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      const message =
        axiosErr.response?.data?.message ??
        axiosErr.message ??
        'Failed to submit deposit';
      addToast('error', message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <span className="text-[#2dd4bf] text-[13px] font-semibold">
          ⊕ New Deposit
        </span>
        <span
          className="text-[#64748b] text-[30px] leading-[10px] transition-transform duration-200"
          style={{ transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}
        >
          ▾
        </span>
      </div>

      {expanded && (
        <form
          onSubmit={handleSubmit}
          className="animate-slide-up mt-4"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            <div>
              <label className={labelClass}>Wallet Address</label>
              <select
                value={form.walletAddress}
                onChange={handleChange('walletAddress')}
                disabled={loading}
                className={inputClass}
              >
                <option value="" disabled>
                  Select wallet...
                </option>
                {wallets.map((wallet) => (
                  <option key={wallet.id} value={wallet.address}>
                    {formatAddress(wallet.address)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Transaction Hash</label>
              <input
                type="text"
                value={form.transactionHash}
                onChange={handleChange('transactionHash')}
                placeholder="0x..."
                disabled={loading}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Amount</label>
              <input
                type="number"
                min={0}
                step="any"
                value={form.amount}
                onChange={handleChange('amount')}
                placeholder="0.00000000"
                disabled={loading}
                className={inputClass}
              />
            </div>
          </div>

          <div className="mt-4">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={!isComplete || loading}
              loading={loading}
            >
              Submit Deposit
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
