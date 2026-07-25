'use client';

import { useEffect, useState } from 'react';
import { fetchOrderDetail } from '@/lib/api';
import { Order } from '@/types/order';
import { StatusPill } from '@/app/components/ui/StatusPill';
import { formatAmount } from '@/lib/format';

const TONE = { Success: 'success', Failed: 'danger', Pending: 'warn' } as const;

export function DetailDrawer({
  orderId,
  onClose,
}: {
  orderId: string | null;
  onClose: () => void;
}) {
  const [detail, setDetail] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    fetchOrderDetail(orderId).then(setDetail).finally(() => setLoading(false));
  }, [orderId]);

  if (!orderId) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50">
      <button aria-label="Close details" onClick={onClose} className="absolute inset-0" />
      <div className="relative flex h-full w-full max-w-md flex-col border-l border-line bg-panel p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-lg text-slate-100">{orderId}</h2>
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
              <span className="text-sm text-slate-400">Vend Status</span>
              <StatusPill label={detail.vendStatus} tone={TONE[detail.vendStatus]} />
            </div>

            <dl className="grid grid-cols-2 gap-y-3 text-sm">
              <dt className="text-slate-400">Amount</dt>
              <dd className="text-right font-mono text-slate-100">{formatAmount(detail.amount)}</dd>

              <dt className="text-slate-400">Time</dt>
              <dd className="text-right text-slate-200">
                {new Date(detail.time).toLocaleString('en-IN')}
              </dd>

              <dt className="text-slate-400">Machine</dt>
              <dd className="text-right font-mono text-slate-200">{detail.machine}</dd>

              <dt className="text-slate-400">Cluster</dt>
              <dd className="text-right text-slate-200">{detail.cluster}</dd>

              <dt className="text-slate-400">Payment Mode</dt>
              <dd className="text-right text-slate-200">{detail.paymentMode}</dd>

              <dt className="text-slate-400">Gateway Ref</dt>
              <dd className="text-right font-mono text-slate-200">{detail.details.gatewayRef}</dd>
            </dl>

            <div className="rounded-console border border-line bg-ink p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Vend Item</p>
              <p className="mt-1 text-slate-100">
                {detail.details.product} &times; {detail.details.quantity}
              </p>
              <p className="mt-1 text-sm text-slate-400">Slot {detail.details.slot}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Customer</p>
              <p className="mt-1 font-mono text-slate-200">{detail.details.customerPhone}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
