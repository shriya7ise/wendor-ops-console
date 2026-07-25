export type CancelledStatus = 'Cancelled' | 'Failed';

export interface CancelledCartItem {
  id: string; // Transaction / Request ID
  cluster: string;
  date: string; // ISO timestamp
  gatewayId: string;
  machine: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: CancelledStatus;
  details: {
    failureReason: 'Gateway Timeout' | 'Machine Fault' | 'User Cancelled';
    slot: string;
  };
}
