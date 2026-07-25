'use client';

import { useState } from 'react';
import { bulkAssignMachines } from '@/lib/api';
import { Settlement, SettlementFilterOptions } from '@/types/settlement';

interface Props {
  settlements: Settlement[];
  options: SettlementFilterOptions | null;
  onClose: () => void;
  onAssigned: (settlement: Settlement) => void;
}

// Powers the PRD "Bulk Assign" action — attach many machines to one
// existing settlement account in a single call.
export function BulkAssignModal({ settlements, options, onClose, onAssigned }: Props) {
  const [settlementId, setSettlementId] = useState(settlements[0]?.id ?? '');
  const [machines, setMachines] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleMachine = (m: string) => {
    setMachines((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  };

  const handleSubmit = async () => {
    if (!settlementId || machines.length === 0) {
      setError('Pick a settlement and at least one machine.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const settlement = await bulkAssignMachines({ settlementId, machines });
      onAssigned(settlement);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not assign machines.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0" />
      <div className="relative w-full max-w-md rounded-console border border-line bg-panel p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-100">Bulk Assign Machines</h2>
          <button onClick={onClose} className="text-sm text-slate-400 hover:text-accent">
            Close
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">
              Settlement
            </label>
            <select
              value={settlementId}
              onChange={(e) => setSettlementId(e.target.value)}
              className="w-full rounded-console border border-line bg-ink px-3 py-2 text-sm text-slate-200 focus:border-accent focus:outline-none"
            >
              {settlements.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.id} &middot; {s.gateway} &middot; {s.merchantId}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">
              Machines to assign
            </label>
            <div className="flex max-h-40 flex-wrap gap-1.5 overflow-y-auto rounded-console border border-line bg-ink p-2">
              {options?.machines.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => toggleMachine(m)}
                  className={`rounded-md border px-2 py-1 font-mono text-xs transition-colors ${
                    machines.includes(m)
                      ? 'border-accent bg-accent/15 text-accent'
                      : 'border-line text-slate-300 hover:border-accent'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="mt-1 rounded-console bg-accent px-4 py-2 text-sm font-medium text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {saving ? 'Assigning...' : 'Bulk Assign'}
          </button>
        </div>
      </div>
    </div>
  );
}
