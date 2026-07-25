'use client';
import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable } from '@/components/ui/DataTable';
import { FilterBar, DateField, SelectField } from '@/components/ui/FilterBar';
import { useDateRange } from '@/lib/useDateRange';
import { api } from '@/lib/api';

export default function RefillOperationsPage() {
  const { from, setFrom, to, setTo, granularity, setGranularity } = useDateRange();
  const [data, setData] = useState<any>(null);

  useEffect(() => { api.getRefillOperations({ from, to, granularity, limit: 10 }).then(setData); }, [from, to, granularity]);

  return (
    <div className="page-shell">
      <h1 className="page-title">Refill Operations</h1>
      <FilterBar>
        <DateField label="From" value={from} onChange={setFrom} /><DateField label="To" value={to} onChange={setTo} />
        <SelectField label="Granularity" value={granularity} onChange={(v) => setGranularity(v as any)} options={[{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }]} />
      </FilterBar>
      {data && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Total Refill Qty" value={data.totalRefillQty} />
            <StatCard label="Total Refill Events" value={data.totalRefillEvents} />
            <StatCard label="Unique Refillers" value={data.uniqueRefillers} />
            <StatCard label="Unique Machines Refilled" value={data.uniqueMachinesRefilled} />
          </div>
          <Card title="Refill Trend">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data.refillTrend}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="label" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Line type="monotone" dataKey="value" stroke="#dc2626" strokeWidth={2} dot={false} /></LineChart>
            </ResponsiveContainer>
          </Card>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card title="Top Machines by Refill"><DataTable columns={[{ key: 'name', label: 'Machine' }, { key: 'value', label: 'Qty', align: 'right' }]} rows={data.topMachinesByRefill} /></Card>
            <Card title="Top Items by Refill"><DataTable columns={[{ key: 'name', label: 'Item' }, { key: 'value', label: 'Qty', align: 'right' }]} rows={data.topItemsByRefill} /></Card>
            <Card title="Top Warehouses"><DataTable columns={[{ key: 'name', label: 'Warehouse' }, { key: 'value', label: 'Qty', align: 'right' }]} rows={data.topWarehousesByRefill} /></Card>
          </div>
          <Card title="Regularity Leaderboard">
            <DataTable
              columns={[{ key: 'name', label: 'Refiller' }, { key: 'refillEvents', label: 'Refill Events', align: 'right' }, { key: 'regularityScorePct', label: 'Regularity Score', align: 'right' }]}
              rows={data.regularityLeaderboard.map((r: any) => ({ ...r, regularityScorePct: `${r.regularityScorePct}%` }))}
            />
          </Card>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card title="Time of Day">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data.timeOfDay}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="label" fontSize={10} interval={2} /><YAxis fontSize={11} allowDecimals={false} /><Tooltip /><Bar dataKey="value" fill="#dc2626" /></BarChart>
              </ResponsiveContainer>
            </Card>
            <Card title="Day of Week">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data.dayOfWeek}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="label" fontSize={11} /><YAxis fontSize={11} allowDecimals={false} /><Tooltip /><Bar dataKey="value" fill="#dc2626" /></BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
