'use client';
import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { FilterBar, DateField } from '@/components/ui/FilterBar';
import { useDateRange } from '@/lib/useDateRange';
import { api } from '@/lib/api';

// Step 4 (1.9.4): Day-wise / Hour-wise drill-down modes, toggled off the
// same dataset the backend already returns (dayWiseTrend / hourWiseTrend).
// Distinct from the "Day-wise Analysis" card below, which is a weekday
// (Sun–Sat) distribution rather than a calendar-date/hour-of-day trend.
type DrillMode = 'day' | 'hour';

export default function TransactionAnalyticsPage() {
  const { from, setFrom, to, setTo } = useDateRange(30);
  const [data, setData] = useState<any>(null);
  const [drillMode, setDrillMode] = useState<DrillMode>('day');

  useEffect(() => { api.getTransactionAnalytics({ from, to }).then(setData); }, [from, to]);

  return (
    <div className="page-shell">
      <h1 className="page-title">Transaction Analytics</h1>
      <FilterBar><DateField label="From" value={from} onChange={setFrom} /><DateField label="To" value={to} onChange={setTo} /></FilterBar>
      {data && (
        <>
          <StatCard label="Total Transactions" value={data.totalTransactions} />
          <Card title="Transactions per Day">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data.transactionsPerDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="label" fontSize={11} /><YAxis fontSize={11} /><Tooltip />
                <Line type="monotone" dataKey="value" stroke="#dc2626" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
          <Card title="Weekday Distribution" subtitle="Transactions by day of week">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.dayOfWeekCounts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="day" fontSize={11} /><YAxis fontSize={11} allowDecimals={false} /><Tooltip />
                <Bar dataKey="count" fill="#dc2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card
            title="Transaction Drill-down"
            subtitle="Same date range, viewed by day or by hour of day"
            action={
              <div className="flex gap-1 text-xs">
                <button
                  onClick={() => setDrillMode('day')}
                  className={`rounded px-2 py-1 ${drillMode === 'day' ? 'bg-amber-100 text-amber-800 font-medium' : 'text-neutral-500 hover:bg-neutral-100'}`}
                >
                  Day-wise
                </button>
                <button
                  onClick={() => setDrillMode('hour')}
                  className={`rounded px-2 py-1 ${drillMode === 'hour' ? 'bg-amber-100 text-amber-800 font-medium' : 'text-neutral-500 hover:bg-neutral-100'}`}
                >
                  Hour-wise
                </button>
              </div>
            }
          >
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={drillMode === 'day' ? data.dayWiseTrend : data.hourWiseTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" fontSize={11} interval={drillMode === 'hour' ? 2 : 'preserveStartEnd'} />
                <YAxis fontSize={11} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#dc2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </>
      )}
    </div>
  );
}
