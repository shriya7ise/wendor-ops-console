'use client';

import { useEffect, useMemo, useState } from 'react';
import { fetchRefundFilters, fetchRefunds } from '@/lib/api';
import { Refund, RefundFilterOptions, RefundListResponse, RefundQuery } from '@/types/refund';
import { SummaryCards } from '@/app/components/ui/SummaryCards';
import { formatCurrency } from '@/lib/format';
import { FilterBar } from './components/FilterBar';
import { RefundTable } from './components/RefundTable';
import { DetailDrawer } from './components/DetailDrawer';

const DEFAULT_QUERY: RefundQuery = { page: 1, limit: 10 };

export default function RefundsPage() {
  const [query, setQuery] = useState<RefundQuery>(DEFAULT_QUERY);
  const [response, setResponse] = useState<RefundListResponse | null>(null);
  const [options, setOptions] = useState<RefundFilterOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetchRefundFilters().then(setOptions).catch(() => undefined);
  }, []);

  useEffect(() => {
    const handle = setTimeout(() => {
      setLoading(true);
      setError(null);
      fetchRefunds(query)
        .then(setResponse)
        .catch(() => setError('Could not reach the transactions service.'))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(handle);
  }, [query]);

  const selectedRefund = useMemo<Refund | undefined>(
    () => response?.data.find((r) => r.id === selectedId),
    [response, selectedId],
  );

  return (
    <main className="px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6">
          <p className="console-label text-xs text-accent">Sales Ledger</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-100">Refunds</h1>
          <p className="mt-1 text-sm text-slate-400">
            Monitors every refund request and its processing status, end to end.
          </p>
        </header>

        {response && (
          <div className="mb-4">
            <SummaryCards
              cards={[
                { label: 'Total Refunds', value: formatCurrency(response.summary.totalRefunds), tone: 'text-accent' },
                { label: 'Refunded', value: response.summary.refundedCount, tone: 'text-success' },
                { label: 'Pending', value: response.summary.pendingCount, tone: 'text-warn' },
                { label: 'Failed', value: response.summary.failedCount, tone: 'text-danger' },
                { label: 'Disabled', value: response.summary.disabledCount, tone: 'text-slate-400' },
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

        <RefundTable
          response={response}
          loading={loading}
          onSelect={(r) => setSelectedId(r.id)}
          onPageChange={(page) => setQuery((q) => ({ ...q, page }))}
        />

        {selectedRefund && (
          <DetailDrawer refundId={selectedRefund.id} onClose={() => setSelectedId(null)} />
        )}
      </div>
    </main>
  );
}
