'use client';
import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { FilterBar, DateField, SelectField } from '@/components/ui/FilterBar';
import { useDateRange } from '@/lib/useDateRange';
import { api } from '@/lib/api';

// Analytics > Entity Analysis > Brand Analysis (1.9.16)
// Was roughly half the spec's widget list — no Granularity/Limit/Warehouse/
// Cluster/Machine filters, no Top Items/Machines by Sales or Sales by
// Cluster, no dedicated Refill Trend, and the whole Supply section
// (PO/Receipts by Warehouse, PO vs. Receipts Trend) and Stockout Signals
// were missing entirely. Rebuilt to spec below.
export default function BrandAnalysisPage() {
  const { from, setFrom, to, setTo, granularity, setGranularity } = useDateRange();
  const [term, setTerm] = useState('');
  const [brandId, setBrandId] = useState('');
  const [options, setOptions] = useState<any[]>([]);

  const [limit, setLimit] = useState('5');
  const [warehouseId, setWarehouseId] = useState('');
  const [warehouses, setWarehouses] = useState<{ id: string; name: string }[]>([]);
  const [clusterId, setClusterId] = useState('');
  const [clusters, setClusters] = useState<{ id: string; name: string }[]>([]);
  const [machineQuery, setMachineQuery] = useState('');
  const [machineOptions, setMachineOptions] = useState<{ id: string; name: string; code: string | null }[]>([]);
  const [machineId, setMachineId] = useState('');
  const [machineLabel, setMachineLabel] = useState('');

  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.listBrandWarehouses().then((r: any) => setWarehouses(r));
    api.getClusters().then((r: any) => setClusters(r));
  }, []);

  useEffect(() => {
    if (!term) { setOptions([]); return; }
    const h = setTimeout(() => api.searchBrands(term).then((r: any) => setOptions(r)), 250);
    return () => clearTimeout(h);
  }, [term]);

  useEffect(() => {
    if (machineQuery.trim().length < 2) { setMachineOptions([]); return; }
    const t = setTimeout(() => api.searchMachines(machineQuery).then((r: any) => setMachineOptions(r)), 250);
    return () => clearTimeout(t);
  }, [machineQuery]);

  useEffect(() => {
    if (!brandId && !term) return;
    setError(null);
    api
      .getBrandAnalysis({
        brandId: brandId || undefined,
        brand: brandId ? undefined : term,
        from,
        to,
        granularity,
        limit,
        warehouseId: warehouseId || undefined,
        clusterId: clusterId || undefined,
        machineId: machineId || undefined,
      })
      .then(setData)
      .catch((e) => setError(e.message));
  }, [brandId, from, to, granularity, limit, warehouseId, clusterId, machineId]);

  return (
    <div className="page-shell">
      <h1 className="page-title">Brand Analysis</h1>
      <Card title="Brand">
        <div className="relative max-w-sm">
          <input className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" placeholder="Search brand" value={term} onChange={(e) => { setTerm(e.target.value); setBrandId(''); }} />
          {options.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full rounded-lg border border-neutral-200 bg-white shadow-lg">
              {options.map((o) => <li key={o.id} className="cursor-pointer px-3 py-2 text-sm hover:bg-neutral-50" onMouseDown={() => { setBrandId(o.id); setTerm(o.name); setOptions([]); }}>{o.name}</li>)}
            </ul>
          )}
        </div>
      </Card>

      {(brandId || term) && (
        <FilterBar>
          <DateField label="From" value={from} onChange={setFrom} />
          <DateField label="To" value={to} onChange={setTo} />
          <SelectField
            label="Granularity"
            value={granularity}
            onChange={(v) => setGranularity(v as any)}
            options={[{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }]}
          />
          <SelectField
            label="Limit"
            value={limit}
            onChange={setLimit}
            options={[3, 5, 10, 20].map((n) => ({ value: String(n), label: `Top ${n}` }))}
          />
          <SelectField
            label="Warehouse"
            value={warehouseId}
            onChange={setWarehouseId}
            options={[{ value: '', label: 'All Warehouses' }, ...warehouses.map((w) => ({ value: w.id, label: w.name }))]}
          />
          <SelectField
            label="Cluster"
            value={clusterId}
            onChange={setClusterId}
            options={[{ value: '', label: 'All Clusters' }, ...clusters.map((c) => ({ value: c.id, label: c.name }))]}
          />
          <div className="relative">
            <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.06em] text-neutral-500">Machine</label>
            <input
              type="text"
              placeholder="Search machine…"
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-amber-500"
              value={machineId ? machineLabel : machineQuery}
              onChange={(e) => { setMachineQuery(e.target.value); setMachineId(''); }}
            />
            {machineOptions.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full rounded-lg border border-neutral-200 bg-white shadow-card">
                {machineOptions.map((m) => (
                  <li key={m.id}>
                    <button type="button" className="block w-full px-3 py-2 text-left text-sm hover:bg-neutral-50" onMouseDown={() => { setMachineId(m.id); setMachineLabel(m.name); setMachineOptions([]); }}>
                      {m.name} {m.code && <span className="text-neutral-400">· {m.code}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </FilterBar>
      )}

      {error && <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{error}</div>}

      {data && (
        <>
          <h2 className="text-lg font-semibold">{data.brand.name} <span className="text-sm font-normal text-neutral-500">· {data.brand.productCount} products</span></h2>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <StatCard label="Revenue" value={`₹${data.revenue.toLocaleString()}`} />
            <StatCard label="Units Sold" value={data.unitsSold} />
            <StatCard label="Refill Qty" value={data.refillQty} />
            <StatCard label="Active Machines" value={data.activeMachines} />
            <StatCard label="Active Clusters" value={data.activeClusters} />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Ordered Qty" value={data.orderedQty} />
            <StatCard label="Ordered Value" value={`₹${data.orderedValue.toLocaleString()}`} />
            <StatCard label="Received Qty" value={data.receivedQty} />
            <StatCard label="Received Value" value={`₹${data.receivedValue.toLocaleString()}`} />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card title="Sales Trend">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data.salesTrend}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="label" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Line type="monotone" dataKey="value" stroke="#dc2626" strokeWidth={2} dot={false} /></LineChart>
              </ResponsiveContainer>
            </Card>
            <Card title="Refill Trend">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data.refillTrend}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="label" fontSize={11} /><YAxis fontSize={11} allowDecimals={false} /><Tooltip /><Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={false} /></LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card title="Top Items by Sales"><DataTable columns={[{ key: 'name', label: 'Item' }, { key: 'value', label: 'Revenue', align: 'right' }]} rows={data.topItemsBySales} /></Card>
            <Card title="Top Machines by Sales"><DataTable columns={[{ key: 'name', label: 'Machine' }, { key: 'value', label: 'Revenue', align: 'right' }]} rows={data.topMachinesBySales} /></Card>
            <Card title="Sales by Cluster"><DataTable columns={[{ key: 'name', label: 'Cluster' }, { key: 'value', label: 'Revenue', align: 'right' }]} rows={data.salesByCluster} /></Card>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card title="Refills by Machine"><DataTable columns={[{ key: 'name', label: 'Machine' }, { key: 'value', label: 'Refill Qty', align: 'right' }]} rows={data.refillsByMachine} /></Card>
            <Card title="Refills by Item"><DataTable columns={[{ key: 'name', label: 'Item' }, { key: 'value', label: 'Refill Qty', align: 'right' }]} rows={data.refillsByItem} /></Card>
          </div>
          <Card title="Refill Regularity by Machine"><DataTable columns={[{ key: 'machine', label: 'Machine' }, { key: 'regularityScorePct', label: 'Regularity Score', align: 'right' }]} rows={data.refillRegularityByMachine.map((r: any) => ({ ...r, regularityScorePct: `${r.regularityScorePct}%` }))} /></Card>

          <div>
            <h3 className="mb-3 font-display text-sm font-semibold text-neutral-900">Supply</h3>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card title="PO Ordered by Warehouse"><DataTable columns={[{ key: 'name', label: 'Warehouse' }, { key: 'value', label: 'Ordered Qty', align: 'right' }]} rows={data.supply.poOrderedByWarehouse} /></Card>
              <Card title="Receipts by Warehouse"><DataTable columns={[{ key: 'name', label: 'Warehouse' }, { key: 'value', label: 'Received Qty', align: 'right' }]} rows={data.supply.poReceiptsByWarehouse} /></Card>
            </div>
            <div className="mt-6">
              <Card title="PO vs. Receipts Trend">
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={data.supply.poVsReceiptsTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="label" fontSize={11} />
                    <YAxis fontSize={11} allowDecimals={false} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="ordered" fill="#a3a3a3" name="Ordered" />
                    <Bar dataKey="received" fill="#16a34a" name="Received" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </div>

          <Card title="Stockout Signals" subtitle={`${data.stockoutSignals.length} product/warehouse pairs at Low or Out`}>
            <DataTable
              columns={[
                { key: 'product', label: 'Product' },
                { key: 'warehouse', label: 'Warehouse' },
                { key: 'onHand', label: 'On Hand', align: 'right' },
                { key: 'allocated', label: 'Allocated', align: 'right' },
                { key: 'available', label: 'Available', align: 'right' },
                { key: 'threshold', label: 'Threshold', align: 'right' },
                { key: 'severity', label: 'Severity' },
              ]}
              rows={data.stockoutSignals.map((s: any) => ({ ...s, severity: <Badge tone={s.severity === 'OUT' ? 'critical' : 'warning'}>{s.severity}</Badge> }))}
              emptyLabel="No low-stock or out-of-stock products for this brand right now."
            />
          </Card>
        </>
      )}
      {!data && !error && <p className="py-16 text-center text-sm text-neutral-400">Search for a brand to view analysis.</p>}
    </div>
  );
}