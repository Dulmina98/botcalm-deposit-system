import Button from '../ui/Button';

interface TransactionFiltersProps {
  statusFilter: string;
  walletFilter: string;
  onStatusChange: (value: string) => void;
  onWalletChange: (value: string) => void;
  onClear: () => void;
  totalResults: number;
}

const filterInputClass = [
  'bg-[#0f1f35] border border-[rgba(20,184,166,0.12)] rounded-[8px]',
  'px-[10px] py-[6px] text-[#94a3b8] text-[12px] outline-none appearance-none',
  'transition-colors duration-150',
  'focus:border-[#14b8a6]',
].join(' ');

export default function TransactionFilters({
  statusFilter,
  walletFilter,
  onStatusChange,
  onWalletChange,
  onClear,
  totalResults,
}: TransactionFiltersProps) {
  const hasFilters = statusFilter !== '' || walletFilter !== '';

  return (
    <div
      className="flex items-center gap-[10px] flex-wrap"
      style={{
        padding: '14px 18px',
        borderBottom: '1px solid rgba(20,184,166,0.06)',
      }}
    >
      <div className="flex-1 flex items-center gap-[10px] flex-wrap">
        <span className="text-[#64748b] text-[12px] leading-none select-none">
          ⊟
        </span>

        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className={filterInputClass}
          style={{ width: '140px' }}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processed">Processed</option>
          <option value="failed">Failed</option>
        </select>

        <input
          type="text"
          value={walletFilter}
          onChange={(e) => onWalletChange(e.target.value)}
          placeholder="Filter by wallet..."
          className={[filterInputClass, 'font-mono text-[11px] min-w-[140px]'].join(' ')}
          style={{ flex: 1 }}
        />

        {hasFilters && (
          <Button
            variant="ghost"
            onClick={onClear}
            className="!px-[10px] !py-[5px] !text-[11px]"
          >
            ✕ Clear
          </Button>
        )}
      </div>

      <span className="font-mono text-[11px] text-[#64748b] whitespace-nowrap">
        {totalResults} result{totalResults !== 1 ? 's' : ''}
      </span>
    </div>
  );
}
