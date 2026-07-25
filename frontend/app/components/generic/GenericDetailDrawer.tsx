'use client';

import { useEffect, useState } from 'react';
import { StatusPill, PillTone } from '@/app/components/ui/StatusPill';
import { FieldDef } from './types';
import { formatValue } from './formatters';

interface Row {
  id: string;
  [key: string]: unknown;
}

interface Props<T extends Row> {
  id: string | null;
  fields: FieldDef[];
  fetchDetail: (id: string) => Promise<T>;
  statusTone?: Record<string, PillTone>;
  titleField?: string;
  onClose: () => void;
}

export function GenericDetailDrawer<T extends Row>({
  id,
  fields,
  fetchDetail,
  statusTone,
  titleField,
  onClose,
}: Props<T>) {
  const [detail, setDetail] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setDetail(null);
    setLoading(true);
    fetchDetail(id)
      .then(setDetail)
      .finally(() => setLoading(false));
  }, [id, fetchDetail]);

  if (!id) return null;

  const statusField = fields.find((f) => f.kind === 'status');

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50">
      <button aria-label="Close details" onClick={onClose} className="absolute inset-0" />
      <div className="relative flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-line bg-panel p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-lg text-slate-100">{id}</h2>
          <button
            onClick={onClose}
            className="rounded-console border border-line px-2 py-1 text-sm text-slate-400 hover:text-accent"
          >
            Close
          </button>
        </div>

        {loading && <p className="mt-6 text-slate-500">Loading...</p>}

        {detail && !loading && (
          <div className="mt-6 flex flex-col gap-5">
            {titleField && (
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">{titleField}</p>
                <p className="mt-1 text-lg text-slate-100">{String(detail[titleField] ?? '—')}</p>
              </div>
            )}

            {statusField && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">{statusField.label}</span>
                <StatusPill
                  label={String(detail[statusField.key])}
                  tone={statusTone?.[String(detail[statusField.key])] ?? 'neutral'}
                />
              </div>
            )}

            <dl className="grid grid-cols-2 gap-y-3 text-sm">
              {fields
                .filter((f) => f.kind !== 'status')
                .map((f) => (
                  <div key={f.key} className="col-span-2 grid grid-cols-2">
                    <dt className="text-slate-400">{f.label}</dt>
                    <dd className={`text-right text-slate-200 ${f.mono ? 'font-mono text-xs' : ''}`}>
                      {formatValue(f, detail[f.key])}
                    </dd>
                  </div>
                ))}
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}
