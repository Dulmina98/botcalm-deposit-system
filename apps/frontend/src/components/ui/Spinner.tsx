interface SpinnerProps {
  size?: number;
  className?: string;
}

export default function Spinner({ size = 16, className }: SpinnerProps) {
  return (
    <div
      className={`rounded-full border-2 border-white/20 border-t-white animate-spin inline-block shrink-0 ${className ?? ''}`}
      style={{ width: size, height: size }}
    />
  );
}
