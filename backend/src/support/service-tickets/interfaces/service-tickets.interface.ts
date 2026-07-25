export type ServiceTicketStatus = 'Open' | 'In Progress' | 'Escalated' | 'Resolved' | 'Closed';

export interface ServiceTicket {
  id: string;
  subject: string; // Subject
  machine: string; // Machine
  status: ServiceTicketStatus; // Status
  raisedBy: string; // Raised By
  raisedOn: string; // Raised On
  updatedOn: string; // Updated On
  resolvedAt: string; // Resolved At
  assignedTo: string; // Assigned To
  escalationPriority: string; // Escalation Priority
  applicationType: string; // Application Type
}
