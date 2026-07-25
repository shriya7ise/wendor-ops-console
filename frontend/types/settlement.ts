import { BaseQuery, ListMeta } from './common';

export type SettlementStatus = 'Active' | 'Inactive';

export interface Settlement {
  id: string;
  gateway: string;
  merchantId: string;
  serviceProvider: string;
  machines: string[];
  status: SettlementStatus;
  createdAt: string;
}

export interface SettlementListResponse {
  data: Settlement[];
  meta: ListMeta;
  summary: {
    totalSettlements: number;
    activeCount: number;
    inactiveCount: number;
    totalMachinesLinked: number;
  };
}

export interface SettlementFilterOptions {
  gateways: string[];
  serviceProviders: string[];
  machines: string[];
  statuses: SettlementStatus[];
}

export interface SettlementQuery extends BaseQuery {
  gateway?: string;
  serviceProvider?: string;
  machine?: string;
}

export interface CreateSettlementInput {
  gateway: string;
  merchantId: string;
  serviceProvider: string;
  machines?: string[];
  status?: SettlementStatus;
}

export interface BulkAssignInput {
  settlementId: string;
  machines: string[];
}
