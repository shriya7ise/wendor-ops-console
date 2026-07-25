import { BaseQuery, ListMeta } from './common';

export type CancelledStatus = 'Cancelled' | 'Failed';
export type FailureReason = 'Gateway Timeout' | 'Machine Fault' | 'User Cancelled';

export interface CancelledCartItem {
  id: string;
  cluster: string;
  date: string;
  gatewayId: string;
  machine: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: CancelledStatus;
  details: {
    failureReason: FailureReason;
    slot: string;
  };
}

export interface CancelledCartListResponse {
  data: CancelledCartItem[];
  meta: ListMeta;
  summary: {
    totalRequests: number;
    totalAmount: number;
  };
}

export interface CancelledCartFilterOptions {
  clusters: string[];
  machines: string[];
  statuses: CancelledStatus[];
  failureReasons: FailureReason[];
}

export interface CancelledCartQuery extends BaseQuery {
  cluster?: string;
  machine?: string;
  failureReason?: string;
}
