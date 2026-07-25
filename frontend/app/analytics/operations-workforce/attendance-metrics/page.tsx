'use client';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { DataTable } from '@/components/ui/DataTable';
import { api } from '@/lib/api';

function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

// Analytics > Operations & Workforce > Attendance Metrics (1.9.8)
// Previously missing entirely — no route, no service. Per-employee monthly
// table: Missed Attendance, Average Late Hours, Avg In/Out, Avg Working
// Hours, Missing In/Out, Earliest In, Latest Out.
export default function AttendanceMetricsPage() {
  const [month, setMonth] = useState(currentMonth());
  const [memberQuery, setMemberQuery] = useState('');
  const [memberOptions, setMemberOptions] = useState<{ id: string; name: string; role: string | null }[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<{ id: string; name: string }[]>([]);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (memberQuery.trim().length < 2) { setMemberOptions([]); return; }
    const t = setTimeout(() => api.searchUsers(memberQuery).then((res: any) => setMemberOptions(res)), 250);
    return () => clearTimeout(t);
  }, [memberQuery]);

  useEffect(() => {
    api.getAttendanceMetrics({ month, memberIds: selectedMembers.map((m) => m.id).join(',') || undefined }).then(setData);
  }, [month, selectedMembers]);

  function addMember(m: { id: string; name: string }) {
    if (!selectedMembers.some((s) => s.id === m.id)) setSelectedMembers([...selectedMembers, m]);
    setMemberQuery('');
    setMemberOptions([]);
  }

  return (
    <div className="page-shell">
      <div>
        <h1 className="page-title">Attendance Metrics</h1>
        <p className="text-sm text-neutral-500">Per-employee monthly attendance table.</p>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.06em] text-neutral-500">Select Month</label>
            <input
              type="month"
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 font-mono text-sm text-neutral-800 outline-none transition-colors focus:border-amber-500"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
          </div>
          <div className="relative">
            <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.06em] text-neutral-500">Filter Members</label>
            <input
              type="text"
              placeholder="Search employees…"
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 font-body text-sm text-neutral-800 outline-none transition-colors focus:border-amber-500"
              value={memberQuery}
              onChange={(e) => setMemberQuery(e.target.value)}
            />
            {memberOptions.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full rounded-lg border border-neutral-200 bg-white shadow-card">
                {memberOptions.map((m) => (
                  <li key={m.id}>
                    <button
                      type="button"
                      className="block w-full px-3 py-2 text-left text-sm hover:bg-neutral-50"
                      onClick={() => addMember(m)}
                    >
                      {m.name} {m.role && <span className="text-neutral-400">· {m.role}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {selectedMembers.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedMembers.map((m) => (
              <span key={m.id} className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 font-mono text-[11px] text-neutral-700">
                {m.name}
                <button type="button" className="text-neutral-400 hover:text-red-600" onClick={() => setSelectedMembers(selectedMembers.filter((s) => s.id !== m.id))}>×</button>
              </span>
            ))}
            <button type="button" className="font-mono text-[11px] text-amber-700 hover:underline" onClick={() => setSelectedMembers([])}>Clear all</button>
          </div>
        )}
      </div>

      {data && (
        <Card title={`Attendance Metrics — ${data.month}`} subtitle={`${data.rows.length} employee${data.rows.length === 1 ? '' : 's'} · ${data.daysInMonth} days in month`}>
          <DataTable
            columns={[
              { key: 'name', label: 'Member Name' },
              { key: 'missedAttendanceDays', label: 'Missed Attendance (Days)', align: 'right' },
              { key: 'averageLateHours', label: 'Avg Late Hours', align: 'right' },
              { key: 'avgInTime', label: 'Avg In Time', align: 'right' },
              { key: 'avgOutTime', label: 'Avg Out Time', align: 'right' },
              { key: 'avgWorkingHours', label: 'Avg Working Hours', align: 'right' },
              { key: 'missingInOut', label: 'Missing In/Out', align: 'right' },
              { key: 'earliestIn', label: 'Earliest In', align: 'right' },
              { key: 'latestOut', label: 'Latest Out', align: 'right' },
            ]}
            rows={data.rows}
            emptyLabel="No attendance records for this month/filter selection."
          />
        </Card>
      )}
    </div>
  );
}
