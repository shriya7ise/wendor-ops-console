export type WalletUserStatus = 'Active' | 'Blocked';

// A single wallet top-up / recharge event. Kept alongside the balance so
// the "Anything Else We Can Add" idea from the PRD (top-up history next
// to the balance) is already covered.
export interface WalletTopup {
  id: string;
  amount: number;
  mode: 'UPI' | 'Card' | 'Cash' | 'Net Banking';
  date: string; // ISO
}

// PRD 2.2.4 — Wallet Users
// "Manages users utilizing wallet-based vending payments."
export interface WalletUser {
  id: string; // Wallet user ID e.g. WU10001
  name: string; // Wallet User
  walletId: string; // Wallet ID — unique wallet identifier
  balance: number; // Wallet Balance
  rfid: string; // RFID Access
  phone: string;
  email: string;
  status: WalletUserStatus;
  createdAt: string; // ISO date
  topups: WalletTopup[];
}
