'use client';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable } from '@/components/ui/DataTable';
import { useDateRange } from '@/lib/useDateRange';
import { api } from '@/lib/api';

export default function SingleItemAnalysisPage() {
  const { from, to } = useDateRange();
  const [term, setTerm] = useState('');
  const [itemId, setItemId] = useState('');
  const [options, setOptions] = useState<any[]>([]);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!term) { setOptions([]); return; }
    const h = setTimeout(() => api.searchItems(term).then((r: any) => setOptions(r)), 250);
    return () => clearTimeout(h);
  }, [term]);

  useEffect(() => {
    if (!itemId && !term) return;
    setError(null);
    api.getItemAnalysis({ productId: itemId || undefined, item: itemId ? undefined : term, from, to }).then(setData).catch((e) => setError(e.message));
  }, [itemId, from, to]);

  return (
    <div className="page-shell">
      <h1 className="page-title">Single Item Analysis</h1>
      <Card title="Filters">
        <div className="relative max-w-sm">
          <input className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" placeholder="Search item by name or SKU" value={term} onChange={(e) => { setTerm(e.target.value); setItemId(''); }} />
          {options.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full rounded-lg border border-neutral-200 bg-white shadow-lg">
              {options.map((o) => <li key={o.id} className="cursor-pointer px-3 py-2 text-sm hover:bg-neutral-50" onMouseDown={() => { setItemId(o.id); setTerm(o.name); setOptions([]); }}>{o.name} <span className="text-neutral-400">({o.sku})</span></li>)}
            </ul>
          )}
        </div>
      </Card>
      {error && <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{error}</div>}
      {data && (
        <>
          <h2 className="text-lg font-semibold">{data.item.name}</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Units Sold" value={data.unitsSold} />
            <StatCard label="Revenue" value={`₹${data.revenue.toLocaleString()}`} />
            <StatCard label="Refill Qty" value={data.refillQty} />
            <StatCard label="Active Machines" value={data.activeMachines} />
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card title="Sales Trend"><ResponsiveContainer width="100%" height={200}><LineChart data={data.salesTrend}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="label" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Line type="monotone" dataKey="value" stroke="#dc2626" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></Card>
            <Card title="Refill Trend"><ResponsiveContainer width="100%" height={200}><LineChart data={data.refillTrend}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="label" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></Card>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card title="Sales by Machine"><DataTable columns={[{ key: 'name', label: 'Machine' }, { key: 'value', label: 'Revenue', align: 'right' }]} rows={data.salesByMachine} /></Card>
            <Card title="Sales by Cluster"><DataTable columns={[{ key: 'name', label: 'Cluster' }, { key: 'value', label: 'Revenue', align: 'right' }]} rows={data.salesByCluster} /></Card>
          </div>
        </>
      )}
      {!data && !error && <p className="py-16 text-center text-sm text-neutral-400">Search for an item to view analysis.</p>}
    </div>
  );
}
