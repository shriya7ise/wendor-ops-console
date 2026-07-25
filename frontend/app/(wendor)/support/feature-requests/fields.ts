import { FieldDef } from '@/app/components/generic/types';
import { PillTone } from '@/app/components/ui/StatusPill';

// PRD 3.2.2 — Feature Requests
export const FIELDS: FieldDef[] = [
  { key: 'subject', label: 'Subject', kind: 'string' },
  { key: 'machine', label: 'Machine', kind: 'string', filter: true },
  { key: 'status', label: 'Status', kind: 'status' },
  { key: 'raisedBy', label: 'Raised By', kind: 'string' },
  { key: 'raisedOn', label: 'Raised On', kind: 'date' },
  { key: 'updatedOn', label: 'Updated On', kind: 'date' },
  { key: 'resolvedAt', label: 'Resolved At', kind: 'date' },
  { key: 'assignedTo', label: 'Assigned To', kind: 'string' },
];

export const STATUS_TONE: Record<string, PillTone> = {
  'Submitted': 'neutral',
  'Under Review': 'warn',
  'Planned': 'info',
  'In Development': 'info',
  'Shipped': 'success',
};
