import { BaseQuery, ListMeta } from './common';

export type OngoingPaymentStatus = 'Initiated' | 'Processing' | 'Awaiting Gateway';

export interface OngoingTransaction {
  id: string;
  date: string;
  machine: string;
  cluster: string;
  amount: number;
  paymentMode: string;
  paymentStatus: OngoingPaymentStatus;
  details: {
    secondsInFlight: number;
    gatewayRef: string;
  };
}

export interface OngoingListResponse {
  data: OngoingTransaction[];
  meta: ListMeta;
  summary: {
    totalOngoing: number;
    totalAmount: number;
  };
}

export interface OngoingFilterOptions {
  clusters: string[];
  machines: string[];
  statuses: OngoingPaymentStatus[];
}

export interface OngoingQuery extends BaseQuery {
  cluster?: string;
  machine?: string;
}
