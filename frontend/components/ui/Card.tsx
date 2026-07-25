export function Card({ title, subtitle, action, children }: { title?: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-card">
      {(title || action) && (
        <div className="mb-4 flex items-start justify-between">
          <div>
            {title && <h3 className="font-display text-[13px] font-semibold tracking-tight text-neutral-900">{title}</h3>}
            {subtitle && <p className="mt-0.5 font-mono text-[11px] text-neutral-400">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
