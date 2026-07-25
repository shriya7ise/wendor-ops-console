export type ConsumerTicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';

export interface ConsumerTicket {
  id: string;
  subject: string; // Subject
  machine: string; // Machine
  status: ConsumerTicketStatus; // Status
  raisedBy: string; // Raised By
  createdDate: string; // Created Date
  updatedDate: string; // Updated Date
  assignedTo: string; // Assigned To
}
