export type RefundStatus = 'Refunded' | 'Pending' | 'Failed' | 'Disabled';
export type RefundType = 'Full' | 'Partial' | 'Goodwill';

export interface Refund {
  id: string; // Refund ID
  transactionId: string; // originating order
  date: string; // ISO timestamp
  machine: string;
  cluster: string;
  refundAmount: number;
  refundType: RefundType;
  paymentMode: string;
  refundStatus: RefundStatus;
  details: {
    reason: string;
    initiatedBy: string;
    gatewayRef: string;
  };
}
