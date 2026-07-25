export type PaymentStatus = 'Initiated' | 'Processing' | 'Awaiting Gateway';

export interface OngoingTransaction {
  id: string; // Transaction ID
  date: string; // ISO timestamp
  machine: string;
  cluster: string;
  amount: number;
  paymentMode: string;
  paymentStatus: PaymentStatus;
  details: {
    secondsInFlight: number;
    gatewayRef: string;
  };
}
