import { CLUSTERS, MACHINES, PAYMENT_MODES, mulberry32, pick } from '../common/mock.util';
import {
  OngoingTransaction,
  PaymentStatus,
} from './interfaces/ongoing-transaction.interface';

const STATUSES: PaymentStatus[] = ['Initiated', 'Processing', 'Awaiting Gateway'];

function generateOngoing(count: number): OngoingTransaction[] {
  const rng = mulberry32(202);
  const now = Date.now();
  const list: OngoingTransaction[] = [];

  for (let i = 0; i < count; i++) {
    const minutesAgo = Math.floor(rng() * 20); // still "ongoing" — recent
    const date = new Date(now - minutesAgo * 60000).toISOString();

    list.push({
      id: `TXN${String(200000 + i)}`,
      date,
      machine: pick(rng, MACHINES),
      cluster: pick(rng, CLUSTERS),
      amount: Math.round((10 + rng() * 190) * 100) / 100,
      paymentMode: pick(rng, PAYMENT_MODES),
      paymentStatus: pick(rng, STATUSES),
      details: {
        secondsInFlight: minutesAgo * 60 + Math.floor(rng() * 60),
        gatewayRef: `GW-${Math.floor(rng() * 900000 + 100000)}`,
      },
    });
  }

  return list.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export const MOCK_ONGOING: OngoingTransaction[] = generateOngoing(35);
export const CLUSTER_OPTIONS = CLUSTERS;
export const MACHINE_OPTIONS = MACHINES;
export const PAYMENT_STATUS_OPTIONS = STATUSES;
