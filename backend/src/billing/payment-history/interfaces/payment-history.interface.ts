export type PaymentRecordStatus = 'Success' | 'Failed' | 'Refunded';

export interface PaymentRecord {
  id: string;
  createdDate: string; // Created Date
  paymentMethod: string; // Payment Method
  amount: number; // Amount
  invoiceNumber: string; // Invoice Number
  paymentStatus: PaymentRecordStatus; // Payment Status
  paidBy: string; // Paid By
}
