import { FieldDef } from '@/app/components/generic/types';
import { PillTone } from '@/app/components/ui/StatusPill';

// PRD 3.1.2 — Payment History
export const FIELDS: FieldDef[] = [
  { key: 'createdDate', label: 'Created Date', kind: 'date' },
  { key: 'paymentMethod', label: 'Payment Method', kind: 'string', filter: true },
  { key: 'amount', label: 'Amount', kind: 'currency' },
  { key: 'invoiceNumber', label: 'Invoice Number', kind: 'string', mono: true },
  { key: 'paymentStatus', label: 'Payment Status', kind: 'status' },
  { key: 'paidBy', label: 'Paid By', kind: 'string' },
];

export const STATUS_TONE: Record<string, PillTone> = {
  'Success': 'success',
  'Failed': 'danger',
  'Refunded': 'warn',
};
