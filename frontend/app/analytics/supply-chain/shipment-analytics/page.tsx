'use client';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable } from '@/components/ui/DataTable';
import { FilterBar, DateField } from '@/components/ui/FilterBar';
import { useDateRange } from '@/lib/useDateRange';
import { api } from '@/lib/api';

export default function ShipmentAnalyticsPage() {
  const { from, setFrom, to, setTo } = useDateRange();
  const [data, setData] = useState<any>(null);
  useEffect(() => { api.getShipmentAnalytics({ from, to }).then(setData); }, [from, to]);

  return (
    <div className="page-shell">
      <h1 className="page-title">Shipment Analytics</h1>
      <FilterBar><DateField label="From" value={from} onChange={setFrom} /><DateField label="To" value={to} onChange={setTo} /></FilterBar>
      {data && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <StatCard label="Total Shipments" value={data.totalShipments} />
            <StatCard label="Delayed" value={data.delayedCount} deltaTone={data.delayedCount > 0 ? 'down' : 'up'} />
            <StatCard label="Avg Transit (days)" value={data.avgTransitDays} />
          </div>
          <Card title="Status Breakdown"><DataTable columns={[{ key: 'status', label: 'Status' }, { key: 'count', label: 'Count', align: 'right' }]} rows={data.statusBreakdown} /></Card>
          <Card title="Delayed Shipments"><DataTable columns={[{ key: 'warehouse', label: 'Warehouse' }, { key: 'supplier', label: 'Supplier' }, { key: 'expectedAt', label: 'Expected' }]} rows={data.delayedShipments.map((s: any) => ({ ...s, expectedAt: s.expectedAt ? new Date(s.expectedAt).toLocaleDateString() : '—' }))} emptyLabel="No delayed shipments." /></Card>
        </>
      )}
    </div>
  );
}
