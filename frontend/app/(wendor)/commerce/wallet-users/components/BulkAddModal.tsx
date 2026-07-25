'use client';

import { useState } from 'react';
import { bulkAddWalletUsers } from '@/lib/api';
import { CreateWalletUserInput, WalletUser } from '@/types/wallet-user';

interface Props {
  onClose: () => void;
  onAdded: (users: WalletUser[]) => void;
}

const PLACEHOLDER = `Priya Sharma, RFID7011111, 9876500001, priya@example.com, 100
Rohan Verma, RFID7011112, 9876500002, rohan@example.com, 0`;

// Powers the PRD "Bulk Add Users" import action. Rather than requiring a
// real CSV file upload for this PoC, users paste comma-separated rows:
// name, rfid, phone, email (optional), initialBalance (optional)
export function BulkAddModal({ onClose, onAdded }: Props) {
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [skipped, setSkipped] = useState<string[]>([]);

  const parseRows = (): CreateWalletUserInput[] => {
    return text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [name, rfid, phone, email, initialBalance] = line.split(',').map((v) => v.trim());
        return {
          name,
          rfid,
          phone,
          email: email || undefined,
          initialBalance: initialBalance ? Number(initialBalance) : undefined,
        };
      });
  };

  const handleSubmit = async () => {
    const users = parseRows();
    if (users.length === 0 || users.some((u) => !u.name || !u.rfid || !u.phone)) {
      setError('Each row needs at least: name, rfid, phone.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const result = await bulkAddWalletUsers({ users });
      setSkipped(result.skipped);
      if (result.created.length > 0) onAdded(result.created);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not bulk add wallet users.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0" />
      <div className="relative w-full max-w-lg rounded-console border border-line bg-panel p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-100">Bulk Add Users</h2>
          <button onClick={onClose} className="text-sm text-slate-400 hover:text-accent">
            Close
          </button>
        </div>

        <p className="mb-3 text-sm text-slate-400">
          One row per user: <code className="text-accent">name, rfid, phone, email, initialBalance</code>
        </p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={PLACEHOLDER}
          rows={8}
          className="w-full rounded-console border border-line bg-ink px-3 py-2 font-mono text-sm text-slate-200 placeholder:text-slate-600 focus:border-accent focus:outline-none"
        />

        {error && <p className="mt-3 text-sm text-danger">{error}</p>}

        {skipped.length > 0 && (
          <div className="mt-3 rounded-console border border-warn/30 bg-warn/10 px-3 py-2 text-xs text-warn">
            Skipped {skipped.length} duplicate row(s):
            <ul className="mt-1 list-disc pl-4">
              {skipped.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="mt-4 rounded-console bg-accent px-4 py-2 text-sm font-medium text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {saving ? 'Importing...' : 'Import Users'}
        </button>
      </div>
    </div>
  );
}
