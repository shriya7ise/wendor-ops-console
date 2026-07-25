export type ReturnOrderStatus = 'Pending' | 'In Transit' | 'Completed' | 'Rejected';

export interface ReturnOrder {
  id: string;
  machine: string; // Machine
  stockLocation: string; // Stock Location
  assignedTo: string; // Assigned To
  executedBy: string; // Executed By
  createdAt: string; // Created At
  status: ReturnOrderStatus; // Status
}
