'use client';

import { useState } from 'react';
import { updateSettlementStatus } from '@/lib/api';
import { Settlement, SettlementStatus } from '@/types/settlement';
import { StatusPill } from '@/app/components/ui/StatusPill';
import { formatTime } from '@/lib/format';

const STATUSES: SettlementStatus[] = ['Active', 'Inactive'];

export function ManageDrawer({
  settlement,
  onClose,
  onUpdated,
}: {
  settlement: Settlement | null;
  onClose: () => void;
  onUpdated: (updated: Settlement) => void;
}) {
  const [saving, setSaving] = useState(false);

  if (!settlement) return null;

  const handleStatusChange = async (status: SettlementStatus) => {
    setSaving(true);
    try {
      const updated = await updateSettlementStatus(settlement.id, status);
      onUpdated(updated);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0" />
      <div className="relative flex h-full w-full max-w-md flex-col border-l border-line bg-panel p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-lg text-slate-100">{settlement.id}</h2>
          <button
            onClick={onClose}
            className="rounded-console border border-line px-2 py-1 text-sm text-slate-400 hover:text-accent"
          >
            Close
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-5">
          <dl className="grid grid-cols-2 gap-y-3 text-sm">
            <dt className="text-slate-400">Gateway</dt>
            <dd className="text-right text-slate-200">{settlement.gateway}</dd>

            <dt className="text-slate-400">Merchant ID</dt>
            <dd className="text-right font-mono text-slate-200">{settlement.merchantId}</dd>

            <dt className="text-slate-400">Service Provider</dt>
            <dd className="text-right text-slate-200">{settlement.serviceProvider}</dd>

            <dt className="text-slate-400">Created</dt>
            <dd className="text-right text-slate-200">{formatTime(settlement.createdAt)}</dd>
          </dl>

          <div>
            <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">Linked Machines</p>
            <div className="flex flex-wrap gap-1.5">
              {settlement.machines.length === 0 && (
                <span className="text-sm text-slate-500">No machines linked yet.</span>
              )}
              {settlement.machines.map((m) => (
                <span
                  key={m}
                  className="rounded-md border border-line bg-ink px-2 py-1 font-mono text-xs text-slate-300"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-console border border-line bg-ink p-4">
            <p className="mb-3 flex items-center justify-between text-xs uppercase tracking-wide text-slate-500">
              Status
              <StatusPill
                label={settlement.status}
                tone={settlement.status === 'Active' ? 'success' : 'neutral'}
              />
            </p>
            <div className="flex gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  disabled={saving || s === settlement.status}
                  onClick={() => handleStatusChange(s)}
                  className="flex-1 rounded-console border border-line px-2 py-1.5 text-xs text-slate-300 transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Set {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
