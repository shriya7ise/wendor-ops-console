'use client';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable } from '@/components/ui/DataTable';
import { FilterBar, DateField, SelectField } from '@/components/ui/FilterBar';
import { useDateRange } from '@/lib/useDateRange';
import { api } from '@/lib/api';

export default function BigSalesPage() {
  const { from, setFrom, to, setTo, granularity, setGranularity } = useDateRange();
  const [data, setData] = useState<any>(null);

  useEffect(() => { api.getBigSales({ from, to, granularity, limit: 20 }).then(setData); }, [from, to, granularity]);

  return (
    <div className="page-shell">
      <h1 className="page-title">Org Sales</h1>
      <FilterBar>
        <DateField label="From" value={from} onChange={setFrom} />
        <DateField label="To" value={to} onChange={setTo} />
        <SelectField label="Granularity" value={granularity} onChange={(v) => setGranularity(v as any)} options={[{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }]} />
      </FilterBar>
      {data && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Total Revenue" value={`₹${data.totalRevenue.toLocaleString()}`} deltaLabel={data.revenueGrowthPct !== null ? `${data.revenueGrowthPct}% vs prev` : undefined} deltaTone={data.revenueGrowthPct > 0 ? 'up' : 'down'} />
            <StatCard label="Total Units" value={data.totalUnits} />
            <StatCard label="Active Machines" value={data.activeMachines} />
            <StatCard label="PO Count" value={data.poCount ?? '—'} />
          </div>
          <Card title="Revenue & Units Trend" subtitle={`${from} to ${to} (${granularity})`}>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={data.revenueUnitsTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#dc2626" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="units" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card title="Top Machines"><DataTable columns={[{ key: 'name', label: 'Machine' }, { key: 'value', label: 'Revenue', align: 'right' }]} rows={data.topMachines.map((r: any) => ({ ...r, value: `₹${r.value.toLocaleString()}` }))} /></Card>
            <Card title="Worst Machines"><DataTable columns={[{ key: 'name', label: 'Machine' }, { key: 'value', label: 'Revenue', align: 'right' }]} rows={data.worstMachines.map((r: any) => ({ ...r, value: `₹${r.value.toLocaleString()}` }))} /></Card>
            <Card title="Top Clusters"><DataTable columns={[{ key: 'name', label: 'Cluster' }, { key: 'value', label: 'Revenue', align: 'right' }]} rows={data.topClusters.map((r: any) => ({ ...r, value: `₹${r.value.toLocaleString()}` }))} /></Card>
            <Card title="Worst Clusters"><DataTable columns={[{ key: 'name', label: 'Cluster' }, { key: 'value', label: 'Revenue', align: 'right' }]} rows={data.worstClusters.map((r: any) => ({ ...r, value: `₹${r.value.toLocaleString()}` }))} /></Card>
            <Card title="Top Products"><DataTable columns={[{ key: 'name', label: 'Product' }, { key: 'value', label: 'Revenue', align: 'right' }]} rows={data.topProducts.map((r: any) => ({ ...r, value: `₹${r.value.toLocaleString()}` }))} /></Card>
            <Card title="Worst Products"><DataTable columns={[{ key: 'name', label: 'Product' }, { key: 'value', label: 'Revenue', align: 'right' }]} rows={data.worstProducts.map((r: any) => ({ ...r, value: `₹${r.value.toLocaleString()}` }))} /></Card>
          </div>
        </>
      )}
    </div>
  );
}
