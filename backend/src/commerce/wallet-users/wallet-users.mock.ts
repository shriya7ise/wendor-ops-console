import { mulberry32, pick } from '../../common/mock.util';
import { WalletTopup, WalletUser, WalletUserStatus } from './interfaces/wallet-user.interface';

const FIRST_NAMES = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Krishna',
  'Ishaan', 'Rohan', 'Ananya', 'Diya', 'Saanvi', 'Aadhya', 'Kiara', 'Myra',
  'Priya', 'Neha', 'Riya', 'Pooja',
];
const LAST_NAMES = [
  'Sharma', 'Verma', 'Gupta', 'Reddy', 'Iyer', 'Nair', 'Singh', 'Mehta',
  'Kapoor', 'Joshi', 'Rao', 'Patel',
];
const TOPUP_MODES: WalletTopup['mode'][] = ['UPI', 'Card', 'Cash', 'Net Banking'];
const STATUSES: WalletUserStatus[] = ['Active', 'Active', 'Active', 'Active', 'Blocked'];

function randomTopups(rng: () => number, walletIndex: number): WalletTopup[] {
  const count = Math.floor(rng() * 4); // 0-3 historical top-ups
  const topups: WalletTopup[] = [];
  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(rng() * 90);
    topups.push({
      id: `TOP${walletIndex}${i}${Math.floor(rng() * 1000)}`,
      amount: Math.round((50 + rng() * 450) / 10) * 10,
      mode: pick(rng, TOPUP_MODES),
      date: new Date(Date.now() - daysAgo * 86400000).toISOString(),
    });
  }
  return topups.sort((a, b) => (a.date < b.date ? 1 : -1));
}

function generateWalletUsers(count: number): WalletUser[] {
  const rng = mulberry32(909);
  const list: WalletUser[] = [];

  for (let i = 0; i < count; i++) {
    const first = pick(rng, FIRST_NAMES);
    const last = pick(rng, LAST_NAMES);
    const daysAgo = Math.floor(rng() * 200);
    const topups = randomTopups(rng, i);

    list.push({
      id: `WU${String(10001 + i)}`,
      name: `${first} ${last}`,
      walletId: `WLT-${String(500000 + i * 7)}`,
      balance: Math.round((20 + rng() * 980) * 100) / 100,
      rfid: `RFID${String(7000000 + Math.floor(rng() * 999999))}`,
      phone: `9${String(100000000 + Math.floor(rng() * 899999999))}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@example.com`,
      status: pick(rng, STATUSES),
      createdAt: new Date(Date.now() - daysAgo * 86400000).toISOString(),
      topups,
    });
  }

  return list;
}

// Mutable on purpose: create / bulk-add / status / top-up actions all
// write back to this array, same pattern used across the codebase.
export const MOCK_WALLET_USERS: WalletUser[] = generateWalletUsers(60);
export const STATUS_OPTIONS: WalletUserStatus[] = ['Active', 'Blocked'];
export const TOPUP_MODE_OPTIONS = TOPUP_MODES;
