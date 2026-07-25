export type ReimbursementStatus = 'Pending' | 'Approved' | 'Paid';

export interface Reimbursement {
  id: string;
  employee: string; // Employee
  amount: number; // Amount
  status: ReimbursementStatus; // Status
  date: string; // Date
  paymentMethod: string; // Payment Method
  remarks: string; // Remarks
}
