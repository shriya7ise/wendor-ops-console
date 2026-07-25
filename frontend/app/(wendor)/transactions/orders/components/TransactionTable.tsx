'use client';

import { Order, OrderListResponse } from '@/types/order';
import { StatusPill } from '@/app/components/ui/StatusPill';
import { Pagination } from '@/app/components/ui/Pagination';
import { formatAmount, formatTime } from '@/lib/format';

interface Props {
  response: OrderListResponse | null;
  loading: boolean;
  onSelect: (order: Order) => void;
  onPageChange: (page: number) => void;
}

const HEADERS = [
  'Transaction / Bill ID',
  'Cluster',
  'Time',
  'Machine',
  'Amount',
  'Payment Mode',
  'Vend Status',
  '',
];

const TONE = { Success: 'success', Failed: 'danger', Pending: 'warn' } as const;

export function TransactionTable({ response, loading, onSelect, onPageChange }: Props) {
  return (
    <div className="overflow-hidden rounded-console border border-line bg-panel">
      <div className="scrollbar-thin overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
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
                  Loading orders...
                </td>
              </tr>
            )}
            {!loading && response?.data.length === 0 && (
              <tr>
                <td colSpan={HEADERS.length} className="px-4 py-10 text-center text-slate-500">
                  No transactions match these filters.
                </td>
              </tr>
            )}
            {!loading &&
              response?.data.map((t) => (
                <tr key={t.id} className="border-b border-line/60 transition-colors hover:bg-ink/60">
                  <td className="px-4 py-3 font-mono text-slate-200">{t.id}</td>
                  <td className="px-4 py-3 text-slate-300">{t.cluster}</td>
                  <td className="px-4 py-3 text-slate-400">{formatTime(t.time)}</td>
                  <td className="px-4 py-3 font-mono text-slate-300">{t.machine}</td>
                  <td className="px-4 py-3 font-mono text-slate-100">{formatAmount(t.amount)}</td>
                  <td className="px-4 py-3 text-slate-300">{t.paymentMode}</td>
                  <td className="px-4 py-3">
                    <StatusPill label={t.vendStatus} tone={TONE[t.vendStatus]} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onSelect(t)}
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
