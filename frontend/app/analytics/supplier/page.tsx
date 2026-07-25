'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';
import { api } from '@/lib/api';
import type { SupplierAnalysis, SupplierOption } from '@/lib/types';

function toISODate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function SupplierAnalysisPage() {
  const [supplierTerm, setSupplierTerm] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [options, setOptions] = useState<SupplierOption[]>([]);
  const [showOptions, setShowOptions] = useState(false);

  const [from, setFrom] = useState(toISODate(new Date(Date.now() - 90 * 86_400_000)));
  const [to, setTo] = useState(toISODate(new Date()));
  const [granularity, setGranularity] = useState<'day' | 'week' | 'month'>('week');
  const [limit, setLimit] = useState(20);

  const [data, setData] = useState<SupplierAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Autocomplete — debounced search against /analytics/supplier/search
  useEffect(() => {
    if (!supplierTerm) { setOptions([]); return; }
    const handle = setTimeout(async () => {
      try {
        const res = (await api.searchSuppliers(supplierTerm)) as SupplierOption[];
        setOptions(res);
      } catch {
        setOptions([]);
      }
    }, 250);
    return () => clearTimeout(handle);
  }, [supplierTerm]);

  const canLoad = Boolean(supplierId || supplierTerm);

  useEffect(() => {
    if (!canLoad) { setData(null); return; }
    setLoading(true);
    setError(null);
    api
      .getSupplierAnalysis({ supplierId: supplierId || undefined, supplier: supplierId ? undefined : supplierTerm, from, to, granularity, limit })
      .then((res) => setData(res as SupplierAnalysis))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplierId, from, to, granularity, limit]);

  const kpis = data?.kpis;
  const healthTier = data?.healthScore.tier;

  const fillRateTone = useMemo(() => {
    if (!data) return 'flat';
    return data.trend.fillRateDeltaPts > 0 ? 'up' : data.trend.fillRateDeltaPts < 0 ? 'down' : 'flat';
  }, [data]);

  return (
    <div className="page-shell">
      <div>
        <h1 className="page-title">Supplier Analysis</h1>
        <p className="text-sm text-neutral-500">Dashboard &gt; Analytics &gt; Supplier Analysis</p>
      </div>

      {/* Filters */}
      <Card title="Filters">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <div className="relative lg:col-span-2">
            <label className="mb-1 block text-xs font-medium text-neutral-500">Supplier</label>
            <input
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
              placeholder="Start typing supplier name."
              value={supplierTerm}
              onChange={(e) => { setSupplierTerm(e.target.value); setSupplierId(''); setShowOptions(true); }}
              onFocus={() => setShowOptions(true)}
              onBlur={() => setTimeout(() => setShowOptions(false), 150)}
            />
            {showOptions && options.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full rounded-lg border border-neutral-200 bg-white shadow-lg">
                {options.map((o) => (
                  <li
                    key={o.id}
                    className="cursor-pointer px-3 py-2 text-sm hover:bg-neutral-50"
                    onMouseDown={() => { setSupplierId(o.id); setSupplierTerm(o.name); setShowOptions(false); }}
                  >
                    {o.name} {o.code && <span className="text-neutral-400">({o.code})</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">Supplier ID</label>
            <input
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">From</label>
            <input type="date" className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">To</label>
            <input type="date" className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">Granularity</label>
            <select className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" value={granularity} onChange={(e) => setGranularity(e.target.value as any)}>
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
            </select>
          </div>
        </div>
        {!canLoad && <p className="mt-3 text-sm text-neutral-500">Select a supplier or enter Supplier ID to load analytics.</p>}
      </Card>

      {loading && <p className="text-sm text-neutral-500">Loading…</p>}
      {error && <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{error}</div>}

      {data && kpis && (
        <>
          {/* Header: supplier name + health score + insights */}
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">{data.supplier.name}</h2>
                <p className="text-xs text-neutral-500">
                  ID: {data.supplier.id} · Range: {data.range.from.slice(0, 10)} to {data.range.to.slice(0, 10)} · Granularity: {data.range.granularity}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500">Health score</span>
                <Badge tone={healthTier!}>{data.healthScore.score} · Tier {healthTier}</Badge>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {data.insights.map((insight, i) => (
                <div
                  key={i}
                  className={`rounded-lg border px-3 py-2 text-sm ${
                    insight.level === 'critical'
                      ? 'border-red-200 bg-red-50 text-red-800'
                      : insight.level === 'warning'
                        ? 'border-amber-200 bg-amber-50 text-amber-800'
                        : 'border-sky-200 bg-sky-50 text-sky-800'
                  }`}
                >
                  {insight.message}
                </div>
              ))}
            </div>
          </Card>

          {/* KPI grid — mirrors the 12 stat cards from the source screen */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            <StatCard label="PO Count" value={kpis.poCount} />
            <StatCard label="Ordered Qty" value={kpis.orderedQty} />
            <StatCard label="Received Qty" value={kpis.receivedQty} />
            <StatCard label="Ordered Value" value={`₹${kpis.orderedValue.toLocaleString()}`} deltaLabel={data.trend.orderedValueDeltaPct !== null ? `${data.trend.orderedValueDeltaPct}% vs prev period` : undefined} deltaTone={data.trend.orderedValueDeltaPct && data.trend.orderedValueDeltaPct > 0 ? 'up' : 'down'} />
            <StatCard label="Received Value" value={`₹${kpis.receivedValue.toLocaleString()}`} />
            <StatCard label="Fill Rate" value={`${kpis.fillRate}%`} deltaLabel={`${data.trend.fillRateDeltaPts > 0 ? '+' : ''}${data.trend.fillRateDeltaPts.toFixed(1)} pts vs prev`} deltaTone={fillRateTone as any} />
            <StatCard label="Qty Variance" value={kpis.qtyVariance} />
            <StatCard label="Value Variance" value={`₹${kpis.valueVariance.toLocaleString()}`} />
            <StatCard label="Cancelled POs" value={kpis.cancelledPOs} />
            <StatCard label="Partial POs" value={kpis.partialPOs} />
            <StatCard label="Fully Received POs" value={kpis.fullyReceivedPOs} />
            <StatCard label="Avg Lead Time (days)" value={kpis.avgLeadTimeDays} deltaLabel={`±${kpis.leadTimeStdDevDays}d consistency`} deltaTone={kpis.leadTimeStdDevDays > kpis.avgLeadTimeDays ? 'down' : 'up'} />
          </div>

          {/* Trend charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card title="Procurement Trend (Qty)" subtitle={`${data.range.from.slice(0, 10)} to ${data.range.to.slice(0, 10)} (${data.range.granularity})`}>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data.procurementTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="label" fontSize={11} />
                  <YAxis fontSize={11} />
                  <Tooltip />
                  <Line type="monotone" dataKey="qty" stroke="#dc2626" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card title="Procurement Value Trend" subtitle={`${data.range.from.slice(0, 10)} to ${data.range.to.slice(0, 10)} (${data.range.granularity})`}>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data.procurementTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="label" fontSize={11} />
                  <YAxis fontSize={11} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#dc2626" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card title="Fill Rate Trend" subtitle={`${data.range.from.slice(0, 10)} to ${data.range.to.slice(0, 10)} (${data.range.granularity})`}>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data.fillRateTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="label" fontSize={11} />
                  <YAxis fontSize={11} unit="%" />
                  <Tooltip />
                  <Line type="monotone" dataKey="fillRate" stroke="#dc2626" strokeWidth={2} dot={false} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card title="Lead Time Distribution" subtitle={`${data.range.from.slice(0, 10)} to ${data.range.to.slice(0, 10)}`}>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.leadTimeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="label" fontSize={11} />
                  <YAxis fontSize={11} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#dc2626" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Refill tables */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card title="Refills by Machine" subtitle={`${data.range.from.slice(0, 10)} to ${data.range.to.slice(0, 10)}`}>
              <DataTable
                columns={[
                  { key: 'name', label: 'Machine' },
                  { key: 'refillQty', label: 'Refill Qty', align: 'right' },
                  { key: 'refillEvents', label: 'Refill Events', align: 'right' },
                  { key: 'activeDays', label: 'Active Days', align: 'right' },
                ]}
                rows={data.refillsByMachine.slice(0, limit)}
              />
            </Card>

            <Card title="Refills by Item" subtitle={`${data.range.from.slice(0, 10)} to ${data.range.to.slice(0, 10)}`}>
              <DataTable
                columns={[
                  { key: 'name', label: 'Item' },
                  { key: 'refillQty', label: 'Refill Qty', align: 'right' },
                  { key: 'refillEvents', label: 'Refill Events', align: 'right' },
                  { key: 'activeDays', label: 'Active Days', align: 'right' },
                ]}
                rows={data.refillsByItem.slice(0, limit)}
              />
            </Card>
          </div>

          <Card title="Refill Regularity by Machine" subtitle={`${data.range.from.slice(0, 10)} to ${data.range.to.slice(0, 10)}`}>
            <DataTable
              columns={[
                { key: 'machine', label: 'Machine' },
                { key: 'events', label: 'Events', align: 'right' },
                { key: 'weeksActive', label: 'Weeks Active', align: 'right' },
                { key: 'weeksWithRefill', label: 'Weeks with Refill', align: 'right' },
                { key: 'regularityScorePct', label: 'Regularity Score', align: 'right' },
              ]}
              rows={data.refillRegularity.map((r) => ({ ...r, regularityScorePct: `${r.regularityScorePct}%` }))}
            />
          </Card>

          <div className="flex justify-end">
            <button
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              onClick={() => api.createExport('SUPPLIER_ANALYSIS', { supplierId: data.supplier.id, from, to })}
            >
              Export this view to CSV
            </button>
          </div>
        </>
      )}

      {!data && !loading && canLoad === false && (
        <p className="py-16 text-center text-sm text-neutral-400">Select a supplier to view analysis.</p>
      )}
    </div>
  );
}
