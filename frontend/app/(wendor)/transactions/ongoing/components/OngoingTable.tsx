'use client';

import { OngoingListResponse, OngoingTransaction } from '@/types/ongoing';
import { StatusPill } from '@/app/components/ui/StatusPill';
import { Pagination } from '@/app/components/ui/Pagination';
import { formatAmount, formatTime } from '@/lib/format';

interface Props {
  response: OngoingListResponse | null;
  loading: boolean;
  onSelect: (t: OngoingTransaction) => void;
  onPageChange: (page: number) => void;
}

const HEADERS = [
  'Transaction ID',
  'Date',
  'Machine',
  'Cluster',
  'Amount',
  'Payment Mode',
  'Payment Status',
  '',
];

const TONE = {
  Initiated: 'info',
  Processing: 'warn',
  'Awaiting Gateway': 'neutral',
} as const;

function inFlightLabel(seconds: number) {
  if (seconds < 60) return `${seconds}s in flight`;
  return `${Math.floor(seconds / 60)}m in flight`;
}

export function OngoingTable({ response, loading, onSelect, onPageChange }: Props) {
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
                  Loading ongoing transactions...
                </td>
              </tr>
            )}
            {!loading && response?.data.length === 0 && (
              <tr>
                <td colSpan={HEADERS.length} className="px-4 py-10 text-center text-slate-500">
                  Nothing in flight right now.
                </td>
              </tr>
            )}
            {!loading &&
              response?.data.map((t) => (
                <tr key={t.id} className="border-b border-line/60 transition-colors hover:bg-ink/60">
                  <td className="px-4 py-3 font-mono text-slate-200">
                    <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                    {t.id}
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {formatTime(t.date)}
                    <span className="ml-2 text-xs text-slate-500">
                      ({inFlightLabel(t.details.secondsInFlight)})
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-300">{t.machine}</td>
                  <td className="px-4 py-3 text-slate-300">{t.cluster}</td>
                  <td className="px-4 py-3 font-mono text-slate-100">{formatAmount(t.amount)}</td>
                  <td className="px-4 py-3 text-slate-300">{t.paymentMode}</td>
                  <td className="px-4 py-3">
                    <StatusPill label={t.paymentStatus} tone={TONE[t.paymentStatus]} />
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
