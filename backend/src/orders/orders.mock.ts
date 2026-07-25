import { CLUSTERS, MACHINES, PAYMENT_MODES, mulberry32, pick } from '../common/mock.util';
import { Order, PaymentMode, VendStatus } from './interfaces/order.interface';

const VEND_STATUSES: VendStatus[] = ['Success', 'Success', 'Success', 'Failed', 'Pending'];
const PRODUCTS = [
  'Coca-Cola 250ml',
  'Lays Classic 52g',
  'Britannia Good Day',
  'Real Juice 200ml',
  'KitKat 4-finger',
  'Bisleri 500ml',
];

function generateOrders(count: number): Order[] {
  const rng = mulberry32(42);
  const now = Date.now();
  const list: Order[] = [];

  for (let i = 0; i < count; i++) {
    const status = pick(rng, VEND_STATUSES);
    const amount = Math.round((10 + rng() * 190) * 100) / 100;
    const daysAgo = Math.floor(rng() * 30);
    const hoursAgo = Math.floor(rng() * 24);
    const time = new Date(
      now - daysAgo * 86400000 - hoursAgo * 3600000,
    ).toISOString();

    list.push({
      id: `TXN${String(100000 + i)}`,
      cluster: pick(rng, CLUSTERS),
      time,
      machine: pick(rng, MACHINES),
      amount,
      paymentMode: pick(rng, PAYMENT_MODES) as PaymentMode,
      vendStatus: status,
      details: {
        product: pick(rng, PRODUCTS),
        quantity: 1 + Math.floor(rng() * 3),
        gatewayRef: `GW-${Math.floor(rng() * 900000 + 100000)}`,
        customerPhone: `+91 9${Math.floor(rng() * 900000000 + 100000000)}`,
        slot: `${pick(rng, ['A', 'B', 'C', 'D'])}${1 + Math.floor(rng() * 8)}`,
      },
    });
  }

  return list.sort((a, b) => (a.time < b.time ? 1 : -1));
}

export const MOCK_ORDERS: Order[] = generateOrders(120);
export const CLUSTER_OPTIONS = CLUSTERS;
export const MACHINE_OPTIONS = MACHINES;
export const PAYMENT_MODE_OPTIONS = PAYMENT_MODES;
export const VEND_STATUS_OPTIONS: VendStatus[] = ['Success', 'Failed', 'Pending'];
