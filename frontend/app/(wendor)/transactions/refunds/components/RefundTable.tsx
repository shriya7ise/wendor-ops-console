'use client';

import { Refund, RefundListResponse } from '@/types/refund';
import { StatusPill } from '@/app/components/ui/StatusPill';
import { Pagination } from '@/app/components/ui/Pagination';
import { formatAmount, formatTime } from '@/lib/format';

interface Props {
  response: RefundListResponse | null;
  loading: boolean;
  onSelect: (refund: Refund) => void;
  onPageChange: (page: number) => void;
}

const HEADERS = [
  'Refund ID',
  'Transaction ID',
  'Date',
  'Machine',
  'Refund Amount',
  'Refund Type',
  'Payment Mode',
  'Refund Status',
  '',
];

const TONE = {
  Refunded: 'success',
  Pending: 'warn',
  Failed: 'danger',
  Disabled: 'neutral',
} as const;

export function RefundTable({ response, loading, onSelect, onPageChange }: Props) {
  return (
    <div className="overflow-hidden rounded-console border border-line bg-panel">
      <div className="scrollbar-thin overflow-x-auto">
        <table className="w-full min-w-[1000px] text-left text-sm">
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
                  Loading refunds...
                </td>
              </tr>
            )}
            {!loading && response?.data.length === 0 && (
              <tr>
                <td colSpan={HEADERS.length} className="px-4 py-10 text-center text-slate-500">
                  No refunds match these filters.
                </td>
              </tr>
            )}
            {!loading &&
              response?.data.map((r) => (
                <tr key={r.id} className="border-b border-line/60 transition-colors hover:bg-ink/60">
                  <td className="px-4 py-3 font-mono text-slate-200">{r.id}</td>
                  <td className="px-4 py-3 font-mono text-slate-300">{r.transactionId}</td>
                  <td className="px-4 py-3 text-slate-400">{formatTime(r.date)}</td>
                  <td className="px-4 py-3 font-mono text-slate-300">{r.machine}</td>
                  <td className="px-4 py-3 font-mono text-slate-100">{formatAmount(r.refundAmount)}</td>
                  <td className="px-4 py-3 text-slate-300">{r.refundType}</td>
                  <td className="px-4 py-3 text-slate-300">{r.paymentMode}</td>
                  <td className="px-4 py-3">
                    <StatusPill label={r.refundStatus} tone={TONE[r.refundStatus]} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onSelect(r)}
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
