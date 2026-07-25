import { FieldDef } from '@/app/components/generic/types';
import { PillTone } from '@/app/components/ui/StatusPill';

// PRD 3.2.1 — Service Tickets
export const FIELDS: FieldDef[] = [
  { key: 'subject', label: 'Subject', kind: 'string' },
  { key: 'machine', label: 'Machine', kind: 'string', filter: true },
  { key: 'status', label: 'Status', kind: 'status' },
  { key: 'raisedBy', label: 'Raised By', kind: 'string' },
  { key: 'raisedOn', label: 'Raised On', kind: 'date' },
  { key: 'updatedOn', label: 'Updated On', kind: 'date' },
  { key: 'resolvedAt', label: 'Resolved At', kind: 'date' },
  { key: 'assignedTo', label: 'Assigned To', kind: 'string' },
  { key: 'escalationPriority', label: 'Escalation Priority', kind: 'string', filter: true },
  { key: 'applicationType', label: 'Application Type', kind: 'string', filter: true },
];

export const STATUS_TONE: Record<string, PillTone> = {
  'Open': 'warn',
  'In Progress': 'info',
  'Escalated': 'danger',
  'Resolved': 'success',
  'Closed': 'neutral',
};
