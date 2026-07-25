import { FieldDef } from '@/app/components/generic/types';
import { PillTone } from '@/app/components/ui/StatusPill';

// PRD 3.1.1 — Invoices
export const FIELDS: FieldDef[] = [
  { key: 'invoiceDate', label: 'Invoice Date', kind: 'date' },
  { key: 'amount', label: 'Amount', kind: 'currency' },
  { key: 'subscriptionPlan', label: 'Subscription Plan', kind: 'string', filter: true },
  { key: 'paymentStatus', label: 'Payment Status', kind: 'status' },
];

export const STATUS_TONE: Record<string, PillTone> = {
  'Paid': 'success',
  'Pending': 'warn',
  'Overdue': 'danger',
};
