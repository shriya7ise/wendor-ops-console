'use client';

import { StockLocation, StockLocationListResponse, StockLocationType } from '@/types/stock-location';
import { StatusPill } from '@/app/components/ui/StatusPill';
import { Pagination } from '@/app/components/ui/Pagination';

interface Props {
  response: StockLocationListResponse | null;
  loading: boolean;
  onSelect: (location: StockLocation) => void;
  onPageChange: (page: number) => void;
}

const HEADERS = ['Location Name', 'Type', 'Address', 'Phone', 'Manager', 'Actions'];

const TONE: Record<StockLocationType, 'info' | 'neutral' | 'warn'> = {
  Warehouse: 'info',
  Vehicle: 'neutral',
  Machine: 'warn',
};

export function StockLocationsTable({ response, loading, onSelect, onPageChange }: Props) {
  return (
    <div className="overflow-hidden rounded-console border border-line bg-panel">
      <div className="scrollbar-thin overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-wide text-slate-400">
              {HEADERS.map((h) => (
                <th key={h} className="px-4 py-3 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={HEADERS.length} className="px-4 py-10 text-center text-slate-500">
                  Loading stock locations...
                </td>
              </tr>
            )}
            {!loading && response?.data.length === 0 && (
              <tr>
                <td colSpan={HEADERS.length} className="px-4 py-10 text-center text-slate-500">
                  No locations match these filters.
                </td>
              </tr>
            )}
            {!loading &&
              response?.data.map((l) => (
                <tr key={l.id} className="border-b border-line/60 transition-colors hover:bg-ink/60">
                  <td className="px-4 py-3 text-slate-100">{l.name}</td>
                  <td className="px-4 py-3">
                    <StatusPill label={l.type} tone={TONE[l.type]} />
                  </td>
                  <td className="px-4 py-3 text-slate-300">{l.address}</td>
                  <td className="px-4 py-3 font-mono text-slate-300">{l.phone}</td>
                  <td className="px-4 py-3 text-slate-300">{l.manager}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onSelect(l)}
                      className="rounded-console border border-line px-2.5 py-1 text-xs text-accent transition-colors hover:border-accent"
                    >
                      Details
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
