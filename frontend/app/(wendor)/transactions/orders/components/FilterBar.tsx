'use client';

import { OrderFilterOptions, OrderQuery } from '@/types/order';

interface Props {
  query: OrderQuery;
  options: OrderFilterOptions | null;
  onChange: (patch: Partial<OrderQuery>) => void;
  onReset: () => void;
}

export function FilterBar({ query, options, onChange, onReset }: Props) {
  const selectClass =
    'rounded-console border border-line bg-ink px-3 py-2 text-sm text-slate-200 focus:border-accent focus:outline-none';

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-console border border-line bg-panel p-3">
      <input
        type="text"
        placeholder="Search Bill ID or Machine..."
        value={query.search ?? ''}
        onChange={(e) => onChange({ search: e.target.value, page: 1 })}
        className="min-w-[220px] flex-1 rounded-console border border-line bg-ink px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:border-accent focus:outline-none"
      />

      <select
        value={query.status ?? ''}
        onChange={(e) => onChange({ status: e.target.value, page: 1 })}
        className={selectClass}
      >
        <option value="">All statuses</option>
        {options?.statuses.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        value={query.paymentMode ?? ''}
        onChange={(e) => onChange({ paymentMode: e.target.value, page: 1 })}
        className={selectClass}
      >
        <option value="">All payment modes</option>
        {options?.paymentModes.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      <select
        value={query.cluster ?? ''}
        onChange={(e) => onChange({ cluster: e.target.value, page: 1 })}
        className={selectClass}
      >
        <option value="">All clusters</option>
        {options?.clusters.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        value={query.machine ?? ''}
        onChange={(e) => onChange({ machine: e.target.value, page: 1 })}
        className={selectClass}
      >
        <option value="">All machines</option>
        {options?.machines.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      <button
        onClick={onReset}
        className="rounded-console border border-line px-3 py-2 text-sm text-slate-400 transition-colors hover:border-accent hover:text-accent"
      >
        Reset
      </button>
    </div>
  );
}
