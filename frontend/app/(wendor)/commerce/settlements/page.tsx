'use client';

import { useEffect, useState } from 'react';
import { fetchSettlementFilters, fetchSettlements } from '@/lib/api';
import {
  Settlement,
  SettlementFilterOptions,
  SettlementListResponse,
  SettlementQuery,
} from '@/types/settlement';
import { SummaryCards } from '@/app/components/ui/SummaryCards';
import { FilterBar } from './components/FilterBar';
import { SettlementsTable } from './components/SettlementsTable';
import { CreateSettlementModal } from './components/CreateSettlementModal';
import { BulkAssignModal } from './components/BulkAssignModal';
import { ManageDrawer } from './components/ManageDrawer';

const DEFAULT_QUERY: SettlementQuery = { page: 1, limit: 10 };

export default function SettlementsPage() {
  const [query, setQuery] = useState<SettlementQuery>(DEFAULT_QUERY);
  const [response, setResponse] = useState<SettlementListResponse | null>(null);
  const [options, setOptions] = useState<SettlementFilterOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [managing, setManaging] = useState<Settlement | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showBulkAssign, setShowBulkAssign] = useState(false);

  useEffect(() => {
    fetchSettlementFilters().then(setOptions).catch(() => undefined);
  }, []);

  const reload = () => {
    setLoading(true);
    setError(null);
    fetchSettlements(query)
      .then(setResponse)
      .catch(() => setError('Could not reach the settlements service.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const handle = setTimeout(reload, 250);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const upsertLocally = (updated: Settlement) => {
    setResponse((prev) =>
      prev
        ? {
            ...prev,
            data: prev.data.some((s) => s.id === updated.id)
              ? prev.data.map((s) => (s.id === updated.id ? updated : s))
              : [updated, ...prev.data],
          }
        : prev,
    );
  };

  return (
    <main className="px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="console-label text-xs text-accent">Fleet & Stock</p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-100">Settlements</h1>
            <p className="mt-1 text-sm text-slate-400">
              Manage payment gateway settlement configurations and which
              machines settle to which merchant account.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowBulkAssign(true)}
              className="rounded-console border border-line px-3 py-2 text-sm text-slate-200 transition-colors hover:border-accent hover:text-accent"
            >
              Bulk Assign
            </button>
            <button
              onClick={() => setShowCreate(true)}
              className="rounded-console bg-accent px-3 py-2 text-sm font-medium text-ink transition-opacity hover:opacity-90"
            >
              Create Settlement
            </button>
          </div>
        </header>

        {response && (
          <div className="mb-4">
            <SummaryCards
              cards={[
                { label: 'Total Settlements', value: response.summary.totalSettlements },
                { label: 'Active', value: response.summary.activeCount, tone: 'text-success' },
                { label: 'Inactive', value: response.summary.inactiveCount, tone: 'text-slate-400' },
                { label: 'Machines Linked', value: response.summary.totalMachinesLinked, tone: 'text-accent' },
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

        <SettlementsTable
          response={response}
          loading={loading}
          onManage={setManaging}
          onPageChange={(page) => setQuery((q) => ({ ...q, page }))}
        />

        <ManageDrawer
          settlement={managing}
          onClose={() => setManaging(null)}
          onUpdated={(updated) => {
            upsertLocally(updated);
            setManaging(updated);
          }}
        />

        {showCreate && (
          <CreateSettlementModal
            options={options}
            onClose={() => setShowCreate(false)}
            onCreated={(created) => {
              upsertLocally(created);
              setShowCreate(false);
            }}
          />
        )}

        {showBulkAssign && response && (
          <BulkAssignModal
            settlements={response.data}
            options={options}
            onClose={() => setShowBulkAssign(false)}
            onAssigned={(updated) => {
              upsertLocally(updated);
              setShowBulkAssign(false);
            }}
          />
        )}
      </div>
    </main>
  );
}
