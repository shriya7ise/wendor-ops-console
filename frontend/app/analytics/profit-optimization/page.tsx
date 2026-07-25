'use client';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';

// Step 4 (1.9.20): the gap-closure doc flagged "confirm both tabs actually
// render distinct data" — there was in fact no tab control at all yet. This
// adds a real Weekly/Monthly toggle wired to the backend's `period` param
// (see ProfitOptimizationQueryDto), which derives a genuinely different
// date window per tab rather than relabeling the same query.
type Period = 'week' | 'month';

export default function ProfitOptimizationPage() {
  const [term, setTerm] = useState('');
  const [machineId, setMachineId] = useState('');
  const [options, setOptions] = useState<any[]>([]);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<Period>('week');

  useEffect(() => {
    if (!term) { setOptions([]); return; }
    const h = setTimeout(() => api.searchMachines(term).then((r: any) => setOptions(r)), 250);
    return () => clearTimeout(h);
  }, [term]);

  useEffect(() => {
    if (!machineId && !term) return;
    setError(null);
    api.getProfitOptimization({ machineId: machineId || undefined, machine: machineId ? undefined : term, period }).then(setData).catch((e) => setError(e.message));
  }, [machineId, period]);

  return (
    <div className="page-shell">
      <h1 className="page-title">Profit Optimization</h1>
      <Card title="Select a machine">
        <div className="relative max-w-sm">
          <input className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" placeholder="Search machine..." value={term} onChange={(e) => { setTerm(e.target.value); setMachineId(''); }} />
          {options.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full rounded-lg border border-neutral-200 bg-white shadow-lg">
              {options.map((o) => <li key={o.id} className="cursor-pointer px-3 py-2 text-sm hover:bg-neutral-50" onMouseDown={() => { setMachineId(o.id); setTerm(o.name); setOptions([]); }}>{o.name}</li>)}
            </ul>
          )}
        </div>
      </Card>
      {error && <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{error}</div>}
      {data && (
        <>
          <div className="flex gap-1 border-b border-neutral-200 text-sm">
            {(['week', 'month'] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`border-b-2 px-3 py-2 font-medium capitalize ${period === p ? 'border-amber-600 text-amber-800' : 'border-transparent text-neutral-500 hover:text-neutral-700'}`}
              >
                {p}ly
              </button>
            ))}
          </div>
          <p className="text-xs text-neutral-400">
            Showing {data.range.from.slice(0, 10)} to {data.range.to.slice(0, 10)}
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard label={`Total Revenue (${data.period}ly)`} value={`₹${data.totalRevenue.toLocaleString()}`} />
            <StatCard label="Gross Profit" value={data.costDataAvailable ? `₹${data.grossProfit.toLocaleString()}` : 'No cost data'} />
            <StatCard label="Margin" value={data.costDataAvailable ? `${data.margin}%` : '—'} />
          </div>
          <Card title="Recommendations" subtitle="Auto-generated from per-SKU revenue vs org average">
            <div className="space-y-3">
              {data.recommendations.map((r: any, i: number) => {
                const riskTone = r.risk === 'HIGH' ? 'critical' : r.risk === 'MED' ? 'warning' : 'A';
                return (
                  <div key={i} className="rounded-lg border border-neutral-200 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <Badge tone={r.type === 'underperforming' ? 'warning' : 'A'}>{r.type === 'underperforming' ? 'Reduce facing' : 'Top performer'}</Badge>
                        <p className="text-sm text-neutral-700">{r.detail}</p>
                      </div>
                      {r.action && (
                        <button className="shrink-0 rounded-md bg-amber-500 px-2.5 py-1 text-xs font-medium text-white hover:bg-amber-600">
                          {r.action}
                        </button>
                      )}
                    </div>
                    <ul className="mt-2 space-y-0.5 text-xs text-neutral-500">
                      <li>Units sold: {r.units}</li>
                      <li>Revenue: ₹{r.revenue.toLocaleString()}</li>
                    </ul>
                    <div className="mt-2 flex flex-wrap items-center gap-3 border-t border-neutral-100 pt-2 text-xs text-neutral-500">
                      <span>₹{r.priceRangeLow.toLocaleString()}–{r.priceRangeHigh.toLocaleString()}</span>
                      <Badge tone={riskTone}>Risk: {r.risk}</Badge>
                      <span className="flex items-center gap-1.5">
                        Confidence
                        <span className="h-1.5 w-16 overflow-hidden rounded-full bg-neutral-200">
                          <span
                            className={`block h-full ${r.confidencePct >= 70 ? 'bg-emerald-500' : r.confidencePct >= 45 ? 'bg-amber-500' : 'bg-red-500'}`}
                            style={{ width: `${r.confidencePct}%` }}
                          />
                        </span>
                        {r.confidencePct}%
                      </span>
                    </div>
                  </div>
                );
              })}
              {data.recommendations.length === 0 && <p className="text-sm text-neutral-400">No strong signals in this range yet.</p>}
            </div>
          </Card>
        </>
      )}
      {!data && !error && <p className="py-16 text-center text-sm text-neutral-400">Select a machine to view optimization recommendations.</p>}
    </div>
  );
}