export interface StockAudit {
  id: string;
  date: string; // Date
  stockLocation: string; // Stock Location
  reason: string; // Reason
  totalAmount: number; // Total Amount
  stockChange: number; // Stock Change
}
