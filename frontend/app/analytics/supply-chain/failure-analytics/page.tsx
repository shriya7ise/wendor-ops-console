'use client';
import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable } from '@/components/ui/DataTable';
import { FilterBar, DateField, SelectField } from '@/components/ui/FilterBar';
import { useDateRange } from '@/lib/useDateRange';
import { api } from '@/lib/api';

const TIME_OF_DAY_OPTIONS = [
  { value: '', label: 'All Day' },
  { value: '6-11', label: 'Morning (6–11)' },
  { value: '12-16', label: 'Afternoon (12–16)' },
  { value: '17-21', label: 'Evening (17–21)' },
  { value: '22-5', label: 'Overnight (22–5)' },
];

const TABS = ['Analytics', 'Machines', 'Slots'] as const;

// Analytics > Supply Chain > Failure Analytics (1.9.14)
// Previously: date-range filter only, no tabs, and a card set that didn't
// match spec (Total Failures/Unresolved/Avg Resolution instead of Total
// Failures/Failure Rate/Lost Revenue/Affected Machines), no Slot vs.
// Failures chart. Rebuilt with Machines/Cluster/time-of-day filters and the
// Analytics/Machines/Slots tab structure the spec calls for.
export default function FailureAnalyticsPage() {
  const { from, setFrom, to, setTo, granularity, setGranularity } = useDateRange();
  const [clusterId, setClusterId] = useState('');
  const [clusters, setClusters] = useState<{ id: string; name: string }[]>([]);
  const [machineQuery, setMachineQuery] = useState('');
  const [machineOptions, setMachineOptions] = useState<{ id: string; name: string; code: string | null }[]>([]);
  const [machineId, setMachineId] = useState('');
  const [machineLabel, setMachineLabel] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('');
  const [tab, setTab] = useState<(typeof TABS)[number]>('Analytics');
  const [data, setData] = useState<any>(null);

  useEffect(() => { api.getClusters().then((r: any) => setClusters(r)); }, []);

  useEffect(() => {
    if (machineQuery.trim().length < 2) { setMachineOptions([]); return; }
    const t = setTimeout(() => api.searchMachines(machineQuery).then((r: any) => setMachineOptions(r)), 250);
    return () => clearTimeout(t);
  }, [machineQuery]);

  useEffect(() => {
    const [hourFrom, hourTo] = timeOfDay ? timeOfDay.split('-') : [undefined, undefined];
    api
      .getFailureAnalytics({
        from,
        to,
        granularity,
        limit: 10,
        clusterId: clusterId || undefined,
        machineId: machineId || undefined,
        hourFrom,
        hourTo,
      })
      .then(setData);
  }, [from, to, granularity, clusterId, machineId, timeOfDay]);

  return (
    <div className="page-shell">
      <h1 className="page-title">Failure Analytics</h1>

      <FilterBar>
        <DateField label="From" value={from} onChange={setFrom} />
        <DateField label="To" value={to} onChange={setTo} />
        <SelectField
          label="Cluster"
          value={clusterId}
          onChange={setClusterId}
          options={[{ value: '', label: 'All Clusters' }, ...clusters.map((c) => ({ value: c.id, label: c.name }))]}
        />
        <SelectField label="Time of Day" value={timeOfDay} onChange={setTimeOfDay} options={TIME_OF_DAY_OPTIONS} />
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

      {data && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Total Failures" value={data.totalFailures} />
            <StatCard label="Failure Rate" value={`${data.failureRatePct}%`} deltaTone={data.failureRatePct > 5 ? 'down' : 'flat'} />
            <StatCard label="Lost Revenue" value={`₹${data.lostRevenue.toLocaleString()}`} deltaTone={data.lostRevenue > 0 ? 'down' : 'flat'} />
            <StatCard label="Affected Machines" value={data.affectedMachines} />
          </div>

          <div className="flex gap-1 border-b border-neutral-200">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`px-4 py-2 font-mono text-[11px] uppercase tracking-[0.06em] transition-colors ${
                  tab === t ? 'border-b-2 border-amber-600 text-amber-700' : 'text-neutral-400 hover:text-neutral-600'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === 'Analytics' && (
            <>
              <Card title="Failure Trend">
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={data.failureTrend}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="label" fontSize={11} /><YAxis fontSize={11} allowDecimals={false} /><Tooltip /><Line type="monotone" dataKey="value" stroke="#dc2626" strokeWidth={2} dot={false} /></LineChart>
                </ResponsiveContainer>
              </Card>
              <Card title="Slot vs. Failures">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={data.slotVsFailures}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="slot" fontSize={11} /><YAxis fontSize={11} allowDecimals={false} /><Tooltip /><Bar dataKey="count" fill="#dc2626" name="Failures" /></BarChart>
                </ResponsiveContainer>
              </Card>
              <Card title="Unreliable Machines" subtitle="Ranked by lost revenue, not just failure count">
                <DataTable
                  columns={[
                    { key: 'name', label: 'Machine' },
                    { key: 'failures', label: 'Failures', align: 'right' },
                    { key: 'lostRevenue', label: 'Lost Revenue', align: 'right' },
                    { key: 'avgResolutionHours', label: 'Avg Resolution (hrs)', align: 'right' },
                  ]}
                  rows={data.unreliableMachines.map((m: any) => ({ ...m, lostRevenue: `₹${m.lostRevenue.toLocaleString()}`, avgResolutionHours: m.avgResolutionHours ?? '—' }))}
                />
              </Card>
            </>
          )}

          {tab === 'Machines' && (
            <Card title="Machines" subtitle={`${data.machinesTab.length} machines with failures in range`}>
              <DataTable
                columns={[
                  { key: 'name', label: 'Machine' },
                  { key: 'failures', label: 'Failures', align: 'right' },
                  { key: 'lostRevenue', label: 'Lost Revenue', align: 'right' },
                  { key: 'avgResolutionHours', label: 'Avg Resolution (hrs)', align: 'right' },
                ]}
                rows={data.machinesTab.map((m: any) => ({ ...m, lostRevenue: `₹${m.lostRevenue.toLocaleString()}`, avgResolutionHours: m.avgResolutionHours ?? '—' }))}
                emptyLabel="No machine failures for this filter selection."
              />
            </Card>
          )}

          {tab === 'Slots' && (
            <Card title="Slots" subtitle={`${data.slotsTab.length} slots with failures in range`}>
              <DataTable
                columns={[
                  { key: 'slot', label: 'Slot' },
                  { key: 'failures', label: 'Failures', align: 'right' },
                  { key: 'lostRevenue', label: 'Lost Revenue', align: 'right' },
                ]}
                rows={data.slotsTab.map((s: any) => ({ ...s, lostRevenue: `₹${s.lostRevenue.toLocaleString()}` }))}
                emptyLabel="No slot-level failures for this filter selection."
              />
            </Card>
          )}
        </>
      )}
    </div>
  );
}