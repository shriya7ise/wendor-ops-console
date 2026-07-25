'use client';
import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable } from '@/components/ui/DataTable';
import { FilterBar, DateField, SelectField } from '@/components/ui/FilterBar';
import { useDateRange } from '@/lib/useDateRange';
import { api } from '@/lib/api';

// Step 4 (1.9.2): Day-wise / Hour-wise drill-down modes, toggled off the
// same dataset the backend already returns (dayWiseTrend / hourWiseTrend).
type DrillMode = 'day' | 'hour';

export default function SalesAnalyticsPage() {
  const { from, setFrom, to, setTo, granularity, setGranularity } = useDateRange();
  const [data, setData] = useState<any>(null);
  const [drillMode, setDrillMode] = useState<DrillMode>('day');

  useEffect(() => { api.getSalesAnalytics({ from, to, granularity }).then(setData); }, [from, to, granularity]);

  return (
    <div className="page-shell">
      <h1 className="page-title">Sales Analytics</h1>
      <FilterBar>
        <DateField label="From" value={from} onChange={setFrom} />
        <DateField label="To" value={to} onChange={setTo} />
        <SelectField label="Granularity" value={granularity} onChange={(v) => setGranularity(v as any)} options={[{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }]} />
      </FilterBar>
      {data && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
            <StatCard label="Total Revenue" value={`₹${data.totalRevenue.toLocaleString()}`} />
            <StatCard label="Total Units" value={data.totalUnits} />
          </div>
          <Card title="Revenue Trend" subtitle={`${from} to ${to} (${granularity})`}>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={data.revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#dc2626" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
          <Card
            title="Revenue Drill-down"
            subtitle="Same date range, viewed by day or by hour of day"
            action={
              <div className="flex gap-1 text-xs">
                <button
                  onClick={() => setDrillMode('day')}
                  className={`rounded px-2 py-1 ${drillMode === 'day' ? 'bg-amber-100 text-amber-800 font-medium' : 'text-neutral-500 hover:bg-neutral-100'}`}
                >
                  Day-wise
                </button>
                <button
                  onClick={() => setDrillMode('hour')}
                  className={`rounded px-2 py-1 ${drillMode === 'hour' ? 'bg-amber-100 text-amber-800 font-medium' : 'text-neutral-500 hover:bg-neutral-100'}`}
                >
                  Hour-wise
                </button>
              </div>
            }
          >
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={drillMode === 'day' ? data.dayWiseTrend : data.hourWiseTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" fontSize={11} interval={drillMode === 'hour' ? 2 : 'preserveStartEnd'} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Bar dataKey="value" fill="#dc2626" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card title="Revenue by Payment Method">
            <DataTable columns={[{ key: 'method', label: 'Method' }, { key: 'revenue', label: 'Revenue', align: 'right' }]} rows={data.paymentMethodBreakdown.map((r: any) => ({ ...r, revenue: `₹${r.revenue.toLocaleString()}` }))} />
          </Card>
        </>
      )}
    </div>
  );
}
