'use client';

import { WalletUser, WalletUserListResponse } from '@/types/wallet-user';
import { StatusPill } from '@/app/components/ui/StatusPill';
import { Pagination } from '@/app/components/ui/Pagination';
import { formatAmount } from '@/lib/format';

interface Props {
  response: WalletUserListResponse | null;
  loading: boolean;
  onManage: (user: WalletUser) => void;
  onPageChange: (page: number) => void;
}

const HEADERS = [
  'Wallet User',
  'Wallet ID',
  'Wallet Balance',
  'RFID Access',
  'Phone & Email',
  'Status',
  '',
];

export function WalletUsersTable({ response, loading, onManage, onPageChange }: Props) {
  return (
    <div className="overflow-hidden rounded-console border border-line bg-panel">
      <div className="scrollbar-thin overflow-x-auto">
        <table className="w-full min-w-[960px] text-left text-sm">
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
                  Loading wallet users...
                </td>
              </tr>
            )}
            {!loading && response?.data.length === 0 && (
              <tr>
                <td colSpan={HEADERS.length} className="px-4 py-10 text-center text-slate-500">
                  No wallet users match these filters.
                </td>
              </tr>
            )}
            {!loading &&
              response?.data.map((u) => (
                <tr key={u.id} className="border-b border-line/60 transition-colors hover:bg-ink/60">
                  <td className="px-4 py-3 text-slate-200">{u.name}</td>
                  <td className="px-4 py-3 font-mono text-slate-300">{u.walletId}</td>
                  <td className="px-4 py-3 font-mono text-slate-100">{formatAmount(u.balance)}</td>
                  <td className="px-4 py-3 font-mono text-slate-300">{u.rfid}</td>
                  <td className="px-4 py-3">
                    <div className="text-slate-300">{u.phone}</div>
                    <div className="text-xs text-slate-500">{u.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill
                      label={u.status}
                      tone={u.status === 'Active' ? 'success' : 'danger'}
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onManage(u)}
                      className="rounded-console border border-line px-2.5 py-1 text-xs text-accent transition-colors hover:border-accent"
                    >
                      Manage
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
