type Status = 'pending' | 'processed' | 'failed';

interface BadgeProps {
  status: Status;
}

const config: Record<Status, { classes: string; dotClass: string; label: string }> = {
  pending: {
    classes: 'bg-[rgba(234,179,8,0.15)] text-status-yellow border border-[rgba(234,179,8,0.25)]',
    dotClass: 'animate-pulse',
    label: 'Pending',
  },
  processed: {
    classes: 'bg-[rgba(34,197,94,0.15)] text-status-green border border-[rgba(34,197,94,0.25)]',
    dotClass: '',
    label: 'Processed',
  },
  failed: {
    classes: 'bg-[rgba(239,68,68,0.15)] text-status-red border border-[rgba(239,68,68,0.25)]',
    dotClass: '',
    label: 'Failed',
  },
};

export default function Badge({ status }: BadgeProps) {
  const { classes, dotClass, label } = config[status];

  return (
    <span
      className={`inline-flex items-center gap-[5px] px-[9px] py-[3px] rounded-full text-[11px] font-semibold tracking-[0.04em] uppercase font-mono ${classes}`}
    >
      <span className={`w-[5px] h-[5px] rounded-full bg-current inline-block ${dotClass}`} />
      {label}
    </span>
  );
}
