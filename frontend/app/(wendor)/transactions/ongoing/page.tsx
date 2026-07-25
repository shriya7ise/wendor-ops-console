'use client';

import { useEffect, useMemo, useState } from 'react';
import { fetchOngoing, fetchOngoingFilters } from '@/lib/api';
import {
  OngoingFilterOptions,
  OngoingListResponse,
  OngoingQuery,
  OngoingTransaction,
} from '@/types/ongoing';
import { SummaryCards } from '@/app/components/ui/SummaryCards';
import { formatCurrency } from '@/lib/format';
import { FilterBar } from './components/FilterBar';
import { OngoingTable } from './components/OngoingTable';
import { DetailDrawer } from './components/DetailDrawer';

const DEFAULT_QUERY: OngoingQuery = { page: 1, limit: 10 };
const POLL_INTERVAL_MS = 15000;

export default function OngoingPage() {
  const [query, setQuery] = useState<OngoingQuery>(DEFAULT_QUERY);
  const [response, setResponse] = useState<OngoingListResponse | null>(null);
  const [options, setOptions] = useState<OngoingFilterOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetchOngoingFilters().then(setOptions).catch(() => undefined);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      setError(null);
      fetchOngoing(query)
        .then((res) => {
          if (!cancelled) setResponse(res);
        })
        .catch(() => {
          if (!cancelled) setError('Could not reach the transactions service.');
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    };

    setLoading(true);
    const handle = setTimeout(load, 250);
    // Ongoing requests change quickly — poll so vendors see live status
    // without manually reloading (per PRD "Anything Else We Can Add").
    const poll = setInterval(load, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearTimeout(handle);
      clearInterval(poll);
    };
  }, [query]);

  const selectedTransaction = useMemo<OngoingTransaction | undefined>(
    () => response?.data.find((t) => t.id === selectedId),
    [response, selectedId],
  );

  return (
    <main className="px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6">
          <p className="console-label text-xs text-accent">Sales Ledger</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-100">
            Ongoing Transactions &amp; Requests
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Transactions still being processed — auto-refreshes every 15
            seconds so nothing goes stale while you watch.
          </p>
        </header>

        {response && (
          <div className="mb-4">
            <SummaryCards
              cards={[
                { label: 'In Flight', value: response.summary.totalOngoing, tone: 'text-accent' },
                { label: 'Total Amount', value: formatCurrency(response.summary.totalAmount) },
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

        <OngoingTable
          response={response}
          loading={loading}
          onSelect={(t) => setSelectedId(t.id)}
          onPageChange={(page) => setQuery((q) => ({ ...q, page }))}
        />

        {selectedTransaction && (
          <DetailDrawer
            transactionId={selectedTransaction.id}
            onClose={() => setSelectedId(null)}
          />
        )}
      </div>
    </main>
  );
}
