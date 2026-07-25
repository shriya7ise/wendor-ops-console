const TONES: Record<string, string> = {
  A: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  B: 'bg-sky-50 text-sky-700 border-sky-200',
  C: 'bg-amber-50 text-amber-800 border-amber-200',
  D: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-sky-50 text-sky-700 border-sky-200',
  warning: 'bg-amber-50 text-amber-800 border-amber-200',
  critical: 'bg-red-50 text-red-700 border-red-200',
  PENDING: 'bg-neutral-100 text-neutral-600 border-neutral-200',
  PROCESSING: 'bg-sky-50 text-sky-700 border-sky-200',
  COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  FAILED: 'bg-red-50 text-red-700 border-red-200',
  ON_TIME: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  LATE_CHECKIN: 'bg-amber-50 text-amber-800 border-amber-200',
  MISSED_CHECKOUT: 'bg-red-50 text-red-700 border-red-200',
  OVERTIME: 'bg-sky-50 text-sky-700 border-sky-200',
};

export function Badge({ tone, children }: { tone: string; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-medium ${TONES[tone] ?? TONES.info}`}>
      {children}
    </span>
  );
}
