'use client';

import { useState } from 'react';
import { createWalletUser } from '@/lib/api';
import { WalletUser } from '@/types/wallet-user';

interface Props {
  onClose: () => void;
  onCreated: (user: WalletUser) => void;
}

// Powers the PRD "New Swift User" action.
export function NewSwiftUserModal({ onClose, onCreated }: Props) {
  const [name, setName] = useState('');
  const [rfid, setRfid] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!name || !rfid || !phone) {
      setError('Name, RFID and Phone are required.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const user = await createWalletUser({
        name,
        rfid,
        phone,
        email: email || undefined,
        initialBalance: initialBalance ? Number(initialBalance) : undefined,
      });
      onCreated(user);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create wallet user.');
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
          <h2 className="text-lg font-semibold text-slate-100">New Swift User</h2>
          <button onClick={onClose} className="text-sm text-slate-400 hover:text-accent">
            Close
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priya Sharma"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">
              RFID
            </label>
            <input
              value={rfid}
              onChange={(e) => setRfid(e.target.value)}
              placeholder="e.g. RFID7012345"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">
              Phone
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9876543210"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">
              Email (optional)
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. priya@example.com"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">
              Initial Top-up (optional)
            </label>
            <input
              type="number"
              min={0}
              value={initialBalance}
              onChange={(e) => setInitialBalance(e.target.value)}
              placeholder="e.g. 200"
              className={inputClass}
            />
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="mt-1 rounded-console bg-accent px-4 py-2 text-sm font-medium text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {saving ? 'Creating...' : 'Create Wallet User'}
          </button>
        </div>
      </div>
    </div>
  );
}
