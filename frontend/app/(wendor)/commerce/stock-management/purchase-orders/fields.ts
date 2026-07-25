import { FieldDef } from '@/app/components/generic/types';
import { PillTone } from '@/app/components/ui/StatusPill';

// PRD 2.2.2.5 — Purchase Orders
export const FIELDS: FieldDef[] = [
  { key: 'vendor', label: 'Vendor', kind: 'string', filter: true },
  { key: 'stockLocation', label: 'Stock Location', kind: 'string', filter: true },
  { key: 'totalCost', label: 'Total Cost', kind: 'currency' },
  { key: 'generationType', label: 'Generation Type', kind: 'string' },
  { key: 'createdBy', label: 'Created By', kind: 'string' },
  { key: 'approvedBy', label: 'Approved By', kind: 'string' },
  { key: 'receivedBy', label: 'Received By', kind: 'string' },
  { key: 'status', label: 'Status', kind: 'status' },
];

export const STATUS_TONE: Record<string, PillTone> = {
  'Draft': 'neutral',
  'Pending Approval': 'warn',
  'Approved': 'info',
  'Ordered': 'info',
  'Received': 'success',
  'Rejected': 'danger',
};
