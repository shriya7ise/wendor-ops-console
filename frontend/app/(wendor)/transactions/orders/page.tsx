'use client';

import { useEffect, useMemo, useState } from 'react';
import { fetchOrderFilters, fetchOrders } from '@/lib/api';
import { Order, OrderFilterOptions, OrderListResponse, OrderQuery } from '@/types/order';
import { SummaryCards } from '@/app/components/ui/SummaryCards';
import { formatCurrency } from '@/lib/format';
import { FilterBar } from './components/FilterBar';
import { TransactionTable } from './components/TransactionTable';
import { DetailDrawer } from './components/DetailDrawer';

const DEFAULT_QUERY: OrderQuery = { page: 1, limit: 10 };

export default function OrdersPage() {
  const [query, setQuery] = useState<OrderQuery>(DEFAULT_QUERY);
  const [response, setResponse] = useState<OrderListResponse | null>(null);
  const [options, setOptions] = useState<OrderFilterOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrderFilters().then(setOptions).catch(() => undefined);
  }, []);

  useEffect(() => {
    const handle = setTimeout(() => {
      setLoading(true);
      setError(null);
      fetchOrders(query)
        .then(setResponse)
        .catch(() => setError('Could not reach the transactions service.'))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(handle);
  }, [query]);

  const selectedOrder = useMemo<Order | undefined>(
    () => response?.data.find((t) => t.id === selectedId),
    [response, selectedId],
  );

  return (
    <main className="px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6">
          <p className="console-label text-xs text-accent">Sales Ledger</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-100">Orders</h1>
          <p className="mt-1 text-sm text-slate-400">
            Complete history of completed vending machine purchases, for
            reconciliation and dispute resolution.
          </p>
        </header>

        {response && (
          <div className="mb-4">
            <SummaryCards
              cards={[
                { label: 'Total Transactions', value: response.summary.totalTransactions },
                { label: 'Total Amount', value: formatCurrency(response.summary.totalAmount), tone: 'text-accent' },
                { label: 'Successful', value: response.summary.successCount, tone: 'text-success' },
                { label: 'Failed', value: response.summary.failedCount, tone: 'text-danger' },
                { label: 'Pending', value: response.summary.pendingCount, tone: 'text-warn' },
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

        <TransactionTable
          response={response}
          loading={loading}
          onSelect={(t) => setSelectedId(t.id)}
          onPageChange={(page) => setQuery((q) => ({ ...q, page }))}
        />

        {selectedOrder && (
          <DetailDrawer orderId={selectedOrder.id} onClose={() => setSelectedId(null)} />
        )}
      </div>
    </main>
  );
}
