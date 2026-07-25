'use client';

import { useEffect, useState } from 'react';
import { fetchCancelledCartDetail } from '@/lib/api';
import { CancelledCartItem } from '@/types/cancelled-cart';
import { StatusPill } from '@/app/components/ui/StatusPill';
import { formatAmount } from '@/lib/format';

const TONE = { Cancelled: 'neutral', Failed: 'danger' } as const;

export function DetailDrawer({
  requestId,
  onClose,
}: {
  requestId: string | null;
  onClose: () => void;
}) {
  const [detail, setDetail] = useState<CancelledCartItem | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!requestId) return;
    setLoading(true);
    fetchCancelledCartDetail(requestId)
      .then(setDetail)
      .finally(() => setLoading(false));
  }, [requestId]);

  if (!requestId) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50">
      <button aria-label="Close details" onClick={onClose} className="absolute inset-0" />
      <div className="relative flex h-full w-full max-w-md flex-col border-l border-line bg-panel p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-lg text-slate-100">{requestId}</h2>
          <button
            onClick={onClose}
            className="rounded-console border border-line px-2 py-1 text-sm text-slate-400 hover:text-accent"
          >
            Close
          </button>
        </div>

        {loading && <p className="mt-6 text-slate-500">Loading...</p>}

        {detail && !loading && (
          <div className="mt-6 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Payment Status</span>
              <StatusPill label={detail.paymentStatus} tone={TONE[detail.paymentStatus]} />
            </div>

            <dl className="grid grid-cols-2 gap-y-3 text-sm">
              <dt className="text-slate-400">Amount</dt>
              <dd className="text-right font-mono text-slate-100">
                {formatAmount(detail.amount)}
              </dd>

              <dt className="text-slate-400">Date</dt>
              <dd className="text-right text-slate-200">
                {new Date(detail.date).toLocaleString('en-IN')}
              </dd>

              <dt className="text-slate-400">Machine</dt>
              <dd className="text-right font-mono text-slate-200">{detail.machine}</dd>

              <dt className="text-slate-400">Cluster</dt>
              <dd className="text-right text-slate-200">{detail.cluster}</dd>

              <dt className="text-slate-400">Payment Method</dt>
              <dd className="text-right text-slate-200">{detail.paymentMethod}</dd>

              <dt className="text-slate-400">Gateway ID</dt>
              <dd className="text-right font-mono text-slate-200">{detail.gatewayId}</dd>
            </dl>

            <div className="rounded-console border border-line bg-ink p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Failure Reason</p>
              <p className="mt-1 text-slate-100">{detail.details.failureReason}</p>
              <p className="mt-1 text-sm text-slate-400">Slot {detail.details.slot}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
