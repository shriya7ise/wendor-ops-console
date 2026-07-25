import { CLUSTERS, MACHINES, PAYMENT_MODES, mulberry32, pick } from '../common/mock.util';
import {
  CancelledCartItem,
  CancelledStatus,
} from './interfaces/cancelled-cart.interface';

const STATUSES: CancelledStatus[] = ['Cancelled', 'Cancelled', 'Failed'];
const REASONS: CancelledCartItem['details']['failureReason'][] = [
  'Gateway Timeout',
  'Machine Fault',
  'User Cancelled',
];

function generateCancelled(count: number): CancelledCartItem[] {
  const rng = mulberry32(303);
  const now = Date.now();
  const list: CancelledCartItem[] = [];

  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(rng() * 30);
    const date = new Date(now - daysAgo * 86400000).toISOString();

    list.push({
      id: `REQ${String(700000 + i)}`,
      cluster: pick(rng, CLUSTERS),
      date,
      gatewayId: `GW-${Math.floor(rng() * 900000 + 100000)}`,
      machine: pick(rng, MACHINES),
      amount: Math.round((10 + rng() * 190) * 100) / 100,
      paymentMethod: pick(rng, PAYMENT_MODES),
      paymentStatus: pick(rng, STATUSES),
      details: {
        failureReason: pick(rng, REASONS),
        slot: `${pick(rng, ['A', 'B', 'C', 'D'])}${1 + Math.floor(rng() * 8)}`,
      },
    });
  }

  return list.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export const MOCK_CANCELLED_CART: CancelledCartItem[] = generateCancelled(70);
export const CLUSTER_OPTIONS = CLUSTERS;
export const MACHINE_OPTIONS = MACHINES;
export const PAYMENT_STATUS_OPTIONS: CancelledStatus[] = ['Cancelled', 'Failed'];
export const FAILURE_REASON_OPTIONS = REASONS;
