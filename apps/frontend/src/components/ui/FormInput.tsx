interface FormInputProps {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  monospace?: boolean;
}

export default function FormInput({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  disabled,
  className,
  monospace,
}: FormInputProps) {
  return (
    <div className={`flex flex-col ${className ?? ''}`}>
      <label
        htmlFor={id}
        className="text-[11px] font-medium text-text-muted uppercase tracking-[0.06em] mb-[6px]"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={[
          'w-full bg-surface2 rounded-[10px] px-[14px] py-[11px] text-white outline-none',
          'transition-all duration-150',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          monospace ? 'font-mono text-[13px]' : 'text-sm',
          error
            ? 'border border-status-red shadow-[0_0_0_3px_rgba(239,68,68,0.1)] focus:border-status-red focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]'
            : 'border border-border focus:border-accent focus:shadow-[0_0_0_3px_rgba(20,184,166,0.15)]',
        ].join(' ')}
      />
      {error && (
        <span className="text-[12px] text-status-red mt-1">{error}</span>
      )}
    </div>
  );
}
