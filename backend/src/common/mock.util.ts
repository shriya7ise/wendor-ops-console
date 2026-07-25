// Deterministic PRNG so every module's mock dataset is stable across
// server restarts (no random data changing on every refresh).
export function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

export const CLUSTERS = ['North Delhi', 'Gurgaon', 'Bangalore East', 'Pune Hinjewadi'];
export const MACHINES = [
  'VM-1021',
  'VM-1042',
  'VM-2007',
  'VM-2088',
  'VM-3010',
  'VM-3125',
];
export const PAYMENT_MODES = ['UPI', 'Card', 'Wallet', 'Cash', 'Swift RFID'] as const;
