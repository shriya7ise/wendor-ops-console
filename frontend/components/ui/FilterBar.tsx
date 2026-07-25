'use client';
export function FilterBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">{children}</div>
    </div>
  );
}
export function DateField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.06em] text-neutral-500">{label}</label>
      <input
        type="date"
        className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 font-mono text-sm text-neutral-800 outline-none transition-colors focus:border-amber-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
export function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div>
      <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.06em] text-neutral-500">{label}</label>
      <select
        className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 font-body text-sm text-neutral-800 outline-none transition-colors focus:border-amber-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
