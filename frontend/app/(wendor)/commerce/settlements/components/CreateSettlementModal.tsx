'use client';

import { useState } from 'react';
import { createSettlement } from '@/lib/api';
import { Settlement, SettlementFilterOptions } from '@/types/settlement';

interface Props {
  options: SettlementFilterOptions | null;
  onClose: () => void;
  onCreated: (settlement: Settlement) => void;
}

export function CreateSettlementModal({ options, onClose, onCreated }: Props) {
  const [gateway, setGateway] = useState('');
  const [merchantId, setMerchantId] = useState('');
  const [serviceProvider, setServiceProvider] = useState('');
  const [machines, setMachines] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleMachine = (m: string) => {
    setMachines((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  };

  const handleSubmit = async () => {
    if (!gateway || !merchantId || !serviceProvider) {
      setError('Gateway, Merchant ID and Service Provider are required.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const settlement = await createSettlement({ gateway, merchantId, serviceProvider, machines });
      onCreated(settlement);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create settlement.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full rounded-console border border-line bg-ink px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:border-accent focus:outline-none';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0" />
      <div className="relative w-full max-w-md rounded-console border border-line bg-panel p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-100">Create Settlement</h2>
          <button onClick={onClose} className="text-sm text-slate-400 hover:text-accent">
            Close
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">
              Gateway
            </label>
            <input
              list="gateway-options"
              value={gateway}
              onChange={(e) => setGateway(e.target.value)}
              placeholder="e.g. Razorpay"
              className={inputClass}
            />
            <datalist id="gateway-options">
              {options?.gateways.map((g) => (
                <option key={g} value={g} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">
              Merchant ID
            </label>
            <input
              value={merchantId}
              onChange={(e) => setMerchantId(e.target.value)}
              placeholder="e.g. MER512345"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">
              Service Provider
            </label>
            <input
              list="provider-options"
              value={serviceProvider}
              onChange={(e) => setServiceProvider(e.target.value)}
              placeholder="e.g. HDFC Bank"
              className={inputClass}
            />
            <datalist id="provider-options">
              {options?.serviceProviders.map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">
              Machines (optional)
            </label>
            <div className="flex max-h-32 flex-wrap gap-1.5 overflow-y-auto rounded-console border border-line bg-ink p-2">
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
            {saving ? 'Creating...' : 'Create Settlement'}
          </button>
        </div>
      </div>
    </div>
  );
}
