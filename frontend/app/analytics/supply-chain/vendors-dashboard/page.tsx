'use client';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { DataTable } from '@/components/ui/DataTable';
import { FilterBar, DateField } from '@/components/ui/FilterBar';
import { useDateRange } from '@/lib/useDateRange';
import { api } from '@/lib/api';

export default function VendorsDashboardPage() {
  const { from, setFrom, to, setTo } = useDateRange();
  const [data, setData] = useState<any>(null);
  useEffect(() => { api.getVendorsDashboard({ from, to }).then(setData); }, [from, to]);

  return (
    <div className="page-shell">
      <h1 className="page-title">US Vendors Dashboard</h1>
      <FilterBar><DateField label="From" value={from} onChange={setFrom} /><DateField label="To" value={to} onChange={setTo} /></FilterBar>
      {data && (
        <Card title="Supplier Leaderboard" subtitle="Ranked by ordered value in range">
          <DataTable
            columns={[
              { key: 'supplier', label: 'Supplier' },
              { key: 'poCount', label: 'PO Count', align: 'right' },
              { key: 'fillRatePct', label: 'Fill Rate', align: 'right' },
              { key: 'avgLeadTimeDays', label: 'Avg Lead Time (d)', align: 'right' },
              { key: 'orderedValue', label: 'Ordered Value', align: 'right' },
            ]}
            rows={data.leaderboard.map((r: any) => ({ ...r, fillRatePct: `${r.fillRatePct}%`, orderedValue: `₹${r.orderedValue.toLocaleString()}` }))}
          />
        </Card>
      )}
    </div>
  );
}
