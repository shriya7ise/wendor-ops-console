export type ExpenseClaimStatus = 'Draft' | 'In Review' | 'Approved' | 'Paid Out' | 'Rejected';

export interface ExpenseClaim {
  id: string;
  category: string; // Category
  submittedBy: string; // Submitted By
  amount: number; // Amount
  submittedDate: string; // Submitted Date
  progress: string; // Progress
  status: ExpenseClaimStatus; // Status
}
