'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchStockOverview } from '@/lib/api';
import { StockOverview } from '@/types/stock-overview';
import { SummaryCards } from '@/app/components/ui/SummaryCards';
import { formatCurrency } from '@/lib/format';
import { STOCK_SUB_SECTIONS } from './sub-sections';

export default function StockManagementOverviewPage() {
  const [overview, setOverview] = useState<StockOverview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStockOverview()
      .then(setOverview)
      .catch(() => setError('Could not reach the commerce service.'));
  }, []);

  return (
    <main className="px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6">
          <p className="console-label text-xs text-accent">Fleet & Stock</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-100">Stock Management</h1>
          <p className="mt-1 text-sm text-slate-400">
            Inventory health, warehouse performance, and a jump-off point
            into every stock operation below.
          </p>
        </header>

        {error && (
          <div className="mb-4 rounded-console border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error} Is the NestJS API running on port 4000?
          </div>
        )}

        {overview && (
          <div className="mb-8 flex flex-col gap-4">
            <section>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Warehouse &amp; Inventory
              </p>
              <SummaryCards
                cards={[
                  { label: 'Total Warehouses', value: overview.warehouseInventory.totalWarehouses },
                  { label: 'Unique Products', value: overview.warehouseInventory.uniqueProducts },
                  { label: 'Total Stock Units', value: overview.warehouseInventory.totalStockUnits },
                  {
                    label: 'Total Stock Value',
                    value: formatCurrency(overview.warehouseInventory.totalStockValue),
                    tone: 'text-accent',
                  },
                ]}
              />
            </section>

            <section>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Purchase Orders
              </p>
              <SummaryCards
                cards={[
                  { label: 'Total POs', value: overview.purchaseOrders.totalPOs },
                  { label: 'Open POs', value: overview.purchaseOrders.openPOs, tone: 'text-warn' },
                  {
                    label: 'Total PO Value',
                    value: formatCurrency(overview.purchaseOrders.totalPOValue),
                    tone: 'text-accent',
                  },
                  {
                    label: 'Average PO Value',
                    value: formatCurrency(overview.purchaseOrders.averagePOValue),
                  },
                ]}
              />
            </section>

            <section>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Stock Transfers
              </p>
              <SummaryCards
                cards={[
                  { label: 'Total Transfers', value: overview.stockTransfers.totalTransfers },
                  { label: 'Pending', value: overview.stockTransfers.pending, tone: 'text-warn' },
                  { label: 'In Transit', value: overview.stockTransfers.inTransit, tone: 'text-accent' },
                  { label: 'Completed', value: overview.stockTransfers.completed, tone: 'text-success' },
                  {
                    label: 'Transfer Value',
                    value: formatCurrency(overview.stockTransfers.transferValue),
                  },
                ]}
              />
            </section>

            <section>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Low Stock by Warehouse
              </p>
              <div className="overflow-hidden rounded-console border border-line bg-panel">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-line text-xs uppercase tracking-wide text-slate-400">
                      <th className="px-4 py-2 font-medium">Warehouse</th>
                      <th className="px-4 py-2 font-medium">Total Products</th>
                      <th className="px-4 py-2 font-medium">Low Stock Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overview.lowStock.map((row) => (
                      <tr key={row.warehouse} className="border-b border-line/60 last:border-0">
                        <td className="px-4 py-2 text-slate-200">{row.warehouse}</td>
                        <td className="px-4 py-2 font-mono text-slate-300">{row.totalProducts}</td>
                        <td className="px-4 py-2 font-mono text-warn">{row.lowStockCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Products Below Reorder Point
              </p>
              <div className="overflow-hidden rounded-console border border-line bg-panel">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-line text-xs uppercase tracking-wide text-slate-400">
                      <th className="px-4 py-2 font-medium">Product</th>
                      <th className="px-4 py-2 font-medium">Warehouse</th>
                      <th className="px-4 py-2 font-medium">Units Left</th>
                      <th className="px-4 py-2 font-medium">Reorder Point</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overview.belowReorder.map((row, i) => (
                      <tr key={i} className="border-b border-line/60 last:border-0">
                        <td className="px-4 py-2 text-slate-200">{row.product}</td>
                        <td className="px-4 py-2 text-slate-300">{row.warehouse}</td>
                        <td className="px-4 py-2 font-mono text-danger">{row.unitsLeft}</td>
                        <td className="px-4 py-2 font-mono text-slate-400">{row.reorderPoint}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        <section>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Stock Management Screens
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {STOCK_SUB_SECTIONS.map((s) => (
              <Link
                key={s.slug}
                href={`/commerce/stock-management/${s.slug}`}
                className="group rounded-console border border-line bg-panel p-4 transition-colors hover:border-accent/50 hover:bg-ink"
              >
                <div className="mb-1 flex items-center justify-between">
                  <p className="font-medium text-slate-100 group-hover:text-accent">{s.label}</p>
                  {!s.live && (
                    <span className="rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-500">
                      Queued
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">{s.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
