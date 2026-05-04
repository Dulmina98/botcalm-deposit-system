interface SkeletonRowProps {
  cols: number;
}

export default function SkeletonRow({ cols }: SkeletonRowProps) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div
            className="h-[14px] rounded animate-shimmer"
            style={{
              background: 'linear-gradient(90deg, #0f1f35 25%, rgba(20,184,166,0.06) 50%, #0f1f35 75%)',
              backgroundSize: '200% 100%',
            }}
          />
        </td>
      ))}
    </tr>
  );
}
