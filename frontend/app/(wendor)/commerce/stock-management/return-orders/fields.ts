import { FieldDef } from '@/app/components/generic/types';
import { PillTone } from '@/app/components/ui/StatusPill';

// PRD 2.2.2.6 — Return Orders
export const FIELDS: FieldDef[] = [
  { key: 'machine', label: 'Machine', kind: 'string', filter: true },
  { key: 'stockLocation', label: 'Stock Location', kind: 'string', filter: true },
  { key: 'assignedTo', label: 'Assigned To', kind: 'string' },
  { key: 'executedBy', label: 'Executed By', kind: 'string' },
  { key: 'createdAt', label: 'Created At', kind: 'date' },
  { key: 'status', label: 'Status', kind: 'status' },
];

export const STATUS_TONE: Record<string, PillTone> = {
  'Pending': 'warn',
  'In Transit': 'info',
  'Completed': 'success',
  'Rejected': 'danger',
};
