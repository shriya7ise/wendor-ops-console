'use client';

import { useEffect, useState } from 'react';
import { fetchStockLocationDetail } from '@/lib/api';
import { StockLocation, StockLocationType } from '@/types/stock-location';
import { StatusPill } from '@/app/components/ui/StatusPill';

const TONE: Record<StockLocationType, 'info' | 'neutral' | 'warn'> = {
  Warehouse: 'info',
  Vehicle: 'neutral',
  Machine: 'warn',
};

export function DetailDrawer({
  locationId,
  onClose,
}: {
  locationId: string | null;
  onClose: () => void;
}) {
  const [detail, setDetail] = useState<StockLocation | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!locationId) return;
    setLoading(true);
    fetchStockLocationDetail(locationId)
      .then(setDetail)
      .finally(() => setLoading(false));
  }, [locationId]);

  if (!locationId) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50">
      <button aria-label="Close details" onClick={onClose} className="absolute inset-0" />
      <div className="relative flex h-full w-full max-w-md flex-col border-l border-line bg-panel p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-lg text-slate-100">{locationId}</h2>
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
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Location</p>
              <p className="mt-1 text-lg text-slate-100">{detail.name}</p>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Type</span>
              <StatusPill label={detail.type} tone={TONE[detail.type]} />
            </div>

            <dl className="grid grid-cols-2 gap-y-3 text-sm">
              <dt className="text-slate-400">Address</dt>
              <dd className="text-right text-slate-200">{detail.address}</dd>

              <dt className="text-slate-400">Phone</dt>
              <dd className="text-right font-mono text-slate-200">{detail.phone}</dd>

              <dt className="text-slate-400">Manager</dt>
              <dd className="text-right text-slate-200">{detail.manager}</dd>
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}
