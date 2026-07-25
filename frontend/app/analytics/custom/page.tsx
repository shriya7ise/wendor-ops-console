'use client';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { api } from '@/lib/api';

export default function CustomAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { api.getCustomAnalytics().then(setData); }, []);

  return (
    <div className="page-shell">
      <h1 className="page-title">Custom Analytics</h1>
      <Card>
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
          <p className="text-lg font-medium text-neutral-700">No Analytics available</p>
          <p className="max-w-md text-sm text-neutral-500">{data?.message ?? 'Please contact us on WhatsApp to request a dashboard.'}</p>
          <a href={`https://wa.me/${data?.contactWhatsapp?.replace(/\D/g, '') ?? ''}`} target="_blank" className="mt-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">Contact on WhatsApp</a>
        </div>
      </Card>
    </div>
  );
}
