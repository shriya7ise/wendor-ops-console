'use client';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable } from '@/components/ui/DataTable';
import { FilterBar, DateField, SelectField } from '@/components/ui/FilterBar';
import { useDateRange } from '@/lib/useDateRange';
import { api } from '@/lib/api';

export default function OrgProcurementPage() {
  const { from, setFrom, to, setTo, granularity, setGranularity } = useDateRange();
  const [data, setData] = useState<any>(null);
  useEffect(() => { api.getOrgProcurement({ from, to, granularity, limit: 10 }).then(setData); }, [from, to, granularity]);

  return (
    <div className="page-shell">
      <h1 className="page-title">Org Procurement</h1>
      <FilterBar>
        <DateField label="From" value={from} onChange={setFrom} /><DateField label="To" value={to} onChange={setTo} />
        <SelectField label="Granularity" value={granularity} onChange={(v) => setGranularity(v as any)} options={[{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }]} />
      </FilterBar>
      {data && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="PO Count" value={data.poCount} />
            <StatCard label="Total Ordered Value" value={`₹${data.totalOrderedValue.toLocaleString()}`} />
            <StatCard label="Avg Approval Delay" value={data.avgApprovalDelayHours != null ? `${data.avgApprovalDelayHours}h` : '—'} />
            <StatCard label="Pending Approval" value={data.pendingApprovalCount} deltaTone={data.pendingApprovalCount > 0 ? 'down' : 'flat'} />
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card title="Procurement Value Trend"><ResponsiveContainer width="100%" height={220}><LineChart data={data.procurementValueTrend}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="label" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Line type="monotone" dataKey="value" stroke="#dc2626" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></Card>
            <Card title="Fill Rate Trend"><ResponsiveContainer width="100%" height={220}><LineChart data={data.fillRateTrend}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="label" fontSize={11} /><YAxis fontSize={11} unit="%" /><Tooltip /><Line type="monotone" dataKey="value" stroke="#dc2626" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></Card>
          </div>
          <Card title="Approval Delay Trend (hours)"><ResponsiveContainer width="100%" height={220}><LineChart data={data.approvalDelayTrend}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="label" fontSize={11} /><YAxis fontSize={11} unit="h" /><Tooltip /><Line type="monotone" dataKey="value" stroke="#dc2626" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></Card>
          <Card title="Top Suppliers by Value"><DataTable columns={[{ key: 'name', label: 'Supplier' }, { key: 'value', label: 'Ordered Value', align: 'right' }]} rows={data.topSuppliersByValue.map((r: any) => ({ ...r, value: `₹${r.value.toLocaleString()}` }))} /></Card>
        </>
      )}
    </div>
  );
}
