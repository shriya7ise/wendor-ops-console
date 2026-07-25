'use client';

import { useEffect, useMemo, useState } from 'react';
import { cancelledCartExportUrl, fetchCancelledCart, fetchCancelledCartFilters } from '@/lib/api';
import {
  CancelledCartFilterOptions,
  CancelledCartItem,
  CancelledCartListResponse,
  CancelledCartQuery,
} from '@/types/cancelled-cart';
import { SummaryCards } from '@/app/components/ui/SummaryCards';
import { formatCurrency } from '@/lib/format';
import { FilterBar } from './components/FilterBar';
import { CancelledCartTable } from './components/CancelledCartTable';
import { DetailDrawer } from './components/DetailDrawer';

const DEFAULT_QUERY: CancelledCartQuery = { page: 1, limit: 10 };

export default function CancelledCartPage() {
  const [query, setQuery] = useState<CancelledCartQuery>(DEFAULT_QUERY);
  const [response, setResponse] = useState<CancelledCartListResponse | null>(null);
  const [options, setOptions] = useState<CancelledCartFilterOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetchCancelledCartFilters().then(setOptions).catch(() => undefined);
  }, []);

  useEffect(() => {
    const handle = setTimeout(() => {
      setLoading(true);
      setError(null);
      fetchCancelledCart(query)
        .then(setResponse)
        .catch(() => setError('Could not reach the transactions service.'))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(handle);
  }, [query]);

  const selectedItem = useMemo<CancelledCartItem | undefined>(
    () => response?.data.find((r) => r.id === selectedId),
    [response, selectedId],
  );

  return (
    <main className="px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6">
          <p className="console-label text-xs text-accent">Sales Ledger</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-100">Cancelled Cart</h1>
          <p className="mt-1 text-sm text-slate-400">
            Cancelled or unsuccessful purchase requests, for troubleshooting
            payment gateway and vending issues.
          </p>
        </header>

        {response && (
          <div className="mb-4">
            <SummaryCards
              cards={[
                { label: 'Cancelled Requests', value: response.summary.totalRequests },
                { label: 'Total Amount', value: formatCurrency(response.summary.totalAmount), tone: 'text-accent' },
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
            onDownload={() => window.open(cancelledCartExportUrl(query), '_blank')}
          />
        </div>

        {error && (
          <div className="mb-4 rounded-console border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error} Is the NestJS API running on port 4000?
          </div>
        )}

        <CancelledCartTable
          response={response}
          loading={loading}
          onSelect={(r) => setSelectedId(r.id)}
          onPageChange={(page) => setQuery((q) => ({ ...q, page }))}
        />

        {selectedItem && (
          <DetailDrawer requestId={selectedItem.id} onClose={() => setSelectedId(null)} />
        )}
      </div>
    </main>
  );
}
