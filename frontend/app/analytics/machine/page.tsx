'use client';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { useDateRange } from '@/lib/useDateRange';
import { api } from '@/lib/api';

export default function MachineAnalyticsPage() {
  const { from, to } = useDateRange();
  const [term, setTerm] = useState('');
  const [machineId, setMachineId] = useState('');
  const [options, setOptions] = useState<any[]>([]);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!term) { setOptions([]); return; }
    const h = setTimeout(() => api.searchMachines(term).then((r: any) => setOptions(r)), 250);
    return () => clearTimeout(h);
  }, [term]);

  useEffect(() => {
    if (!machineId && !term) return;
    setError(null);
    api.getMachineAnalytics({ machineId: machineId || undefined, machine: machineId ? undefined : term, from, to }).then(setData).catch((e) => setError(e.message));
  }, [machineId, from, to]);

  return (
    <div className="page-shell">
      <h1 className="page-title">Machine Analytics</h1>
      <Card title="Select a machine">
        <div className="relative max-w-sm">
          <input className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" placeholder="Search by name, code, status..." value={term} onChange={(e) => { setTerm(e.target.value); setMachineId(''); }} />
          {options.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full rounded-lg border border-neutral-200 bg-white shadow-lg">
              {options.map((o) => <li key={o.id} className="cursor-pointer px-3 py-2 text-sm hover:bg-neutral-50" onMouseDown={() => { setMachineId(o.id); setTerm(o.name); setOptions([]); }}>{o.name} <span className="text-neutral-400">({o.code})</span></li>)}
            </ul>
          )}
        </div>
      </Card>
      {error && <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{error}</div>}
      {data && (
        <>
          <div className="flex items-center gap-2"><h2 className="text-lg font-semibold">{data.machine.name}</h2><Badge tone={data.machine.status === 'ONLINE' ? 'A' : 'D'}>{data.machine.status}</Badge></div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Sales Revenue" value={`₹${data.salesRevenue.toLocaleString()}`} />
            <StatCard label="Units Sold" value={data.unitsSold} />
            <StatCard label="Refill Qty" value={data.refillQty} />
            <StatCard label="Failures" value={data.failureCount} deltaTone={data.failureCount > 0 ? 'down' : 'up'} />
          </div>
          <Card title="Analytics Overview (Sales)"><ResponsiveContainer width="100%" height={220}><LineChart data={data.analyticsOverview}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="label" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Line type="monotone" dataKey="value" stroke="#dc2626" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></Card>
          <Card title="Refill Trend"><ResponsiveContainer width="100%" height={220}><LineChart data={data.refillTrend}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="label" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></Card>
          <Card title="Temperature Analytics"><p className="py-6 text-center text-sm text-neutral-400">{data.temperatureAnalytics.message}</p></Card>
        </>
      )}
      {!data && !error && <p className="py-16 text-center text-sm text-neutral-400">Select a machine to view analytics.</p>}
    </div>
  );
}
