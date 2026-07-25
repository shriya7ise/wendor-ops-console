'use client';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { useDateRange } from '@/lib/useDateRange';
import { api } from '@/lib/api';

// Step 4 (1.9.19): color key for the Activity Calendar heatmap. Reuses the
// same attendance states as Attendance Analytics/Exports, plus ABSENT for
// days with no attendance record at all.
const CALENDAR_COLORS: Record<string, string> = {
  ON_TIME: 'bg-emerald-500',
  LATE_CHECKIN: 'bg-amber-500',
  MISSED_CHECKOUT: 'bg-orange-500',
  OVERTIME: 'bg-sky-500',
  PENDING: 'bg-neutral-300',
  ABSENT: 'bg-neutral-100',
};
const CALENDAR_LABELS: Record<string, string> = {
  ON_TIME: 'On Time',
  LATE_CHECKIN: 'Late Check-In',
  MISSED_CHECKOUT: 'Missed Check-Out',
  OVERTIME: 'Overtime',
  PENDING: 'Pending',
  ABSENT: 'Absent',
};

export default function UserAnalyticsPage() {
  const { from, to } = useDateRange(30);
  const [term, setTerm] = useState('');
  const [userId, setUserId] = useState('');
  const [options, setOptions] = useState<any[]>([]);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    if (!term) { setOptions([]); return; }
    const h = setTimeout(() => api.searchUsers(term).then((r: any) => setOptions(r)), 250);
    return () => clearTimeout(h);
  }, [term]);

  useEffect(() => {
    if (!userId && !term) return;
    setError(null);
    api.getUserAnalytics({ userId: userId || undefined, user: userId ? undefined : term, from, to }).then(setData).catch((e) => setError(e.message));
  }, [userId, from, to]);

  return (
    <div className="page-shell">
      <h1 className="page-title">User Analytics</h1>
      <Card title="Select User to Analyse">
        <div className="relative max-w-sm">
          <input className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" placeholder="Search by user name..." value={term} onChange={(e) => { setTerm(e.target.value); setUserId(''); }} />
          {options.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full rounded-lg border border-neutral-200 bg-white shadow-lg">
              {options.map((o) => <li key={o.id} className="cursor-pointer px-3 py-2 text-sm hover:bg-neutral-50" onMouseDown={() => { setUserId(o.id); setTerm(o.name); setOptions([]); }}>{o.name} <span className="text-neutral-400">({o.role})</span></li>)}
            </ul>
          )}
        </div>
      </Card>
      {error && <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{error}</div>}
      {data && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{data.user.name} <span className="text-sm font-normal text-neutral-500">· {data.user.role}</span></h2>
            <button
              onClick={() => setShowSummary((s) => !s)}
              className="rounded-md border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-100"
            >
              {showSummary ? 'Hide AI Summary' : 'Show AI Summary'}
            </button>
          </div>
          {showSummary && (
            <Card title="AI Summary">
              <p className="text-sm leading-relaxed text-neutral-700">{data.aiSummary}</p>
            </Card>
          )}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <StatCard label="Refill Trips" value={data.refillTrips} />
            <StatCard label="Refill Quantity" value={data.refillQuantity} />
            <StatCard label="Machines Serviced" value={data.machinesServiced} />
            <StatCard label="Business Tx Count" value={data.businessTxCount} />
            <StatCard label="Attendance Rate" value={`${data.attendanceRate}%`} />
            <StatCard label="Late Count" value={data.lateCount} deltaTone={data.lateCount > 0 ? 'down' : 'up'} />
          </div>
          <Card title="Attendance Trend"><ResponsiveContainer width="100%" height={220}><LineChart data={data.attendanceTrend}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="label" fontSize={11} /><YAxis fontSize={11} allowDecimals={false} /><Tooltip /><Line type="monotone" dataKey="value" stroke="#dc2626" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></Card>
          <Card title="Activity Calendar" subtitle="Attendance status, refill trips, and transactions per day">
            <div className="mb-3 flex flex-wrap gap-3 text-xs text-neutral-600">
              {Object.entries(CALENDAR_LABELS).map(([key, label]) => (
                <span key={key} className="flex items-center gap-1.5">
                  <span className={`h-2.5 w-2.5 rounded-sm ${CALENDAR_COLORS[key]}`} />
                  {label}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1.5 sm:grid-cols-10 lg:grid-cols-14">
              {data.activityCalendar.map((day: any) => (
                <div
                  key={day.date}
                  title={`${day.date} · ${CALENDAR_LABELS[day.attendanceStatus]}${day.refillTrips ? ` · ${day.refillTrips} refill trip(s)` : ''}${day.txCount ? ` · ${day.txCount} transaction(s)` : ''}`}
                  className={`flex aspect-square flex-col items-center justify-center rounded ${CALENDAR_COLORS[day.attendanceStatus]}`}
                >
                  <span className="text-[9px] font-medium text-neutral-900/70">{day.date.slice(-2)}</span>
                  {day.refillTrips > 0 && <span className="text-[8px] text-neutral-900/60">{day.refillTrips}r</span>}
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
      {!data && !error && <p className="py-16 text-center text-sm text-neutral-400">Select a user to view analytics.</p>}
    </div>
  );
}
