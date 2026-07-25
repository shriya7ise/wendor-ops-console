export type SettlementStatus = 'Active' | 'Inactive';

// PRD 2.2.3 — Settlements
// "Manages payment gateway settlement configurations." Each settlement
// record links a payment gateway + merchant account to one or more
// vending machines, so transactions on those machines settle to the
// right merchant account.
export interface Settlement {
  id: string; // Settlement ID e.g. STL1001
  gateway: string; // Payment gateway, e.g. Razorpay, PayU
  merchantId: string; // Merchant identifier
  serviceProvider: string; // Gateway / acquiring-bank provider
  machines: string[]; // Linked machines
  status: SettlementStatus;
  createdAt: string; // ISO date
}
