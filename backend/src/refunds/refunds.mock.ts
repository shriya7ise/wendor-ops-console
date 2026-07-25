import { CLUSTERS, MACHINES, PAYMENT_MODES, mulberry32, pick } from '../common/mock.util';
import { Refund, RefundStatus, RefundType } from './interfaces/refund.interface';

const REFUND_STATUSES: RefundStatus[] = [
  'Refunded',
  'Refunded',
  'Refunded',
  'Pending',
  'Failed',
  'Disabled',
];
const REFUND_TYPES: RefundType[] = ['Full', 'Partial', 'Goodwill'];
const REASONS = [
  'Product not dispensed',
  'Duplicate charge',
  'Payment captured, vend failed',
  'Customer cancelled before vend',
  'Wrong product dispensed',
];
const INITIATORS = ['System (auto)', 'Support Agent', 'Vendor Admin'];

function generateRefunds(count: number): Refund[] {
  const rng = mulberry32(101);
  const now = Date.now();
  const list: Refund[] = [];

  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(rng() * 30);
    const date = new Date(now - daysAgo * 86400000).toISOString();

    list.push({
      id: `RFD${String(500000 + i)}`,
      transactionId: `TXN${String(100000 + Math.floor(rng() * 120))}`,
      date,
      machine: pick(rng, MACHINES),
      cluster: pick(rng, CLUSTERS),
      refundAmount: Math.round((10 + rng() * 190) * 100) / 100,
      refundType: pick(rng, REFUND_TYPES),
      paymentMode: pick(rng, PAYMENT_MODES),
      refundStatus: pick(rng, REFUND_STATUSES),
      details: {
        reason: pick(rng, REASONS),
        initiatedBy: pick(rng, INITIATORS),
        gatewayRef: `GW-${Math.floor(rng() * 900000 + 100000)}`,
      },
    });
  }

  return list.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export const MOCK_REFUNDS: Refund[] = generateRefunds(80);
export const REFUND_STATUS_OPTIONS = ['Refunded', 'Pending', 'Failed', 'Disabled'];
export const REFUND_TYPE_OPTIONS = REFUND_TYPES;
export const PAYMENT_MODE_OPTIONS = PAYMENT_MODES;
