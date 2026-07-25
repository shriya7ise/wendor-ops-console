export type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue';

export interface Invoice {
  id: string;
  invoiceDate: string; // Invoice Date
  amount: number; // Amount
  subscriptionPlan: string; // Subscription Plan
  paymentStatus: InvoiceStatus; // Payment Status
}
