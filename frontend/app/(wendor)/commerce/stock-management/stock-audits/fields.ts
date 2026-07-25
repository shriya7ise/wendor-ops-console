import { FieldDef } from '@/app/components/generic/types';
import { PillTone } from '@/app/components/ui/StatusPill';

// PRD 2.2.2.8 — Stock Audits
export const FIELDS: FieldDef[] = [
  { key: 'date', label: 'Date', kind: 'date' },
  { key: 'stockLocation', label: 'Stock Location', kind: 'string', filter: true },
  { key: 'reason', label: 'Reason', kind: 'string' },
  { key: 'totalAmount', label: 'Total Amount', kind: 'currency' },
  { key: 'stockChange', label: 'Stock Change', kind: 'signed' },
];
