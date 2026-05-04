import Button from '../ui/Button';

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, total, onPageChange }: PaginationProps) {
  return (
    <div
      className="flex items-center justify-between"
      style={{
        padding: '14px 18px',
        borderTop: '1px solid rgba(20,184,166,0.06)',
      }}
    >
      <span className="font-mono text-[#64748b]" style={{ fontSize: '11px' }}>
        {total} result{total !== 1 ? 's' : ''} · Page {page} of {totalPages || 1}
      </span>

      <div className="flex items-center gap-6">
        <Button
          variant="ghost"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="!px-[10px] !py-[5px] !text-[12px] !rounded-[8px]"
        >
          ← Prev
        </Button>
        <Button
          variant="ghost"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="!px-[10px] !py-[5px] !text-[12px] !rounded-[8px]"
        >
          Next →
        </Button>
      </div>
    </div>
  );
}
