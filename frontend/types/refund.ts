import { BaseQuery, ListMeta } from './common';

export type RefundStatus = 'Refunded' | 'Pending' | 'Failed' | 'Disabled';
export type RefundType = 'Full' | 'Partial' | 'Goodwill';

export interface Refund {
  id: string;
  transactionId: string;
  date: string;
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

export interface RefundListResponse {
  data: Refund[];
  meta: ListMeta;
  summary: {
    totalRefunds: number;
    refundedCount: number;
    pendingCount: number;
    failedCount: number;
    disabledCount: number;
  };
}

export interface RefundFilterOptions {
  statuses: RefundStatus[];
  refundTypes: RefundType[];
  paymentModes: string[];
}

export interface RefundQuery extends BaseQuery {
  refundType?: string;
  paymentMode?: string;
}
