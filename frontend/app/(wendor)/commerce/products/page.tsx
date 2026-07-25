'use client';

import { useEffect, useMemo, useState } from 'react';
import { fetchProductFilters, fetchProducts } from '@/lib/api';
import {
  Product,
  ProductFilterOptions,
  ProductListResponse,
  ProductQuery,
} from '@/types/product';
import { SummaryCards } from '@/app/components/ui/SummaryCards';
import { FilterBar } from './components/FilterBar';
import { ProductsTable } from './components/ProductsTable';
import { ManageDrawer } from './components/ManageDrawer';

const DEFAULT_QUERY: ProductQuery = { page: 1, limit: 10 };

export default function ProductsPage() {
  const [query, setQuery] = useState<ProductQuery>(DEFAULT_QUERY);
  const [response, setResponse] = useState<ProductListResponse | null>(null);
  const [options, setOptions] = useState<ProductFilterOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetchProductFilters().then(setOptions).catch(() => undefined);
  }, []);

  useEffect(() => {
    const handle = setTimeout(() => {
      setLoading(true);
      setError(null);
      fetchProducts(query)
        .then(setResponse)
        .catch(() => setError('Could not reach the commerce service.'))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(handle);
  }, [query]);

  const selectedProduct = useMemo<Product | undefined>(
    () => response?.data.find((p) => p.id === selectedId),
    [response, selectedId],
  );

  // Optimistically patch the row in place after a status change, instead
  // of a full refetch — keeps the "Manage" flow feeling instant.
  const handleUpdated = (updated: Product) => {
    setResponse((prev) =>
      prev
        ? { ...prev, data: prev.data.map((p) => (p.id === updated.id ? updated : p)) }
        : prev,
    );
  };

  return (
    <main className="px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6">
          <p className="console-label text-xs text-accent">Fleet & Stock</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-100">Products</h1>
          <p className="mt-1 text-sm text-slate-400">
            The vending machine product catalogue — pricing, inventory
            organization, and product-level management.
          </p>
        </header>

        {response && (
          <div className="mb-4">
            <SummaryCards
              cards={[
                { label: 'Total Products', value: response.summary.totalProducts },
                { label: 'Active', value: response.summary.activeCount, tone: 'text-success' },
                { label: 'Inactive', value: response.summary.inactiveCount, tone: 'text-slate-400' },
                { label: 'Out of Stock', value: response.summary.outOfStockCount, tone: 'text-danger' },
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

        <ProductsTable
          response={response}
          loading={loading}
          onSelect={(p) => setSelectedId(p.id)}
          onPageChange={(page) => setQuery((q) => ({ ...q, page }))}
        />

        <ManageDrawer
          product={selectedProduct ?? null}
          onClose={() => setSelectedId(null)}
          onUpdated={handleUpdated}
        />
      </div>
    </main>
  );
}
