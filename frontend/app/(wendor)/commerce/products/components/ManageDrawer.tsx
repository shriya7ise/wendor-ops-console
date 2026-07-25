'use client';

import { useState } from 'react';
import { updateProductStatus } from '@/lib/api';
import { Product, ProductStatus } from '@/types/product';
import { StatusPill } from '@/app/components/ui/StatusPill';
import { formatAmount } from '@/lib/format';

const TONE: Record<ProductStatus, 'success' | 'neutral' | 'danger'> = {
  Active: 'success',
  Inactive: 'neutral',
  'Out of Stock': 'danger',
};
const STATUSES: ProductStatus[] = ['Active', 'Inactive', 'Out of Stock'];

export function ManageDrawer({
  product,
  onClose,
  onUpdated,
}: {
  product: Product | null;
  onClose: () => void;
  onUpdated: (updated: Product) => void;
}) {
  const [saving, setSaving] = useState(false);

  if (!product) return null;

  const handleStatusChange = async (status: ProductStatus) => {
    setSaving(true);
    try {
      const updated = await updateProductStatus(product.id, status);
      onUpdated(updated);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0" />
      <div className="relative flex h-full w-full max-w-md flex-col border-l border-line bg-panel p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-lg text-slate-100">{product.id}</h2>
          <button
            onClick={onClose}
            className="rounded-console border border-line px-2 py-1 text-sm text-slate-400 hover:text-accent"
          >
            Close
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-5">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Product</p>
            <p className="mt-1 text-lg text-slate-100">{product.name}</p>
          </div>

          <dl className="grid grid-cols-2 gap-y-3 text-sm">
            <dt className="text-slate-400">Brand</dt>
            <dd className="text-right text-slate-200">{product.brand}</dd>

            <dt className="text-slate-400">Category</dt>
            <dd className="text-right text-slate-200">{product.category}</dd>

            <dt className="text-slate-400">Cluster</dt>
            <dd className="text-right text-slate-200">{product.cluster}</dd>

            <dt className="text-slate-400">Machine</dt>
            <dd className="text-right font-mono text-slate-200">{product.machine}</dd>

            <dt className="text-slate-400">Price</dt>
            <dd className="text-right font-mono text-slate-100">
              {formatAmount(product.price)} / {product.uom}
            </dd>
          </dl>

          <div className="rounded-console border border-line bg-ink p-4">
            <p className="mb-3 flex items-center justify-between text-xs uppercase tracking-wide text-slate-500">
              Status
              <StatusPill label={product.status} tone={TONE[product.status]} />
            </p>
            <div className="flex gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  disabled={saving || s === product.status}
                  onClick={() => handleStatusChange(s)}
                  className="flex-1 rounded-console border border-line px-2 py-1.5 text-xs text-slate-300 transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Set {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
