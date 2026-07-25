'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { fetchStockLocationFilters, fetchStockLocations } from '@/lib/api';
import {
  StockLocation,
  StockLocationFilterOptions,
  StockLocationListResponse,
  StockLocationQuery,
} from '@/types/stock-location';
import { SummaryCards } from '@/app/components/ui/SummaryCards';
import { FilterBar } from './components/FilterBar';
import { StockLocationsTable } from './components/StockLocationsTable';
import { DetailDrawer } from './components/DetailDrawer';

const DEFAULT_QUERY: StockLocationQuery = { page: 1, limit: 10 };

export default function StockLocationsPage() {
  const [query, setQuery] = useState<StockLocationQuery>(DEFAULT_QUERY);
  const [response, setResponse] = useState<StockLocationListResponse | null>(null);
  const [options, setOptions] = useState<StockLocationFilterOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetchStockLocationFilters().then(setOptions).catch(() => undefined);
  }, []);

  useEffect(() => {
    const handle = setTimeout(() => {
      setLoading(true);
      setError(null);
      fetchStockLocations(query)
        .then(setResponse)
        .catch(() => setError('Could not reach the commerce service.'))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(handle);
  }, [query]);

  const selectedLocation = useMemo<StockLocation | undefined>(
    () => response?.data.find((l) => l.id === selectedId),
    [response, selectedId],
  );

  return (
    <main className="px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6">
          <p className="console-label text-xs text-accent">
            <Link href="/commerce/stock-management" className="hover:underline">
              Stock Management
            </Link>{' '}
            / Stock Locations
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-100">Stock Locations</h1>
          <p className="mt-1 text-sm text-slate-400">
            Every warehouse, vehicle, and machine-level storage location.
          </p>
        </header>

        {response && (
          <div className="mb-4">
            <SummaryCards cards={[{ label: 'Total Locations', value: response.summary.totalLocations }]} />
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

        <StockLocationsTable
          response={response}
          loading={loading}
          onSelect={(l) => setSelectedId(l.id)}
          onPageChange={(page) => setQuery((q) => ({ ...q, page }))}
        />

        {selectedLocation && (
          <DetailDrawer locationId={selectedLocation.id} onClose={() => setSelectedId(null)} />
        )}
      </div>
    </main>
  );
}
