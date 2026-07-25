import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SupplierQueryDto } from './dto/supplier-query.dto';
import { Granularity } from '../../common/dto/date-range.dto';

type Bucket = { periodStart: Date; label: string };

@Injectable()
export class SupplierAnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Autocomplete: `Supplier` field in the filter bar. */
  async search(orgId: string, term: string, limit = 10) {
    return this.prisma.supplier.findMany({
      where: {
        orgId,
        isActive: true,
        OR: [
          { name: { contains: term, mode: 'insensitive' } },
          { code: { contains: term, mode: 'insensitive' } },
        ],
      },
      select: { id: true, name: true, code: true },
      take: limit,
      orderBy: { name: 'asc' },
    });
  }

  async getAnalysis(orgId: string, query: SupplierQueryDto) {
    const supplier = await this.resolveSupplier(orgId, query);
    const { from, to } = query.resolveRange();
    const granularity = (query.granularity ?? 'week') as Granularity;

    const [pos, refills] = await Promise.all([
      this.prisma.purchaseOrder.findMany({
        where: { supplierId: supplier.id, orderedAt: { gte: from, lte: to } },
        include: { items: true },
        orderBy: { orderedAt: 'asc' },
      }),
      this.prisma.refill.findMany({
        where: { supplierId: supplier.id, eventAt: { gte: from, lte: to } },
        include: { machine: true, product: true },
        orderBy: { eventAt: 'asc' },
      }),
    ]);

    // Previous period of equal length, used for trend deltas on the KPI cards.
    const spanMs = to.getTime() - from.getTime();
    const prevFrom = new Date(from.getTime() - spanMs);
    const prevTo = new Date(from.getTime());
    const prevPos = await this.prisma.purchaseOrder.findMany({
      where: { supplierId: supplier.id, orderedAt: { gte: prevFrom, lte: prevTo } },
      include: { items: true },
    });

    const kpis = this.computeKpis(pos);
    const prevKpis = this.computeKpis(prevPos);

    return {
      supplier: { id: supplier.id, name: supplier.name, code: supplier.code },
      range: { from, to, granularity },
      kpis,
      trend: {
        orderedValueDeltaPct: pctDelta(prevKpis.orderedValue, kpis.orderedValue),
        fillRateDeltaPts: kpis.fillRate - prevKpis.fillRate,
        leadTimeDeltaDays: kpis.avgLeadTimeDays - prevKpis.avgLeadTimeDays,
      },
      healthScore: this.computeHealthScore(kpis, pos),
      insights: this.buildInsights(kpis, prevKpis, pos),
      procurementTrend: this.bucketPOs(pos, from, to, granularity),
      fillRateTrend: this.bucketFillRate(pos, from, to, granularity),
      leadTimeDistribution: this.leadTimeHistogram(pos),
      refillsByMachine: this.groupRefills(refills, (r) => r.machine.name),
      refillsByItem: this.groupRefills(refills, (r) => r.product.name),
      refillRegularity: this.refillRegularity(refills, from, to),
    };
  }

  // ── Supplier resolution ──────────────────────────────────────────────
  private async resolveSupplier(orgId: string, query: SupplierQueryDto) {
    const where = query.supplierId
      ? { orgId, id: query.supplierId }
      : query.supplier
        ? { orgId, name: { equals: query.supplier, mode: 'insensitive' as const } }
        : null;

    if (!where) {
      throw new NotFoundException('Provide a supplier or supplierId to load analytics.');
    }

    const supplier = await this.prisma.supplier.findFirst({ where });
    if (!supplier) {
      throw new NotFoundException(`Supplier not found for this organisation.`);
    }
    return supplier;
  }

  // ── Core KPI block (matches the 12 stat cards in the UI) ─────────────
  private computeKpis(pos: Array<{ status: string; orderedAt: Date | null; receivedAt: Date | null; items: Array<{ orderedQty: number; receivedQty: number; unitCost: any }> }>) {
    let orderedQty = 0, receivedQty = 0, orderedValue = 0, receivedValue = 0;
    let cancelledPOs = 0, partialPOs = 0, fullyReceivedPOs = 0;
    const leadTimes: number[] = [];

    for (const po of pos) {
      if (po.status === 'CANCELLED') cancelledPOs++;
      else if (po.status === 'PARTIAL') partialPOs++;
      else if (po.status === 'RECEIVED') fullyReceivedPOs++;

      for (const item of po.items) {
        orderedQty += item.orderedQty;
        receivedQty += item.receivedQty;
        orderedValue += item.orderedQty * Number(item.unitCost);
        receivedValue += item.receivedQty * Number(item.unitCost);
      }

      if (po.orderedAt && po.receivedAt) {
        leadTimes.push((po.receivedAt.getTime() - po.orderedAt.getTime()) / 86_400_000);
      }
    }

    const avgLeadTimeDays = leadTimes.length ? avg(leadTimes) : 0;

    return {
      poCount: pos.length,
      orderedQty,
      receivedQty,
      orderedValue: round2(orderedValue),
      receivedValue: round2(receivedValue),
      fillRate: orderedQty ? round2((receivedQty / orderedQty) * 100) : 0,
      qtyVariance: receivedQty - orderedQty,
      valueVariance: round2(receivedValue - orderedValue),
      cancelledPOs,
      partialPOs,
      fullyReceivedPOs,
      avgLeadTimeDays: round2(avgLeadTimeDays),
      leadTimeStdDevDays: round2(stdDev(leadTimes)),
    };
  }

  // ── Health score: the "at a glance, is this supplier okay" number ────
  // Weighted composite — fill rate matters most, then reliability
  // (cancellation rate), then consistency of lead time (not just its
  // average, since a supplier that's "usually fast, sometimes very slow"
  // is operationally worse than one that's consistently mediocre).
  private computeHealthScore(kpis: ReturnType<SupplierAnalyticsService['computeKpis']>, pos: any[]) {
    const fillScore = clamp(kpis.fillRate, 0, 100);
    const cancelRate = pos.length ? kpis.cancelledPOs / pos.length : 0;
    const reliabilityScore = clamp((1 - cancelRate) * 100, 0, 100);
    const consistencyScore = kpis.avgLeadTimeDays
      ? clamp(100 - (kpis.leadTimeStdDevDays / kpis.avgLeadTimeDays) * 100, 0, 100)
      : 100;

    const score = round2(fillScore * 0.5 + reliabilityScore * 0.3 + consistencyScore * 0.2);
    const tier = score >= 85 ? 'A' : score >= 70 ? 'B' : score >= 50 ? 'C' : 'D';
    return { score, tier };
  }

  // ── Auto-generated, plain-language insights for the operator ─────────
  private buildInsights(kpis: any, prevKpis: any, pos: any[]) {
    const insights: Array<{ level: 'info' | 'warning' | 'critical'; message: string }> = [];

    if (kpis.poCount === 0) {
      insights.push({ level: 'info', message: 'No purchase orders in this range yet.' });
      return insights;
    }

    if (kpis.fillRate < 80) {
      insights.push({
        level: kpis.fillRate < 60 ? 'critical' : 'warning',
        message: `Fill rate is ${kpis.fillRate}% — this supplier is under-delivering on ordered quantity. Consider a backup source for critical SKUs.`,
      });
    }
    const fillDelta = kpis.fillRate - prevKpis.fillRate;
    if (fillDelta <= -10) {
      insights.push({ level: 'warning', message: `Fill rate dropped ${Math.abs(round2(fillDelta))} pts vs the previous period.` });
    }

    const cancelRate = kpis.cancelledPOs / pos.length;
    if (cancelRate > 0.15) {
      insights.push({
        level: 'warning',
        message: `${kpis.cancelledPOs} of ${pos.length} POs were cancelled (${round2(cancelRate * 100)}%) — worth a conversation with the account manager.`,
      });
    }

    if (kpis.leadTimeStdDevDays > kpis.avgLeadTimeDays && kpis.avgLeadTimeDays > 0) {
      insights.push({
        level: 'warning',
        message: `Lead times are inconsistent (avg ${kpis.avgLeadTimeDays}d, swings of ±${kpis.leadTimeStdDevDays}d) — plan buffer stock rather than tight reorder points.`,
      });
    }

    if (insights.length === 0) {
      insights.push({ level: 'info', message: 'Fill rate, cancellations, and lead time are all within healthy range.' });
    }

    return insights;
  }

  // ── Time-bucketed series ──────────────────────────────────────────────
  private bucketPOs(pos: any[], from: Date, to: Date, granularity: Granularity) {
    const buckets = makeBuckets(from, to, granularity);
    return buckets.map(({ periodStart, label }) => {
      const next = nextBucketStart(periodStart, granularity);
      const inBucket = pos.filter((po) => po.orderedAt && po.orderedAt >= periodStart && po.orderedAt < next);
      const qty = sum(inBucket.flatMap((po) => po.items.map((i: any) => i.orderedQty)));
      const value = sum(inBucket.flatMap((po) => po.items.map((i: any) => i.orderedQty * Number(i.unitCost))));
      return { label, qty, value: round2(value) };
    });
  }

  private bucketFillRate(pos: any[], from: Date, to: Date, granularity: Granularity) {
    const buckets = makeBuckets(from, to, granularity);
    return buckets.map(({ periodStart, label }) => {
      const next = nextBucketStart(periodStart, granularity);
      const inBucket = pos.filter((po) => po.orderedAt && po.orderedAt >= periodStart && po.orderedAt < next);
      const ordered = sum(inBucket.flatMap((po) => po.items.map((i: any) => i.orderedQty)));
      const received = sum(inBucket.flatMap((po) => po.items.map((i: any) => i.receivedQty)));
      return { label, fillRate: ordered ? round2((received / ordered) * 100) : null };
    });
  }

  private leadTimeHistogram(pos: any[]) {
    const buckets = [
      { label: '0-2d', min: 0, max: 2 },
      { label: '3-5d', min: 3, max: 5 },
      { label: '6-10d', min: 6, max: 10 },
      { label: '11-20d', min: 11, max: 20 },
      { label: '20d+', min: 21, max: Infinity },
    ];
    const counts = buckets.map((b) => ({ label: b.label, count: 0 }));
    for (const po of pos) {
      if (!po.orderedAt || !po.receivedAt) continue;
      const days = (po.receivedAt.getTime() - po.orderedAt.getTime()) / 86_400_000;
      const idx = buckets.findIndex((b) => days >= b.min && days <= b.max);
      if (idx >= 0) counts[idx].count++;
    }
    return counts;
  }

  // ── Refill tables ──────────────────────────────────────────────────
  private groupRefills(refills: any[], keyFn: (r: any) => string) {
    const map = new Map<string, { qty: number; events: number; days: Set<string> }>();
    for (const r of refills) {
      const key = keyFn(r);
      const entry = map.get(key) ?? { qty: 0, events: 0, days: new Set<string>() };
      entry.qty += r.quantity;
      entry.events += 1;
      entry.days.add(r.eventAt.toISOString().slice(0, 10));
      map.set(key, entry);
    }
    return [...map.entries()]
      .map(([name, v]) => ({ name, refillQty: v.qty, refillEvents: v.events, activeDays: v.days.size }))
      .sort((a, b) => b.refillQty - a.refillQty);
  }

  private refillRegularity(refills: any[], from: Date, to: Date) {
    const weeksInRange = Math.max(1, Math.ceil((to.getTime() - from.getTime()) / (7 * 86_400_000)));
    const byMachine = new Map<string, { events: number; weeksWithRefill: Set<number> }>();
    for (const r of refills) {
      const weekIdx = Math.floor((r.eventAt.getTime() - from.getTime()) / (7 * 86_400_000));
      const entry = byMachine.get(r.machine.name) ?? { events: 0, weeksWithRefill: new Set<number>() };
      entry.events += 1;
      entry.weeksWithRefill.add(weekIdx);
      byMachine.set(r.machine.name, entry);
    }
    return [...byMachine.entries()]
      .map(([machine, v]) => ({
        machine,
        events: v.events,
        weeksActive: weeksInRange,
        weeksWithRefill: v.weeksWithRefill.size,
        regularityScorePct: round2((v.weeksWithRefill.size / weeksInRange) * 100),
      }))
      .sort((a, b) => b.regularityScorePct - a.regularityScorePct);
  }
}

