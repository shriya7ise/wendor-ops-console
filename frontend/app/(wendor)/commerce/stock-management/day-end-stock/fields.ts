import { FieldDef } from '@/app/components/generic/types';
import { PillTone } from '@/app/components/ui/StatusPill';

// PRD 2.2.2.9 — Day End Stock
export const FIELDS: FieldDef[] = [
  { key: 'date', label: 'Date', kind: 'date' },
  { key: 'stockLocation', label: 'Stock Location', kind: 'string', filter: true },
  { key: 'machine', label: 'Machine', kind: 'string', filter: true },
  { key: 'product', label: 'Product', kind: 'string' },
  { key: 'closingStock', label: 'Closing Stock', kind: 'number' },
];
