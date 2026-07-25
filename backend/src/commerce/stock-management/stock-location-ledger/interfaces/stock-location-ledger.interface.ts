export interface LedgerEntry {
  id: string;
  dateTime: string; // Date & Time
  movementType: string; // Movement Type
  sourceModule: string; // Source Module
  referenceNumber: string; // Reference Number
  stockLocation: string; // Stock Location
  product: string; // Product
  previousQuantity: number; // Previous Quantity
  stockIn: number; // Stock In
  stockOut: number; // Stock Out
  balance: number; // Balance
}
