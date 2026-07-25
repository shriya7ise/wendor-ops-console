import { Granularity } from './dto/date-range.dto';

export type Bucket = { periodStart: Date; label: string };

export function sum(arr: number[]) { return arr.reduce((a, b) => a + b, 0); }
export function avg(arr: number[]) { return arr.length ? sum(arr) / arr.length : 0; }
export function stdDev(arr: number[]) {
  if (arr.length < 2) return 0;
  const m = avg(arr);
  return Math.sqrt(avg(arr.map((x) => (x - m) ** 2)));
}
export function round2(n: number) { return Math.round(n * 100) / 100; }
export function clamp(n: number, min: number, max: number) { return Math.min(max, Math.max(min, n)); }
export function pctDelta(prev: number, curr: number) { return prev ? round2(((curr - prev) / prev) * 100) : null; }

export type AttendanceStatus = 'ON_TIME' | 'LATE_CHECKIN' | 'MISSED_CHECKOUT' | 'OVERTIME' | 'PENDING';

/** Classifies a single attendance record into the 5-state legend the PRD
 *  uses on both Attendance Analytics (1.9.6) and Attendance Exports (1.11):
 *  On Time, Late Check-In, Early/Missed Check-Out, Overtime, Pending.
 *  Shared here so all three attendance-family pages agree on what "late" or
 *  "overtime" means instead of each re-deriving its own threshold. */
export function classifyAttendance(
  record: { checkIn: Date; checkOut: Date | null },
  now: Date = new Date(),
  lateThresholdHour = 10,
  earlyCheckoutHours = 7,
  overtimeHours = 9,
): AttendanceStatus {
  if (record.checkIn.getHours() >= lateThresholdHour) return 'LATE_CHECKIN';
  if (!record.checkOut) {
    const sameCalendarDay = record.checkIn.toDateString() === now.toDateString();
    return sameCalendarDay ? 'PENDING' : 'MISSED_CHECKOUT';
  }
  const hoursWorked = (record.checkOut.getTime() - record.checkIn.getTime()) / 3_600_000;
  if (hoursWorked < earlyCheckoutHours) return 'MISSED_CHECKOUT';
  if (hoursWorked > overtimeHours) return 'OVERTIME';
  return 'ON_TIME';
}

export function hoursBetween(a: Date, b: Date) { return (b.getTime() - a.getTime()) / 3_600_000; }

/** "9:05 AM" style label for a Date's time-of-day — used by Attendance
 *  Metrics' Avg In/Out, Earliest In, Latest Out columns. */
export function timeOfDayLabel(d: Date) {
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

/** Converts an average "minutes since midnight" figure (which won't land on
 *  a whole minute) back into a "9:05 AM" label — used for Attendance
 *  Metrics' Avg In/Out Time, where the input is a mean across many
 *  check-in/out timestamps rather than one real Date. */
export function minutesToTimeLabel(totalMinutes: number) {
  const h24 = Math.floor(totalMinutes / 60) % 24;
  const m = Math.round(totalMinutes % 60);
  const period = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

export function makeBuckets(from: Date, to: Date, granularity: Granularity): Bucket[] {
  const buckets: Bucket[] = [];
  let cursor = startOfBucket(from, granularity);
  while (cursor < to) {
    buckets.push({ periodStart: new Date(cursor), label: formatLabel(cursor, granularity) });
    cursor = nextBucketStart(cursor, granularity);
  }
  return buckets;
}
export function startOfBucket(d: Date, granularity: Granularity) {
  const x = new Date(d);
  if (granularity === 'day') { x.setHours(0, 0, 0, 0); return x; }
  if (granularity === 'week') { x.setHours(0, 0, 0, 0); x.setDate(x.getDate() - x.getDay()); return x; }
  x.setHours(0, 0, 0, 0); x.setDate(1); return x;
}
export function nextBucketStart(d: Date, granularity: Granularity) {
  const x = new Date(d);
  if (granularity === 'day') x.setDate(x.getDate() + 1);
  else if (granularity === 'week') x.setDate(x.getDate() + 7);
  else x.setMonth(x.getMonth() + 1);
  return x;
}
export function formatLabel(d: Date, granularity: Granularity) {
  if (granularity === 'month') return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  return d.toISOString().slice(0, 10);
}

/** Buckets an arbitrary list of dated items into a time series, summing a
 *  numeric value per bucket. Used for every "X Trend" chart across the app. */
export function bucketSeries<T>(
  items: T[],
  getDate: (item: T) => Date,
  getValue: (item: T) => number,
  from: Date,
  to: Date,
  granularity: Granularity,
) {
  const buckets = makeBuckets(from, to, granularity);
  return buckets.map(({ periodStart, label }) => {
    const next = nextBucketStart(periodStart, granularity);
    const inBucket = items.filter((it) => {
      const d = getDate(it);
      return d >= periodStart && d < next;
    });
    return { label, value: round2(sum(inBucket.map(getValue))) };
  });
}

/** Buckets items into the 24 hours of the day (0–23), summing across every
 *  calendar day in range into one hour-of-day profile. Backs the "Hour-wise"
 *  drill-down on Sales Analytics (1.9.2) and Transaction Analytics (1.9.4) —
 *  same dataset as the existing day trend, just re-aggregated by hour
 *  instead of by calendar date. */
export function bucketByHourOfDay<T>(
  items: T[],
  getDate: (item: T) => Date,
  getValue: (item: T) => number,
) {
  const hours = Array.from({ length: 24 }, (_, h) => ({ label: hourLabel(h), value: 0 }));
  for (const it of items) {
    const h = getDate(it).getHours();
    hours[h].value += getValue(it);
  }
  return hours.map((b) => ({ ...b, value: round2(b.value) }));
}

function hourLabel(h: number) {
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12} ${period}`;
}

/** Generic "top N / bottom N by a metric" grouping, used by every leaderboard
 *  table (top machines, worst clusters, top products, ...). */
export function topBottom<T>(
  items: T[],
  keyFn: (item: T) => string,
  valueFn: (item: T) => number,
  limit = 5,
) {
  const map = new Map<string, number>();
  for (const it of items) {
    const key = keyFn(it);
    map.set(key, (map.get(key) ?? 0) + valueFn(it));
  }
  const sorted = [...map.entries()].map(([name, value]) => ({ name, value: round2(value) })).sort((a, b) => b.value - a.value);
  return { top: sorted.slice(0, limit), worst: sorted.slice(-limit).reverse() };
}
