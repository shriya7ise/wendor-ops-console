'use client';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { FilterBar, DateField } from '@/components/ui/FilterBar';
import { useDateRange } from '@/lib/useDateRange';
import { api } from '@/lib/api';

export default function InventoryRiskPage() {
  const { from, setFrom, to, setTo } = useDateRange();
  const [data, setData] = useState<any>(null);
  useEffect(() => { api.getInventoryRisk({ from, to }).then(setData); }, [from, to]);

  return (
    <div className="page-shell">
      <h1 className="page-title">Org Inventory Risk</h1>
      <p className="text-xs text-neutral-400">Risk is approximated from procurement fill rate + cancellation rate (no live stock-on-hand feed in this schema pass).</p>
      <FilterBar><DateField label="From" value={from} onChange={setFrom} /><DateField label="To" value={to} onChange={setTo} /></FilterBar>
      {data && (
        <>
          <div className="grid grid-cols-2 gap-4"><StatCard label="Suppliers Evaluated" value={data.suppliersEvaluated} /><StatCard label="At Risk" value={data.atRiskCount} deltaTone={data.atRiskCount > 0 ? 'down' : 'up'} /></div>
          <Card title="At-Risk Suppliers">
            <DataTable
              columns={[{ key: 'supplier', label: 'Supplier' }, { key: 'fillRatePct', label: 'Fill Rate', align: 'right' }, { key: 'cancelledPct', label: 'Cancelled %', align: 'right' }, { key: 'poCount', label: 'PO Count', align: 'right' }]}
              rows={data.atRiskSuppliers.map((r: any) => ({ ...r, fillRatePct: <Badge tone={r.fillRatePct < 60 ? 'critical' : 'warning'}>{r.fillRatePct}%</Badge>, cancelledPct: `${r.cancelledPct}%` }))}
              emptyLabel="No suppliers currently at risk."
            />
          </Card>
        </>
      )}
    </div>
  );
}
