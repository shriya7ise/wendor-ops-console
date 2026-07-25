export type VendStatus = 'Success' | 'Failed' | 'Pending';
export type PaymentMode = 'UPI' | 'Card' | 'Wallet' | 'Cash' | 'Swift RFID';

export interface Order {
  id: string; // Transaction/Bill ID
  cluster: string;
  time: string; // ISO timestamp
  machine: string;
  amount: number;
  paymentMode: PaymentMode;
  vendStatus: VendStatus;
  // Extra detail-view-only fields (PRD 2.1.1.1 "Details" action)
  details: {
    product: string;
    quantity: number;
    gatewayRef: string;
    customerPhone: string;
    slot: string;
  };
}
