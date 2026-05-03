import type { ReactNode } from 'react';

type Variant = 'primary' | 'ghost' | 'danger';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  variant?: Variant;
  fullWidth?: boolean;
  className?: string;
}

const variantClasses: Record<Variant, string> = {
  primary: [
    'bg-accent text-white shadow-[0_1px_8px_rgba(20,184,166,0.35)] hover:bg-[#0d9488] active:translate-y-0',
  ].join(' '),
  ghost: [
    'bg-surface2 text-text-dim border border-border',
    'hover:bg-[rgba(20,184,166,0.08)] hover:border-border-strong hover:text-white',
  ].join(' '),
  danger: [
    'bg-[rgba(239,68,68,0.12)] text-status-red border border-[rgba(239,68,68,0.2)]',
    'hover:bg-[rgba(239,68,68,0.22)]',
  ].join(' '),
};

export default function Button({
  children,
  onClick,
  type = 'button',
  disabled,
  loading,
  variant = 'primary',
  fullWidth,
  className,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center gap-2 px-[18px] py-[10px] text-[13px] font-semibold rounded-[10px] transition-all duration-150 outline-none',
        variantClasses[variant],
        fullWidth ? 'w-full' : '',
        isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer',
        className ?? '',
      ].join(' ')}
    >
      {loading && (
        <span className="w-[14px] h-[14px] rounded-full border-2 border-white/30 border-t-white inline-block animate-spin" />
      )}
      {children}
    </button>
  );
}
