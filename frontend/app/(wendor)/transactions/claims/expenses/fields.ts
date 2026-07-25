import { FieldDef } from '@/app/components/generic/types';
import { PillTone } from '@/app/components/ui/StatusPill';

// PRD 2.1.2.1 — Expenses
export const FIELDS: FieldDef[] = [
  { key: 'category', label: 'Category', kind: 'string', filter: true },
  { key: 'submittedBy', label: 'Submitted By', kind: 'string' },
  { key: 'amount', label: 'Amount', kind: 'currency' },
  { key: 'submittedDate', label: 'Submitted Date', kind: 'date' },
  { key: 'progress', label: 'Progress', kind: 'string' },
  { key: 'status', label: 'Status', kind: 'status' },
];

export const STATUS_TONE: Record<string, PillTone> = {
  'Draft': 'neutral',
  'In Review': 'warn',
  'Approved': 'info',
  'Paid Out': 'success',
  'Rejected': 'danger',
};
