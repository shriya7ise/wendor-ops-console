import { MACHINES, mulberry32, pick } from '../../common/mock.util';
import { Settlement, SettlementStatus } from './interfaces/settlement.interface';

const GATEWAYS = ['Razorpay', 'PayU', 'Cashfree', 'PhonePe PG', 'Paytm PG'];
const PROVIDERS = ['HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Yes Bank', 'Kotak Mahindra Bank'];
const STATUSES: SettlementStatus[] = ['Active', 'Active', 'Active', 'Inactive'];

function randomMachines(rng: () => number): string[] {
  const count = 1 + Math.floor(rng() * 3); // 1-3 machines per settlement
  const set = new Set<string>();
  while (set.size < count) set.add(pick(rng, MACHINES));
  return Array.from(set);
}

function generateSettlements(count: number): Settlement[] {
  const rng = mulberry32(707);
  const list: Settlement[] = [];

  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(rng() * 120);
    list.push({
      id: `STL${String(1001 + i)}`,
      gateway: pick(rng, GATEWAYS),
      merchantId: `MER${String(500000 + Math.floor(rng() * 99999))}`,
      serviceProvider: pick(rng, PROVIDERS),
      machines: randomMachines(rng),
      status: pick(rng, STATUSES),
      createdAt: new Date(Date.now() - daysAgo * 86400000).toISOString(),
    });
  }

  return list;
}

// Mutable on purpose: create / bulk-assign / status actions all write back
// to this array, same pattern as products.mock.ts.
export const MOCK_SETTLEMENTS: Settlement[] = generateSettlements(24);
export const GATEWAY_OPTIONS = GATEWAYS;
export const PROVIDER_OPTIONS = PROVIDERS;
export const MACHINE_OPTIONS = MACHINES;
export const STATUS_OPTIONS: SettlementStatus[] = ['Active', 'Inactive'];
