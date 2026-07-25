import { FieldDef } from '@/app/components/generic/types';
import { PillTone } from '@/app/components/ui/StatusPill';

// PRD 2.1.2.2 — Reimbursements
export const FIELDS: FieldDef[] = [
  { key: 'employee', label: 'Employee', kind: 'string', filter: true },
  { key: 'amount', label: 'Amount', kind: 'currency' },
  { key: 'status', label: 'Status', kind: 'status' },
  { key: 'date', label: 'Date', kind: 'date' },
  { key: 'paymentMethod', label: 'Payment Method', kind: 'string' },
  { key: 'remarks', label: 'Remarks', kind: 'string' },
];

export const STATUS_TONE: Record<string, PillTone> = {
  'Pending': 'warn',
  'Approved': 'info',
  'Paid': 'success',
};
