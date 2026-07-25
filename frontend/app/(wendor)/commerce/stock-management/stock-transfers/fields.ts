import { FieldDef } from '@/app/components/generic/types';
import { PillTone } from '@/app/components/ui/StatusPill';

// PRD 2.2.2.7 — Stock Transfers
export const FIELDS: FieldDef[] = [
  { key: 'sourceLocation', label: 'Source Location', kind: 'string', filter: true },
  { key: 'destinationLocation', label: 'Destination Location', kind: 'string', filter: true },
  { key: 'status', label: 'Status', kind: 'status' },
  { key: 'amount', label: 'Amount', kind: 'currency' },
  { key: 'requestedDate', label: 'Requested Date', kind: 'date' },
  { key: 'sentDate', label: 'Sent Date', kind: 'date' },
  { key: 'receivedDate', label: 'Received Date', kind: 'date' },
];

export const STATUS_TONE: Record<string, PillTone> = {
  'Requested': 'warn',
  'Sent': 'info',
  'Received': 'success',
  'Cancelled': 'danger',
};