// ── helpers ──────────────────────────────────────────────────────────
function sum(arr: number[]) { return arr.reduce((a, b) => a + b, 0); }
function avg(arr: number[]) { return arr.length ? sum(arr) / arr.length : 0; }
function stdDev(arr: number[]) {
  if (arr.length < 2) return 0;
  const m = avg(arr);
  return Math.sqrt(avg(arr.map((x) => (x - m) ** 2)));
}
function round2(n: number) { return Math.round(n * 100) / 100; }
function clamp(n: number, min: number, max: number) { return Math.min(max, Math.max(min, n)); }
function pctDelta(prev: number, curr: number) { return prev ? round2(((curr - prev) / prev) * 100) : null; }

function makeBuckets(from: Date, to: Date, granularity: Granularity): Bucket[] {
  const buckets: Bucket[] = [];
  let cursor = startOfBucket(from, granularity);
  while (cursor < to) {
    buckets.push({ periodStart: new Date(cursor), label: formatLabel(cursor, granularity) });
    cursor = nextBucketStart(cursor, granularity);
  }
  return buckets;
}
function startOfBucket(d: Date, granularity: Granularity) {
  const x = new Date(d);
  if (granularity === 'day') { x.setHours(0, 0, 0, 0); return x; }
  if (granularity === 'week') { x.setHours(0, 0, 0, 0); x.setDate(x.getDate() - x.getDay()); return x; }
  x.setHours(0, 0, 0, 0); x.setDate(1); return x;
}
function nextBucketStart(d: Date, granularity: Granularity) {
  const x = new Date(d);
  if (granularity === 'day') x.setDate(x.getDate() + 1);
  else if (granularity === 'week') x.setDate(x.getDate() + 7);
  else x.setMonth(x.getMonth() + 1);
  return x;
}
function formatLabel(d: Date, granularity: Granularity) {
  if (granularity === 'month') return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  return d.toISOString().slice(0, 10);
}
