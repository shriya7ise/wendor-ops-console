export type StockTransferStatus = 'Requested' | 'Sent' | 'Received' | 'Cancelled';

export interface StockTransfer {
  id: string;
  sourceLocation: string; // Source Location
  destinationLocation: string; // Destination Location
  status: StockTransferStatus; // Status
  amount: number; // Amount
  requestedDate: string; // Requested Date
  sentDate: string; // Sent Date
  receivedDate: string; // Received Date
}
