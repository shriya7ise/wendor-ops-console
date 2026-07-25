'use client';

import { StatusPill, PillTone } from '@/app/components/ui/StatusPill';
import { Pagination } from '@/app/components/ui/Pagination';
import { FieldDef, GenericListResponse } from './types';
import { formatValue } from './formatters';

interface Row {
  id: string;
  [key: string]: unknown;
}

interface Props<T extends Row> {
  response: GenericListResponse<T> | null;
  fields: FieldDef[];
  loading: boolean;
  idLabel?: string;
  statusTone?: Record<string, PillTone>;
  emptyLabel?: string;
  onSelect: (row: T) => void;
  onPageChange: (page: number) => void;
}

export function GenericTable<T extends Row>({
  response,
  fields,
  loading,
  idLabel = 'ID',
  statusTone,
  emptyLabel = 'No records match these filters.',
  onSelect,
  onPageChange,
}: Props<T>) {
  const headers = [idLabel, ...fields.map((f) => f.label), 'Actions'];

  return (
    <div className="overflow-hidden rounded-console border border-line bg-panel">
      <div className="scrollbar-thin overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="console-label border-b border-line text-[10px] text-slate-500">
              {headers.map((h) => (
                <th key={h} className="px-4 py-3 font-medium whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={headers.length} className="px-4 py-10 text-center text-slate-500">
                  Loading...
                </td>
              </tr>
            )}
            {!loading && response?.data.length === 0 && (
              <tr>
                <td colSpan={headers.length} className="px-4 py-10 text-center text-slate-500">
                  {emptyLabel}
                </td>
              </tr>
            )}
            {!loading &&
              response?.data.map((row) => (
                <tr key={row.id} className="border-b border-line/60 transition-colors hover:bg-ink/60">
                  <td className="px-4 py-3 font-mono text-xs text-slate-400">{row.id}</td>
                  {fields.map((f) => {
                    const value = row[f.key];
                    if (f.kind === 'status') {
                      const tone = statusTone?.[String(value)] ?? 'neutral';
                      return (
                        <td key={f.key} className="px-4 py-3">
                          <StatusPill label={String(value)} tone={tone} />
                        </td>
                      );
                    }
                    if (f.kind === 'signed') {
                      const n = Number(value);
                      return (
                        <td
                          key={f.key}
                          className={`px-4 py-3 font-mono ${n > 0 ? 'text-success' : n < 0 ? 'text-danger' : 'text-slate-300'}`}
                        >
                          {formatValue(f, value)}
                        </td>
                      );
                    }
                    return (
                      <td
                        key={f.key}
                        className={`px-4 py-3 text-slate-300 ${f.mono ? 'font-mono text-xs' : ''}`}
                      >
                        {formatValue(f, value)}
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onSelect(row)}
                      className="console-label rounded-sm border border-line px-2.5 py-1 text-[10px] text-accent transition-colors hover:border-accent"
                    >
                      Open →
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {response && <Pagination meta={response.meta} onPageChange={onPageChange} />}
    </div>
  );
}
