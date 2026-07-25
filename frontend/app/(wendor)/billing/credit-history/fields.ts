import { FieldDef } from '@/app/components/generic/types';
import { PillTone } from '@/app/components/ui/StatusPill';

// PRD 3.1.3 — Credit History
export const FIELDS: FieldDef[] = [
  { key: 'createdDate', label: 'Created Date', kind: 'date' },
  { key: 'credits', label: 'Credits', kind: 'signed' },
  { key: 'transactionType', label: 'Transaction Type', kind: 'string', filter: true },
  { key: 'machineName', label: 'Machine Name', kind: 'string', filter: true },
];
