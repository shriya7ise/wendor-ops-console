import { BaseQuery, ListMeta } from './common';

export type WalletUserStatus = 'Active' | 'Blocked';
export type TopupMode = 'UPI' | 'Card' | 'Cash' | 'Net Banking';

export interface WalletTopup {
  id: string;
  amount: number;
  mode: TopupMode;
  date: string;
}

export interface WalletUser {
  id: string;
  name: string;
  walletId: string;
  balance: number;
  rfid: string;
  phone: string;
  email: string;
  status: WalletUserStatus;
  createdAt: string;
  topups: WalletTopup[];
}

export interface WalletUserListResponse {
  data: WalletUser[];
  meta: ListMeta;
  summary: {
    totalWalletUsers: number;
    activeCount: number;
    blockedCount: number;
    totalWalletBalance: number;
  };
}

export interface WalletUserFilterOptions {
  statuses: WalletUserStatus[];
  topupModes: TopupMode[];
}

export interface WalletUserQuery extends BaseQuery {}

export interface CreateWalletUserInput {
  name: string;
  rfid: string;
  phone: string;
  email?: string;
  initialBalance?: number;
}

export interface BulkAddWalletUsersInput {
  users: CreateWalletUserInput[];
}

export interface TopupInput {
  amount: number;
  mode: TopupMode;
}
