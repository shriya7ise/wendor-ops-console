import { FieldDef } from '@/app/components/generic/types';
import { PillTone } from '@/app/components/ui/StatusPill';

// PRD 2.2.2.10 — Stock Location Ledger
export const FIELDS: FieldDef[] = [
  { key: 'dateTime', label: 'Date & Time', kind: 'datetime' },
  { key: 'movementType', label: 'Movement Type', kind: 'string', filter: true },
  { key: 'sourceModule', label: 'Source Module', kind: 'string', filter: true },
  { key: 'referenceNumber', label: 'Reference Number', kind: 'string', mono: true },
  { key: 'stockLocation', label: 'Stock Location', kind: 'string' },
  { key: 'product', label: 'Product', kind: 'string' },
  { key: 'previousQuantity', label: 'Previous Quantity', kind: 'number' },
  { key: 'stockIn', label: 'Stock In', kind: 'number' },
  { key: 'stockOut', label: 'Stock Out', kind: 'number' },
  { key: 'balance', label: 'Balance', kind: 'number' },
];
