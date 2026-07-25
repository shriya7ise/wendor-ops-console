'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { SummaryCards } from '@/app/components/ui/SummaryCards';
import { PillTone } from '@/app/components/ui/StatusPill';
import { GenericFilterBar } from './GenericFilterBar';
import { GenericTable } from './GenericTable';
import { GenericDetailDrawer } from './GenericDetailDrawer';
import { FieldDef, GenericFilterOptions, GenericListResponse, GenericQuery } from './types';

interface Row {
  id: string;
  [key: string]: unknown;
}

export interface GenericListPageProps<T extends Row> {
  breadcrumbHref: string;
  breadcrumbLabel: string;
  title: string;
  prdRef: string;
  description: string;
  fields: FieldDef[];
  statusTone?: Record<string, PillTone>;
  hasStatus?: boolean;
  searchPlaceholder?: string;
  titleField?: string;
  fetchList: (query: GenericQuery) => Promise<GenericListResponse<T>>;
  fetchFilters: () => Promise<GenericFilterOptions>;
  fetchDetail: (id: string) => Promise<T>;
}

const DEFAULT_QUERY: GenericQuery = { page: 1, limit: 10 };

export function GenericListPage<T extends Row>({
  breadcrumbHref,
  breadcrumbLabel,
  title,
  prdRef,
  description,
  fields,
  statusTone,
  hasStatus,
  searchPlaceholder,
  titleField,
  fetchList,
  fetchFilters,
  fetchDetail,
}: GenericListPageProps<T>) {
  const [query, setQuery] = useState<GenericQuery>(DEFAULT_QUERY);
  const [response, setResponse] = useState<GenericListResponse<T> | null>(null);
  const [options, setOptions] = useState<GenericFilterOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetchFilters().then(setOptions).catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handle = setTimeout(() => {
      setLoading(true);
      setError(null);
      fetchList(query)
        .then(setResponse)
        .catch(() => setError('Could not reach the API. Is the NestJS backend running on port 4000?'))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const summaryCards = useMemo(
    () =>
      response
        ? Object.entries(response.summary).map(([label, value]) => ({ label, value: value as string | number }))
        : [],
    [response],
  );

  const detailFetcher = useCallback((id: string) => fetchDetail(id), [fetchDetail]);

  return (
    <main className="px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6">
          <p className="console-label flex items-center gap-2 text-xs text-accent">
            <Link href={breadcrumbHref} className="hover:underline">
              {breadcrumbLabel}
            </Link>
            <span className="text-slate-600">/</span>
            <span className="rounded-sm border border-line px-1.5 py-0.5 text-slate-400">
              SPEC {prdRef}
            </span>
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-100">{title}</h1>
          <p className="mt-1 text-sm text-slate-400">{description}</p>
        </header>

        {summaryCards.length > 0 && (
          <div className="mb-4">
            <SummaryCards cards={summaryCards} />
          </div>
        )}

        <div className="mb-4">
          <GenericFilterBar
            query={query}
            options={options}
            fields={fields}
            hasStatus={hasStatus}
            searchPlaceholder={searchPlaceholder}
            onChange={(patch) => setQuery((q) => ({ ...q, ...patch }))}
            onReset={() => setQuery(DEFAULT_QUERY)}
          />
        </div>

        {error && (
          <div className="mb-4 rounded-console border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        <GenericTable<T>
          response={response}
          fields={fields}
          loading={loading}
          statusTone={statusTone}
          onSelect={(row) => setSelectedId(row.id)}
          onPageChange={(page) => setQuery((q) => ({ ...q, page }))}
        />

        <GenericDetailDrawer<T>
          id={selectedId}
          fields={fields}
          fetchDetail={detailFetcher}
          statusTone={statusTone}
          titleField={titleField}
          onClose={() => setSelectedId(null)}
        />
      </div>
    </main>
  );
}
