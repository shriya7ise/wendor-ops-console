export function StatCard({
  label,
  value,
  deltaLabel,
  deltaTone,
}: {
  label: string;
  value: string | number;
  deltaLabel?: string;
  deltaTone?: 'up' | 'down' | 'flat';
}) {
  const toneClass =
    deltaTone === 'up' ? 'text-emerald-600' : deltaTone === 'down' ? 'text-red-600' : 'text-neutral-400';
  const dotClass =
    deltaTone === 'up' ? 'bg-emerald-500' : deltaTone === 'down' ? 'bg-red-500' : 'bg-neutral-300';
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-neutral-400">{label}</p>
      <p className="mt-1.5 font-mono text-2xl font-medium tabular-nums text-neutral-900">{value}</p>
      {deltaLabel && (
        <p className={`mt-1.5 flex items-center gap-1.5 font-mono text-[11px] font-medium ${toneClass}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
          {deltaLabel}
        </p>
      )}
    </div>
  );
}
