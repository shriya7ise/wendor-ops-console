export type PillTone = 'success' | 'warn' | 'danger' | 'neutral' | 'info';

// Square "LED" indicator + uppercase mono label, instead of a rounded
// pill badge — reads like an equipment status light rather than a
// generic SaaS chip.
const DOT_STYLES: Record<PillTone, string> = {
  success: 'bg-success shadow-[0_0_6px_theme(colors.success)]',
  warn: 'bg-warn shadow-[0_0_6px_theme(colors.warn)]',
  danger: 'bg-danger shadow-[0_0_6px_theme(colors.danger)]',
  info: 'bg-accent shadow-[0_0_6px_theme(colors.accent)]',
  neutral: 'bg-slate-500',
};

const TEXT_STYLES: Record<PillTone, string> = {
  success: 'text-success',
  warn: 'text-warn',
  danger: 'text-danger',
  info: 'text-accent',
  neutral: 'text-slate-400',
};

export function StatusPill({ label, tone }: { label: string; tone: PillTone }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-sm ${DOT_STYLES[tone]}`} />
      <span className={`console-label text-[11px] font-medium ${TEXT_STYLES[tone]}`}>
        {label}
      </span>
    </span>
  );
}
