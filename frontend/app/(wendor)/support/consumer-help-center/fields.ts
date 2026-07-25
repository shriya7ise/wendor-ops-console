import { FieldDef } from '@/app/components/generic/types';
import { PillTone } from '@/app/components/ui/StatusPill';

// PRD 3.2.4 — Consumer Help Center
export const FIELDS: FieldDef[] = [
  { key: 'subject', label: 'Subject', kind: 'string' },
  { key: 'machine', label: 'Machine', kind: 'string', filter: true },
  { key: 'status', label: 'Status', kind: 'status' },
  { key: 'raisedBy', label: 'Raised By', kind: 'string' },
  { key: 'createdDate', label: 'Created Date', kind: 'date' },
  { key: 'updatedDate', label: 'Updated Date', kind: 'date' },
  { key: 'assignedTo', label: 'Assigned To', kind: 'string' },
];

export const STATUS_TONE: Record<string, PillTone> = {
  'Open': 'warn',
  'In Progress': 'info',
  'Resolved': 'success',
  'Closed': 'neutral',
};
