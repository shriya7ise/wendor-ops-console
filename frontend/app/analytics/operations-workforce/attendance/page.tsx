'use client';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable } from '@/components/ui/DataTable';
import { FilterBar, DateField } from '@/components/ui/FilterBar';
import { useDateRange } from '@/lib/useDateRange';
import { api } from '@/lib/api';

export default function AttendanceAnalyticsPage() {
  const { from, setFrom, to, setTo } = useDateRange(30);
  const [data, setData] = useState<any>(null);

  useEffect(() => { api.getOrgAttendance({ from, to }).then(setData); }, [from, to]);

  return (
    <div className="page-shell">
      <h1 className="page-title">Attendance Analytics</h1>
      <FilterBar><DateField label="From" value={from} onChange={setFrom} /><DateField label="To" value={to} onChange={setTo} /></FilterBar>
      {data && (
        <>
          <div className="grid grid-cols-2 gap-4"><StatCard label="Total Check-ins" value={data.presentDays} /><StatCard label="Unique Employees" value={data.activeUsers} /></div>
          <Card title="Attendance Trend">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data.attendanceTrend}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="label" fontSize={11} /><YAxis fontSize={11} allowDecimals={false} /><Tooltip /><Line type="monotone" dataKey="value" stroke="#dc2626" strokeWidth={2} dot={false} /></LineChart>
            </ResponsiveContainer>
          </Card>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card title="Worst Late Arrivals"><DataTable columns={[{ key: 'name', label: 'Employee' }, { key: 'value', label: 'Late Count', align: 'right' }]} rows={data.worstByLateCheckins ?? []} /></Card>
            <Card title="Cluster / Site Summary"><DataTable columns={[{ key: 'name', label: 'Cluster' }, { key: 'value', label: 'Check-ins', align: 'right' }]} rows={data.clusterSummary ?? []} /></Card>
          </div>
        </>
      )}
    </div>
  );
}