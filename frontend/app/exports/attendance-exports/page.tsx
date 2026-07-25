'use client';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';
import { FilterBar, DateField, SelectField } from '@/components/ui/FilterBar';
import { useDateRange } from '@/lib/useDateRange';
import { api } from '@/lib/api';
import type { ExportJob } from '@/lib/types';

const STATUS_KEY: { status: string; label: string }[] = [
  { status: 'ON_TIME', label: 'On Time' },
  { status: 'LATE_CHECKIN', label: 'Late Check-In' },
  { status: 'MISSED_CHECKOUT', label: 'Early / Missed Check-Out' },
  { status: 'OVERTIME', label: 'Overtime' },
  { status: 'PENDING', label: 'Pending' },
];

// Analytics & Reports > Attendance Exports (1.11)
// Previously only reachable as one generic export type on the "All
// Exports" screen. This is the dedicated page the spec calls for: color
// key, Cluster + date filters, two distinct export outputs (Attendance
// Sheet / Register Sheet), and its own history table.
export default function AttendanceExportsPage() {
  const { from, setFrom, to, setTo } = useDateRange(30);
  const [clusterId, setClusterId] = useState('');
  const [clusters, setClusters] = useState<{ id: string; name: string }[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [jobs, setJobs] = useState<ExportJob[]>([]);
  const [queuing, setQueuing] = useState<'sheet' | 'register' | null>(null);
  // Click a Status Color Key badge to filter the Preview table down to just
  // that status. Click the same badge again (or the count itself resets to
  // 0) to clear the filter and show everything again.
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
  api.getAttendanceExportClusters().then((data) => {
    setClusters(data as { id: string; name: string }[]);
  });
}, []);
  useEffect(() => {
    api.getAttendanceExportSummary({ from, to, clusterId: clusterId || undefined }).then(setSummary);
    setStatusFilter(null); // date/cluster changed — drop any stale status filter
  }, [from, to, clusterId]);

  async function refreshJobs() {
    const res: any = await api.listExports({ type: 'ATTENDANCE_EXPORT' });
    setJobs(res.items);
  }
  useEffect(() => { refreshJobs(); }, []);
  useEffect(() => {
    const hasInFlight = jobs.some((j) => j.status === 'PENDING' || j.status === 'PROCESSING');
    if (!hasInFlight) return;
    const t = setInterval(refreshJobs, 3000);
    return () => clearInterval(t);
  }, [jobs]);

  async function handleExport(variant: 'sheet' | 'register') {
    setQueuing(variant);
    try {
      await api.createExport('ATTENDANCE_EXPORT', { from, to, clusterId: clusterId || undefined, variant });
      await refreshJobs();
    } finally {
      setQueuing(null);
    }
  }

  const previewRows = summary?.rows ?? [];
  const filteredRows = statusFilter ? previewRows.filter((r: any) => r.status === statusFilter) : previewRows;

  return (
    <div className="page-shell">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Attendance Exports</h1>
          <p className="text-sm text-neutral-500">Dashboard &gt; Analytics &amp; Reports &gt; Attendance Exports</p>
        </div>
        <div className="flex gap-2">
          <button
            className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
            onClick={() => handleExport('register')}
            disabled={queuing !== null}
          >
            {queuing === 'register' ? 'Queuing…' : 'Register Sheet'}
          </button>
          <button
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            onClick={() => handleExport('sheet')}
            disabled={queuing !== null}
          >
            {queuing === 'sheet' ? 'Queuing…' : 'Export Attendance Sheet'}
          </button>
        </div>
      </div>

      <FilterBar>
        <DateField label="Start Date" value={from} onChange={setFrom} />
        <DateField label="End Date" value={to} onChange={setTo} />
        <SelectField
          label="Cluster"
          value={clusterId}
          onChange={setClusterId}
          options={[{ value: '', label: 'All Clusters' }, ...clusters.map((c) => ({ value: c.id, label: c.name }))]}
        />
      </FilterBar>

      <Card
        title="Status Color Key"
        subtitle={summary ? `${summary.totalRecords} records in range${statusFilter ? ' — filtered below' : ''}` : undefined}
      >
        <div className="flex flex-wrap gap-3">
          {STATUS_KEY.map((s) => {
            const count = summary?.statusCounts?.[s.status] ?? 0;
            const isActive = statusFilter === s.status;
            return (
              <button
                key={s.status}
                type="button"
                onClick={() => setStatusFilter(isActive ? null : s.status)}
                className={`flex items-center gap-2 rounded-lg px-1 py-0.5 transition ${
                  isActive ? 'ring-2 ring-offset-1 ring-neutral-400' : 'hover:opacity-80'
                }`}
                title={`Show only "${s.label}" records`}
              >
                <Badge tone={s.status}>{s.label}</Badge>
                <span className="font-mono text-xs text-neutral-400">{count}</span>
              </button>
            );
          })}
          {statusFilter && (
            <button
              type="button"
              onClick={() => setStatusFilter(null)}
              className="text-xs font-medium text-neutral-500 underline hover:text-neutral-700"
            >
              Clear filter
            </button>
          )}
        </div>
      </Card>

      {summary && (
        <Card
          title="Preview"
          subtitle={
            statusFilter
              ? `Showing ${filteredRows.length} of first ${previewRows.length} records matching "${STATUS_KEY.find((s) => s.status === statusFilter)?.label}" — the full range is included in the export`
              : 'First 50 records — the full range is included in the export'
          }
        >
          <DataTable
            columns={[
              { key: 'date', label: 'Date' },
              { key: 'employee', label: 'Employee' },
              { key: 'cluster', label: 'Cluster' },
              { key: 'hoursWorked', label: 'Hours', align: 'right' },
              { key: 'status', label: 'Status' },
            ]}
            rows={filteredRows.map((r: any) => ({
              ...r,
              hoursWorked: r.hoursWorked ?? '—',
              status: <Badge tone={r.status}>{STATUS_KEY.find((s) => s.status === r.status)?.label ?? r.status}</Badge>,
            }))}
            emptyLabel={
              statusFilter
                ? `No "${STATUS_KEY.find((s) => s.status === statusFilter)?.label}" records in the previewed rows.`
                : 'No attendance records for this filter selection.'
            }
          />
        </Card>
      )}

      <Card title="Export History" subtitle={`${jobs.length} export${jobs.length === 1 ? '' : 's'}`}>
        <DataTable
          columns={[
            { key: 'date', label: 'Date' },
            { key: 'user', label: 'User' },
            { key: 'status', label: 'Status' },
            { key: 'action', label: '', align: 'right' },
          ]}
          rows={jobs.map((j) => ({
            date: new Date(j.createdAt).toLocaleString(),
            user: j.requestedBy,
            status: <Badge tone={j.status}>{j.status}</Badge>,
            action:
              j.status === 'COMPLETED' ? (
                <a className="font-medium text-amber-700 hover:text-amber-800 hover:underline" href={api.downloadExportUrl(j.id)}>
                  Download
                </a>
              ) : j.status === 'FAILED' ? (
                <span className="text-xs text-red-500" title={j.errorMessage ?? ''}>Failed</span>
              ) : (
                <span className="text-xs text-neutral-400">Processing…</span>
              ),
          }))}
          emptyLabel="No attendance exports yet."
        />
      </Card>
    </div>
  );
}