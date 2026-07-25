'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';
import { api } from '@/lib/api';
import type { ExportJob, ExportType } from '@/lib/types';

const EXPORT_TYPES: { type: ExportType; label: string }[] = [
  { type: 'EMPLOYEE_REPORT', label: 'Employee Reports' },
  { type: 'SCHEDULED_REPORT', label: 'Scheduled Reports' },
  { type: 'TRANSACTION_DOWNLOAD', label: 'Transaction Downloads' },
  { type: 'WALLET_USER_DOWNLOAD', label: 'Wallet User Downloads' },
  { type: 'ATTENDANCE_EXPORT', label: 'Attendance Exports' },
  { type: 'MACHINE_LOCATIONS', label: 'Machine Locations Map' },
];

export default function ReportsExportsPage() {
  const [activeType, setActiveType] = useState<ExportType>('EMPLOYEE_REPORT');
  const [jobs, setJobs] = useState<ExportJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const res: any = await api.listExports({ type: activeType });
      setJobs(res.items);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, [activeType]);

  // Poll while anything is pending/processing — mirrors the "Refresh"
  // button in the source UI, but does it automatically.
  useEffect(() => {
    const hasInFlight = jobs.some((j) => j.status === 'PENDING' || j.status === 'PROCESSING');
    if (!hasInFlight) return;
    const t = setInterval(refresh, 3000);
    return () => clearInterval(t);
  }, [jobs]);

  async function handleNewExport() {
    setCreating(true);
    try {
      await api.createExport(activeType, {});
      await refresh();
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="page-shell">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Reports &amp; Exports</h1>
          <p className="text-sm text-neutral-500">Dashboard &gt; Analytics &amp; Reports &gt; Exports</p>
        </div>
        <button
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          onClick={handleNewExport}
          disabled={creating}
        >
          {creating ? 'Queuing…' : 'New export'}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {EXPORT_TYPES.map((t) => (
          <button
            key={t.type}
            onClick={() => setActiveType(t.type)}
            className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${
              activeType === t.type
                ? 'border-red-600 bg-red-50 text-red-700'
                : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Card title={EXPORT_TYPES.find((t) => t.type === activeType)?.label} subtitle={loading ? 'Refreshing…' : `${jobs.length} export${jobs.length === 1 ? '' : 's'}`}>
        <DataTable
          columns={[
            { key: 'createdAt', label: 'Requested' },
            { key: 'status', label: 'Status' },
            { key: 'rowCount', label: 'Rows', align: 'right' },
            { key: 'action', label: '', align: 'right' },
          ]}
          rows={jobs.map((j) => ({
            createdAt: new Date(j.createdAt).toLocaleString(),
            status: <Badge tone={j.status}>{j.status}</Badge>,
            rowCount: j.rowCount ?? '—',
            action:
              j.status === 'COMPLETED' ? (
                <a className="font-medium font-medium text-amber-700 hover:text-amber-800 hover:underline" href={api.downloadExportUrl(j.id)}>
                  Download
                </a>
              ) : j.status === 'FAILED' ? (
                <span className="text-xs text-red-500" title={j.errorMessage ?? ''}>Failed</span>
              ) : (
                <span className="text-xs text-neutral-400">Processing…</span>
              ),
          }))}
          emptyLabel="No exports yet. Click “New export” to generate one."
        />
      </Card>
    </div>
  );
}
