'use client';

import { useState } from 'react';
import { topupWalletUser, updateWalletUserStatus } from '@/lib/api';
import { TopupMode, WalletUser, WalletUserStatus } from '@/types/wallet-user';
import { StatusPill } from '@/app/components/ui/StatusPill';
import { formatAmount, formatTime } from '@/lib/format';

const STATUSES: WalletUserStatus[] = ['Active', 'Blocked'];
const TOPUP_MODES: TopupMode[] = ['UPI', 'Card', 'Cash', 'Net Banking'];

export function ManageDrawer({
  user,
  onClose,
  onUpdated,
}: {
  user: WalletUser | null;
  onClose: () => void;
  onUpdated: (updated: WalletUser) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [topupAmount, setTopupAmount] = useState('');
  const [topupMode, setTopupMode] = useState<TopupMode>('UPI');

  if (!user) return null;

  const handleStatusChange = async (status: WalletUserStatus) => {
    setSaving(true);
    try {
      const updated = await updateWalletUserStatus(user.id, status);
      onUpdated(updated);
    } finally {
      setSaving(false);
    }
  };

  const handleTopup = async () => {
    const amount = Number(topupAmount);
    if (!amount || amount <= 0) return;
    setSaving(true);
    try {
      const updated = await topupWalletUser(user.id, { amount, mode: topupMode });
      onUpdated(updated);
      setTopupAmount('');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0" />
      <div className="relative flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-line bg-panel p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg text-slate-100">{user.name}</h2>
          <button
            onClick={onClose}
            className="rounded-console border border-line px-2 py-1 text-sm text-slate-400 hover:text-accent"
          >
            Close
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-5">
          <dl className="grid grid-cols-2 gap-y-3 text-sm">
            <dt className="text-slate-400">Wallet ID</dt>
            <dd className="text-right font-mono text-slate-200">{user.walletId}</dd>

            <dt className="text-slate-400">RFID Access</dt>
            <dd className="text-right font-mono text-slate-200">{user.rfid}</dd>

            <dt className="text-slate-400">Phone</dt>
            <dd className="text-right text-slate-200">{user.phone}</dd>

            <dt className="text-slate-400">Email</dt>
            <dd className="text-right text-slate-200">{user.email || '—'}</dd>

            <dt className="text-slate-400">Wallet Balance</dt>
            <dd className="text-right font-mono text-lg text-accent">
              {formatAmount(user.balance)}
            </dd>
          </dl>

          <div className="rounded-console border border-line bg-ink p-4">
            <p className="mb-3 flex items-center justify-between text-xs uppercase tracking-wide text-slate-500">
              Status
              <StatusPill label={user.status} tone={user.status === 'Active' ? 'success' : 'danger'} />
            </p>
            <div className="flex gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  disabled={saving || s === user.status}
                  onClick={() => handleStatusChange(s)}
                  className="flex-1 rounded-console border border-line px-2 py-1.5 text-xs text-slate-300 transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Set {s}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-console border border-line bg-ink p-4">
            <p className="mb-3 text-xs uppercase tracking-wide text-slate-500">Top Up Wallet</p>
            <div className="flex gap-2">
              <input
                type="number"
                min={1}
                value={topupAmount}
                onChange={(e) => setTopupAmount(e.target.value)}
                placeholder="Amount"
                className="w-24 rounded-console border border-line bg-panel px-2 py-1.5 text-sm text-slate-200 placeholder:text-slate-500 focus:border-accent focus:outline-none"
              />
              <select
                value={topupMode}
                onChange={(e) => setTopupMode(e.target.value as TopupMode)}
                className="flex-1 rounded-console border border-line bg-panel px-2 py-1.5 text-sm text-slate-200 focus:border-accent focus:outline-none"
              >
                {TOPUP_MODES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <button
                onClick={handleTopup}
                disabled={saving || !topupAmount}
                className="rounded-console bg-accent px-3 py-1.5 text-sm font-medium text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">
              Top-up / Recharge History
            </p>
            {user.topups.length === 0 && (
              <p className="text-sm text-slate-500">No top-ups recorded yet.</p>
            )}
            <ul className="flex flex-col gap-2">
              {user.topups.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center justify-between rounded-console border border-line bg-ink px-3 py-2 text-sm"
                >
                  <div>
                    <p className="text-slate-200">{formatAmount(t.amount)}</p>
                    <p className="text-xs text-slate-500">
                      {t.mode} &middot; {formatTime(t.date)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
