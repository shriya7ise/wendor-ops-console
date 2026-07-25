import { FieldDef } from '@/app/components/generic/types';
import { PillTone } from '@/app/components/ui/StatusPill';

// PRD 2.2.2.4 — Vendors
export const FIELDS: FieldDef[] = [
  { key: 'vendorName', label: 'Vendor Name', kind: 'string' },
  { key: 'primaryContact', label: 'Primary Contact', kind: 'string' },
  { key: 'gstin', label: 'GSTIN', kind: 'string', mono: true },
  { key: 'address', label: 'Address', kind: 'string' },
  { key: 'createdDate', label: 'Created Date', kind: 'date' },
];
