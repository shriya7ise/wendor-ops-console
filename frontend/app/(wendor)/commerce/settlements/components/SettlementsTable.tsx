'use client';

import { Settlement, SettlementListResponse } from '@/types/settlement';
import { StatusPill } from '@/app/components/ui/StatusPill';
import { Pagination } from '@/app/components/ui/Pagination';
import { formatTime } from '@/lib/format';

interface Props {
  response: SettlementListResponse | null;
  loading: boolean;
  onManage: (settlement: Settlement) => void;
  onPageChange: (page: number) => void;
}

const HEADERS = [
  'Settlement ID',
  'Gateway',
  'Merchant ID',
  'Service Provider',
  'Machines',
  'Status',
  'Created',
  '',
];

export function SettlementsTable({ response, loading, onManage, onPageChange }: Props) {
  return (
    <div className="overflow-hidden rounded-console border border-line bg-panel">
      <div className="scrollbar-thin overflow-x-auto">
        <table className="w-full min-w-[960px] text-left text-sm">
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
                  Loading settlements...
                </td>
              </tr>
            )}
            {!loading && response?.data.length === 0 && (
              <tr>
                <td colSpan={HEADERS.length} className="px-4 py-10 text-center text-slate-500">
                  No settlements match these filters.
                </td>
              </tr>
            )}
            {!loading &&
              response?.data.map((s) => (
                <tr key={s.id} className="border-b border-line/60 transition-colors hover:bg-ink/60">
                  <td className="px-4 py-3 font-mono text-slate-200">{s.id}</td>
                  <td className="px-4 py-3 text-slate-300">{s.gateway}</td>
                  <td className="px-4 py-3 font-mono text-slate-300">{s.merchantId}</td>
                  <td className="px-4 py-3 text-slate-300">{s.serviceProvider}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {s.machines.map((m) => (
                        <span
                          key={m}
                          className="rounded-md border border-line bg-ink px-1.5 py-0.5 font-mono text-xs text-slate-300"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill
                      label={s.status}
                      tone={s.status === 'Active' ? 'success' : 'neutral'}
                    />
                  </td>
                  <td className="px-4 py-3 text-slate-400">{formatTime(s.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onManage(s)}
                      className="rounded-console border border-line px-2.5 py-1 text-xs text-accent transition-colors hover:border-accent"
                    >
                      Manage
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
