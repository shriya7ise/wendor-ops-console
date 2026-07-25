'use client';

import { useEffect, useState } from 'react';
import { fetchWalletUserFilters, fetchWalletUsers } from '@/lib/api';
import {
  WalletUser,
  WalletUserFilterOptions,
  WalletUserListResponse,
  WalletUserQuery,
} from '@/types/wallet-user';
import { SummaryCards } from '@/app/components/ui/SummaryCards';
import { formatCurrency } from '@/lib/format';
import { FilterBar } from './components/FilterBar';
import { WalletUsersTable } from './components/WalletUsersTable';
import { NewSwiftUserModal } from './components/NewSwiftUserModal';
import { BulkAddModal } from './components/BulkAddModal';
import { ManageDrawer } from './components/ManageDrawer';

const DEFAULT_QUERY: WalletUserQuery = { page: 1, limit: 10 };

export default function WalletUsersPage() {
  const [query, setQuery] = useState<WalletUserQuery>(DEFAULT_QUERY);
  const [response, setResponse] = useState<WalletUserListResponse | null>(null);
  const [options, setOptions] = useState<WalletUserFilterOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [managing, setManaging] = useState<WalletUser | null>(null);
  const [showNewUser, setShowNewUser] = useState(false);
  const [showBulkAdd, setShowBulkAdd] = useState(false);

  useEffect(() => {
    fetchWalletUserFilters().then(setOptions).catch(() => undefined);
  }, []);

  const reload = () => {
    setLoading(true);
    setError(null);
    fetchWalletUsers(query)
      .then(setResponse)
      .catch(() => setError('Could not reach the wallet users service.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const handle = setTimeout(reload, 250);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const upsertLocally = (updated: WalletUser) => {
    setResponse((prev) =>
      prev
        ? {
            ...prev,
            data: prev.data.some((u) => u.id === updated.id)
              ? prev.data.map((u) => (u.id === updated.id ? updated : u))
              : [updated, ...prev.data],
          }
        : prev,
    );
  };

  const insertManyLocally = (users: WalletUser[]) => {
    setResponse((prev) => (prev ? { ...prev, data: [...users, ...prev.data] } : prev));
  };

  return (
    <main className="px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="console-label text-xs text-accent">Fleet & Stock</p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-100">Wallet Users</h1>
            <p className="mt-1 text-sm text-slate-400">
              Manage users utilizing wallet-based vending payments — wallet
              accounts, balances, and RFID access.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowBulkAdd(true)}
              className="rounded-console border border-line px-3 py-2 text-sm text-slate-200 transition-colors hover:border-accent hover:text-accent"
            >
              Bulk Add Users
            </button>
            <button
              onClick={() => setShowNewUser(true)}
              className="rounded-console bg-accent px-3 py-2 text-sm font-medium text-ink transition-opacity hover:opacity-90"
            >
              New Swift User
            </button>
          </div>
        </header>

        {response && (
          <div className="mb-4">
            <SummaryCards
              cards={[
                { label: 'Total Wallet Users', value: response.summary.totalWalletUsers },
                { label: 'Active', value: response.summary.activeCount, tone: 'text-success' },
                { label: 'Blocked', value: response.summary.blockedCount, tone: 'text-danger' },
                {
                  label: 'Total Wallet Balance',
                  value: formatCurrency(response.summary.totalWalletBalance),
                  tone: 'text-accent',
                },
              ]}
            />
          </div>
        )}

        <div className="mb-4">
          <FilterBar
            query={query}
            options={options}
            onChange={(patch) => setQuery((q) => ({ ...q, ...patch }))}
            onReset={() => setQuery(DEFAULT_QUERY)}
          />
        </div>

        {error && (
          <div className="mb-4 rounded-console border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error} Is the NestJS API running on port 4000?
          </div>
        )}

        <WalletUsersTable
          response={response}
          loading={loading}
          onManage={setManaging}
          onPageChange={(page) => setQuery((q) => ({ ...q, page }))}
        />

        <ManageDrawer
          user={managing}
          onClose={() => setManaging(null)}
          onUpdated={(updated) => {
            upsertLocally(updated);
            setManaging(updated);
          }}
        />

        {showNewUser && (
          <NewSwiftUserModal
            onClose={() => setShowNewUser(false)}
            onCreated={(created) => {
              upsertLocally(created);
              setShowNewUser(false);
            }}
          />
        )}

        {showBulkAdd && (
          <BulkAddModal
            onClose={() => setShowBulkAdd(false)}
            onAdded={(users) => {
              insertManyLocally(users);
              setShowBulkAdd(false);
            }}
          />
        )}
      </div>
    </main>
  );
}
