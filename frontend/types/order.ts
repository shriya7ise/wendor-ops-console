import { BaseQuery, ListMeta } from './common';

export type VendStatus = 'Success' | 'Failed' | 'Pending';
export type PaymentMode = 'UPI' | 'Card' | 'Wallet' | 'Cash' | 'Swift RFID';

export interface Order {
  id: string;
  cluster: string;
  time: string;
  machine: string;
  amount: number;
  paymentMode: PaymentMode;
  vendStatus: VendStatus;
  details: {
    product: string;
    quantity: number;
    gatewayRef: string;
    customerPhone: string;
    slot: string;
  };
}

export interface OrderListResponse {
  data: Order[];
  meta: ListMeta;
  summary: {
    totalTransactions: number;
    totalAmount: number;
    successCount: number;
    failedCount: number;
    pendingCount: number;
  };
}

export interface OrderFilterOptions {
  clusters: string[];
  machines: string[];
  paymentModes: PaymentMode[];
  statuses: VendStatus[];
}

export interface OrderQuery extends BaseQuery {
  paymentMode?: string;
  cluster?: string;
  machine?: string;
  dateFrom?: string;
  dateTo?: string;
}
