'use client';
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { FilterBar, DateField, SelectField } from '@/components/ui/FilterBar';
import { useDateRange } from '@/lib/useDateRange';
import { api } from '@/lib/api';

const STATUS_COLORS: Record<string, string> = { ONLINE: '#16a34a', OFFLINE: '#dc2626', MAINTENANCE: '#d97706' };
const STATE_COLORS = ['#16a34a', '#2563eb', '#d97706', '#a3a3a3'];

function Donut({ data, colors }: { data: { name: string; value: number }[]; colors: string[] | Record<string, string> }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
          {data.map((d, i) => (
            <Cell key={d.name} fill={Array.isArray(colors) ? colors[i % colors.length] : colors[d.name] ?? '#a3a3a3'} />
          ))}
        </Pie>
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

// Analytics > Operations & Workforce > Fleet Dashboard (1.9.9)
// Rebuilt to spec: From/To + Ranking limit + Threshold + Sales metric
// filters; Total/Activated/Running/Offline/Recently Alive cards; Status +
// State donut charts; Top/Worst clusters, warehouses, and machines ranked by
// sales/refills; a fuller machine drilldown table. Previously had none of
// the filters, a mismatched card set, no donuts, and only two unranked
// tables — see gap-closure doc.
export default function FleetDashboardPage() {
  const { from, setFrom, to, setTo } = useDateRange(30);
  const [limit, setLimit] = useState('5');
  const [thresholdHours, setThresholdHours] = useState('48');
  const [salesMetric, setSalesMetric] = useState<'revenue' | 'quantity'>('revenue');
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.getFleetDashboard({ from, to, limit, thresholdHours, salesMetric }).then(setData);
  }, [from, to, limit, thresholdHours, salesMetric]);

  return (
    <div className="page-shell">
      <div>
        <h1 className="page-title">Fleet Dashboard</h1>
        <p className="text-sm text-neutral-500">Fleet health, activity state, and sales/refill rankings across clusters, warehouses, and machines.</p>
      </div>

      <FilterBar>
        <DateField label="From" value={from} onChange={setFrom} />
        <DateField label="To" value={to} onChange={setTo} />
        <SelectField
          label="Ranking Limit"
          value={limit}
          onChange={setLimit}
          options={[3, 5, 10, 20].map((n) => ({ value: String(n), label: `Top ${n}` }))}
        />
        <SelectField
          label="Recently Alive Threshold"
          value={thresholdHours}
          onChange={setThresholdHours}
          options={[
            { value: '24', label: 'Last 24h' },
            { value: '48', label: 'Last 48h' },
            { value: '168', label: 'Last 7d' },
          ]}
        />
        <SelectField
          label="Sales Metric"
          value={salesMetric}
          onChange={(v) => setSalesMetric(v as 'revenue' | 'quantity')}
          options={[
            { value: 'revenue', label: 'Revenue' },
            { value: 'quantity', label: 'Units Sold' },
          ]}
        />
      </FilterBar>

      {data && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            <StatCard label="Total Machines" value={data.totalMachines} />
            <StatCard label="Activated" value={data.activated} />
            <StatCard label="Running" value={data.running} deltaTone="up" />
            <StatCard label="Offline" value={data.offline} deltaTone={data.offline > 0 ? 'down' : 'flat'} />
            <StatCard label="Recently Alive" value={data.recentlyAlive} />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card title="Status Breakdown">
              <Donut data={data.statusBreakdown.map((s: any) => ({ name: s.status, value: s.count }))} colors={STATUS_COLORS} />
            </Card>
            <Card title="State Breakdown" subtitle="Activity-derived, not raw connectivity status">
              <Donut data={data.stateBreakdown.map((s: any) => ({ name: s.state, value: s.count }))} colors={STATE_COLORS} />
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card title={`Top Clusters by ${salesMetric === 'revenue' ? 'Revenue' : 'Units Sold'}`}>
              <DataTable columns={[{ key: 'name', label: 'Cluster' }, { key: 'value', label: salesMetric === 'revenue' ? 'Revenue' : 'Units', align: 'right' }]} rows={data.topClustersBySales} />
            </Card>
            <Card title={`Worst Clusters by ${salesMetric === 'revenue' ? 'Revenue' : 'Units Sold'}`}>
              <DataTable columns={[{ key: 'name', label: 'Cluster' }, { key: 'value', label: salesMetric === 'revenue' ? 'Revenue' : 'Units', align: 'right' }]} rows={data.worstClustersBySales} />
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card title="Top Warehouses by Refills">
              <DataTable columns={[{ key: 'name', label: 'Warehouse' }, { key: 'value', label: 'Refill Qty', align: 'right' }]} rows={data.topWarehousesByRefills} />
            </Card>
            <Card title="Worst Warehouses by Refills">
              <DataTable columns={[{ key: 'name', label: 'Warehouse' }, { key: 'value', label: 'Refill Qty', align: 'right' }]} rows={data.worstWarehousesByRefills} />
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card title={`Top Machines by ${salesMetric === 'revenue' ? 'Revenue' : 'Units Sold'}`}>
              <DataTable columns={[{ key: 'name', label: 'Machine' }, { key: 'value', label: salesMetric === 'revenue' ? 'Revenue' : 'Units', align: 'right' }]} rows={data.topMachinesBySales} />
            </Card>
            <Card title={`Worst Machines by ${salesMetric === 'revenue' ? 'Revenue' : 'Units Sold'}`}>
              <DataTable columns={[{ key: 'name', label: 'Machine' }, { key: 'value', label: salesMetric === 'revenue' ? 'Revenue' : 'Units', align: 'right' }]} rows={data.worstMachinesBySales} />
            </Card>
          </div>

          <Card title="Machine Drilldown" subtitle={`${data.drilldown.length} machines`}>
            <DataTable
              columns={[
                { key: 'name', label: 'Machine' },
                { key: 'code', label: 'Code' },
                { key: 'cluster', label: 'Cluster' },
                { key: 'status', label: 'Status' },
                { key: 'state', label: 'State' },
                { key: 'sales', label: salesMetric === 'revenue' ? 'Revenue' : 'Units', align: 'right' },
                { key: 'refillQty', label: 'Refill Qty', align: 'right' },
              ]}
              rows={data.drilldown.map((m: any) => ({
                ...m,
                status: <Badge tone={m.status === 'OFFLINE' ? 'critical' : m.status === 'MAINTENANCE' ? 'warning' : 'info'}>{m.status}</Badge>,
              }))}
              emptyLabel="No machines found."
            />
          </Card>
        </>
      )}
    </div>
  );
}