export type PurchaseOrderStatus = 'Draft' | 'Pending Approval' | 'Approved' | 'Ordered' | 'Received' | 'Rejected';

export interface PurchaseOrder {
  id: string;
  vendor: string; // Vendor
  stockLocation: string; // Stock Location
  totalCost: number; // Total Cost
  generationType: string; // Generation Type
  createdBy: string; // Created By
  approvedBy: string; // Approved By
  receivedBy: string; // Received By
  status: PurchaseOrderStatus; // Status
}
