'use client';

import { Product, ProductListResponse, ProductStatus } from '@/types/product';
import { StatusPill } from '@/app/components/ui/StatusPill';
import { Pagination } from '@/app/components/ui/Pagination';
import { formatAmount } from '@/lib/format';

interface Props {
  response: ProductListResponse | null;
  loading: boolean;
  onSelect: (product: Product) => void;
  onPageChange: (page: number) => void;
}

const HEADERS = [
  'Product ID',
  'Product Name',
  'Brand',
  'Category',
  'Cluster',
  'Machine',
  'Price',
  'UOM',
  'Status',
  'Actions',
];

const TONE: Record<ProductStatus, 'success' | 'neutral' | 'danger'> = {
  Active: 'success',
  Inactive: 'neutral',
  'Out of Stock': 'danger',
};

export function ProductsTable({ response, loading, onSelect, onPageChange }: Props) {
  return (
    <div className="overflow-hidden rounded-console border border-line bg-panel">
      <div className="scrollbar-thin overflow-x-auto">
        <table className="w-full min-w-[1000px] text-left text-sm">
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
                  Loading products...
                </td>
              </tr>
            )}
            {!loading && response?.data.length === 0 && (
              <tr>
                <td colSpan={HEADERS.length} className="px-4 py-10 text-center text-slate-500">
                  No products match these filters.
                </td>
              </tr>
            )}
            {!loading &&
              response?.data.map((p) => (
                <tr key={p.id} className="border-b border-line/60 transition-colors hover:bg-ink/60">
                  <td className="px-4 py-3 font-mono text-slate-200">{p.id}</td>
                  <td className="px-4 py-3 text-slate-100">{p.name}</td>
                  <td className="px-4 py-3 text-slate-300">{p.brand}</td>
                  <td className="px-4 py-3 text-slate-300">{p.category}</td>
                  <td className="px-4 py-3 text-slate-300">{p.cluster}</td>
                  <td className="px-4 py-3 font-mono text-slate-300">{p.machine}</td>
                  <td className="px-4 py-3 font-mono text-slate-100">{formatAmount(p.price)}</td>
                  <td className="px-4 py-3 text-slate-400">{p.uom}</td>
                  <td className="px-4 py-3">
                    <StatusPill label={p.status} tone={TONE[p.status]} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onSelect(p)}
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
