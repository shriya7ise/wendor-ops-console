'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable } from '@/components/ui/DataTable';
import { FilterBar, DateField, SelectField } from '@/components/ui/FilterBar';
import { useDateRange } from '@/lib/useDateRange';
import { api } from '@/lib/api';

type Cluster = {
  id: string;
  name: string;
};

export default function OrgAttendanceDisciplinePage() {
  const { from, setFrom, to, setTo } = useDateRange(30);

  const [clusterId, setClusterId] = useState('');
  const [lateThresholdHour, setLateThresholdHour] = useState('10');

  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchClusters = async () => {
      try {
        const result = await api.getClusters();

        if (Array.isArray(result)) {
          setClusters(result as Cluster[]);
        } else {
          setClusters([]);
        }
      } catch (err) {
        console.error('Failed to fetch clusters:', err);
        setClusters([]);
      }
    };

    fetchClusters();
  }, []);

  useEffect(() => {
    api
      .getOrgAttendance({
        from,
        to,
        clusterId: clusterId || undefined,
        lateThresholdHour,
      })
      .then(setData)
      .catch(console.error);
  }, [from, to, clusterId, lateThresholdHour]);

  const rankCols = (label: string, valueLabel: string) => [
    { key: 'name', label },
    { key: 'value', label: valueLabel, align: 'right' as const },
  ];

  return (
    <div className="page-shell">
      <div>
        <h1 className="page-title">Org Attendance &amp; Discipline</h1>
        <p className="text-sm text-neutral-500">
          Compliance rollup across the org — present/missed days, lateness,
          overtime, and cluster comparisons.
        </p>
      </div>

      <FilterBar>
        <DateField label="From" value={from} onChange={setFrom} />
        <DateField label="To" value={to} onChange={setTo} />

        <SelectField
          label="Cluster / Site"
          value={clusterId}
          onChange={setClusterId}
          options={[
            { value: '', label: 'All Clusters' },
            ...clusters.map((c) => ({
              value: c.id,
              label: c.name,
            })),
          ]}
        />

        <SelectField
          label="Late Threshold"
          value={lateThresholdHour}
          onChange={setLateThresholdHour}
          options={[9, 10, 11, 12].map((h) => ({
            value: String(h),
            label: `${h}:00`,
          }))}
        />
      </FilterBar>

      {data && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <StatCard label="Total Users" value={data.totalUsers} />
            <StatCard label="Active Users" value={data.activeUsers} />
            <StatCard label="Present Days" value={data.presentDays} />
            <StatCard
              label="Missed Days"
              value={data.missedDays}
              deltaTone={data.missedDays > 0 ? 'down' : 'up'}
            />
            <StatCard
              label="Late Check-ins"
              value={data.lateCheckIns}
              deltaTone={data.lateCheckIns > 0 ? 'down' : 'up'}
            />
            <StatCard
              label="Missed Check-outs"
              value={data.missedCheckOuts}
              deltaTone={data.missedCheckOuts > 0 ? 'down' : 'up'}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
            <StatCard
              label="Overtime Hours"
              value={data.overtimeHours}
            />
            <StatCard
              label="Avg Hours / Day"
              value={data.avgHoursPerDay}
            />
          </div>

          <Card title="Attendance Trend">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data.attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" fontSize={11} />
                <YAxis fontSize={11} allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#dc2626"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card title="Overtime — Top Members">
              <DataTable
                columns={rankCols('Employee', 'OT Hours')}
                rows={data.overtimeTopMembers}
              />
            </Card>

            <Card title="Cluster / Site Summary">
              <DataTable
                columns={rankCols('Cluster', 'Check-ins')}
                rows={data.clusterSummary}
              />
            </Card>
          </div>

          <div>
            <h2 className="mb-3 font-display text-[13px] font-semibold tracking-tight text-neutral-900">
              Worst
            </h2>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-4">
              <Card title="By Missed Days">
                <DataTable
                  columns={rankCols('Employee', 'Missed Days')}
                  rows={data.worstByMissedDays}
                />
              </Card>

              <Card title="By Late Check-ins">
                <DataTable
                  columns={rankCols('Employee', 'Late Count')}
                  rows={data.worstByLateCheckins}
                />
              </Card>

              <Card title="By Missed Check-out">
                <DataTable
                  columns={rankCols('Employee', 'Missed Count')}
                  rows={data.worstByMissedCheckout}
                />
              </Card>

              <Card title="By Lowest Hours">
                <DataTable
                  columns={rankCols('Employee', 'Avg Hours')}
                  rows={data.worstByLowestHours}
                />
              </Card>
            </div>
          </div>

          <div>
            <h2 className="mb-3 font-display text-[13px] font-semibold tracking-tight text-neutral-900">
              Best
            </h2>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card title="By Attendance">
                <DataTable
                  columns={rankCols('Employee', 'Present Days')}
                  rows={data.bestByAttendance}
                />
              </Card>

              <Card title="By Punctuality">
                <DataTable
                  columns={rankCols('Employee', '−Late Count')}
                  rows={data.bestByPunctuality}
                />
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}