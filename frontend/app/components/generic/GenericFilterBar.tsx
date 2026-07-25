'use client';

import { FieldDef, GenericFilterOptions, GenericQuery } from './types';

interface Props {
  query: GenericQuery;
  options: GenericFilterOptions | null;
  fields: FieldDef[];
  hasStatus?: boolean;
  searchPlaceholder?: string;
  onChange: (patch: Partial<GenericQuery>) => void;
  onReset: () => void;
}

function filterOptionsKey(fieldKey: string) {
  // e.g. "stockLocation" -> "stockLocations"
  return `${fieldKey}s`;
}

export function GenericFilterBar({
  query,
  options,
  fields,
  hasStatus,
  searchPlaceholder,
  onChange,
  onReset,
}: Props) {
  const selectClass =
    'rounded-console border border-line bg-ink px-3 py-2 text-sm text-slate-200 focus:border-accent focus:outline-none';

  const filterFields = fields.filter((f) => f.filter);

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-console border border-line bg-panel p-3">
      <div className="relative min-w-[220px] flex-1">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-accent">
          ›
        </span>
        <input
          type="text"
          placeholder={searchPlaceholder ?? 'Search...'}
          value={query.search ?? ''}
          onChange={(e) => onChange({ search: e.target.value, page: 1 })}
          className="w-full rounded-console border border-line bg-ink py-2 pl-7 pr-3 text-sm text-slate-200 placeholder:text-slate-500 focus:border-accent focus:outline-none"
        />
      </div>

      {filterFields.map((f) => {
        const optKey = filterOptionsKey(f.key);
        const values = options?.[optKey] ?? [];
        return (
          <select
            key={f.key}
            value={(query[f.key] as string) ?? ''}
            onChange={(e) => onChange({ [f.key]: e.target.value, page: 1 })}
            className={selectClass}
          >
            <option value="">All {f.label.toLowerCase()}</option>
            {values.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        );
      })}

      {hasStatus && (
        <select
          value={query.status ?? ''}
          onChange={(e) => onChange({ status: e.target.value, page: 1 })}
          className={selectClass}
        >
          <option value="">All statuses</option>
          {options?.statuses?.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      )}

      <button
        onClick={onReset}
        className="rounded-console border border-line px-3 py-2 text-sm text-slate-400 transition-colors hover:border-accent hover:text-accent"
      >
        Reset
      </button>
    </div>
  );
}
