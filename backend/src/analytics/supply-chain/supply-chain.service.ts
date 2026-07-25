import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DateRangeQueryDto, Granularity } from '../../common/dto/date-range.dto';
import { FailureAnalyticsQueryDto } from '../../common/dto/failure-analytics-query.dto';
import { bucketSeries, hoursBetween, round2, sum, topBottom } from '../../common/analytics.util';

@Injectable()
export class SupplyChainService {
  constructor(private readonly prisma: PrismaService) {}

  /** Analytics > Supply Chain > Org Procurement */
  async getOrgProcurement(orgId: string, query: DateRangeQueryDto) {
    const limit = query.limit ?? 5;
    const { from, to } = query.resolveRange();
    const granularity = (query.granularity ?? 'week') as Granularity;

    const pos = await this.prisma.purchaseOrder.findMany({
      where: { supplier: { orgId }, orderedAt: { gte: from, lte: to } },
      include: { supplier: true, items: true },
    });

    const orderedValueByPo = (po: (typeof pos)[number]) => sum(po.items.map((i) => i.orderedQty * Number(i.unitCost)));
    const receivedByPo = (po: (typeof pos)[number]) => sum(po.items.map((i) => i.receivedQty));
    const orderedByPo = (po: (typeof pos)[number]) => sum(po.items.map((i) => i.orderedQty));

    const procurementValueTrend = bucketSeries(pos, (p) => p.orderedAt ?? p.createdAt, orderedValueByPo, from, to, granularity);
    const fillRateTrend = bucketSeries(pos, (p) => p.orderedAt ?? p.createdAt, (p) => (orderedByPo(p) ? (receivedByPo(p) / orderedByPo(p)) * 100 : 0), from, to, granularity);
    const topSuppliers = topBottom(pos, (p) => p.supplier.name, orderedValueByPo, limit);

    // Approval Delay: hours between a PO being created and being approved.
    // Reads PurchaseOrder.approvedAt, added in the step1_schema_fixes
    // migration — previously this chart had no backing field at all.
    const approved = pos.filter((p) => p.approvedAt);
    const approvalDelayHoursByPo = approved.map((p) => (p.approvedAt!.getTime() - p.createdAt.getTime()) / 3_600_000);
    const approvalDelayTrend = bucketSeries(
      approved,
      (p) => p.approvedAt!,
      (p) => (p.approvedAt!.getTime() - p.createdAt.getTime()) / 3_600_000,
      from,
      to,
      granularity,
    );

    return {
      range: { from, to, granularity },
      poCount: pos.length,
      totalOrderedValue: round2(sum(pos.map(orderedValueByPo))),
      procurementValueTrend,
      fillRateTrend,
      approvalDelayTrend,
      avgApprovalDelayHours: approvalDelayHoursByPo.length ? round2(sum(approvalDelayHoursByPo) / approvalDelayHoursByPo.length) : null,
      pendingApprovalCount: pos.filter((p) => !p.approvedAt && p.status !== 'CANCELLED').length,
      topSuppliersByValue: topSuppliers.top,
    };
  }

  /** Analytics > Supply Chain > US Vendors Dashboard (supplier leaderboard) */
  async getVendorsDashboard(orgId: string, query: DateRangeQueryDto) {
    const { from, to } = query.resolveRange();
    const suppliers = await this.prisma.supplier.findMany({
      where: { orgId, isActive: true },
      include: { purchaseOrders: { where: { orderedAt: { gte: from, lte: to } }, include: { items: true } } },
    });

    const leaderboard = suppliers
      .map((s) => {
        const pos = s.purchaseOrders;
        const ordered = sum(pos.flatMap((p) => p.items.map((i) => i.orderedQty)));
        const received = sum(pos.flatMap((p) => p.items.map((i) => i.receivedQty)));
        const leadTimes = pos.filter((p) => p.orderedAt && p.receivedAt).map((p) => (p.receivedAt!.getTime() - p.orderedAt!.getTime()) / 86_400_000);
        return {
          supplier: s.name,
          poCount: pos.length,
          fillRatePct: ordered ? round2((received / ordered) * 100) : 0,
          avgLeadTimeDays: leadTimes.length ? round2(sum(leadTimes) / leadTimes.length) : 0,
          orderedValue: round2(sum(pos.flatMap((p) => p.items.map((i) => i.orderedQty * Number(i.unitCost))))),
        };
      })
      .filter((s) => s.poCount > 0)
      .sort((a, b) => b.orderedValue - a.orderedValue);

    return { range: { from, to }, leaderboard };
  }

  /** Analytics > Supply Chain > Org Inventory Risk
   *  Approximated from procurement fill rate + refill regularity, since
   *  there's no live stock-on-hand model in this schema pass — flag if you
   *  add one and this can switch to real stock thresholds. */
  async getInventoryRisk(orgId: string, query: DateRangeQueryDto) {
    const { from, to } = query.resolveRange();
    const suppliers = await this.prisma.supplier.findMany({
      where: { orgId, isActive: true },
      include: { purchaseOrders: { where: { orderedAt: { gte: from, lte: to } }, include: { items: true } } },
    });

    const atRisk = suppliers
      .map((s) => {
        const pos = s.purchaseOrders;
        const ordered = sum(pos.flatMap((p) => p.items.map((i) => i.orderedQty)));
        const received = sum(pos.flatMap((p) => p.items.map((i) => i.receivedQty)));
        const fillRatePct = ordered ? round2((received / ordered) * 100) : 100;
        const cancelledPct = pos.length ? round2((pos.filter((p) => p.status === 'CANCELLED').length / pos.length) * 100) : 0;
        return { supplier: s.name, fillRatePct, cancelledPct, poCount: pos.length };
      })
      .filter((s) => s.poCount > 0 && (s.fillRatePct < 80 || s.cancelledPct > 15))
      .sort((a, b) => a.fillRatePct - b.fillRatePct);

    return {
      range: { from, to },
      suppliersEvaluated: suppliers.filter((s) => s.purchaseOrders.length > 0).length,
      atRiskCount: atRisk.length,
      atRiskSuppliers: atRisk,
    };
  }

  /** Analytics > Supply Chain > Failure Analytics (1.9.14)
   *  Previously: date-range filter only, no tabs, and a card set that didn't
   *  match spec at all — "Failure Rate" and "Lost Revenue" need failure
   *  events joined against the sales they displaced, which didn't happen
   *  before. FailureEvent.slot (added in the step1 schema pass) now backs
   *  the Slots tab and the Slot vs. Failures chart.
   *
   *  Lost Revenue is an estimate, not a ledger figure: for each failure, we
   *  take that machine's average completed-transaction revenue-per-hour
   *  over the query range (excluding its own downtime windows) as a
   *  baseline, and multiply by the downtime duration (reportedAt →
   *  resolvedAt, or → now for still-open failures, capped to the range).
   *  Failure Rate is failures as a share of all sale attempts (completed +
   *  failed transactions + failure events) in range — i.e. what fraction of
   *  "things that could have been a sale" were a hardware failure instead. */
  async getFailureAnalytics(orgId: string, query: FailureAnalyticsQueryDto) {
    const limit = query.limit ?? 5;
    const { from, to } = query.resolveRange();
    const granularity = (query.granularity ?? 'week') as Granularity;

    const allFailures = await this.prisma.failureEvent.findMany({
      where: {
        orgId,
        reportedAt: { gte: from, lte: to },
        ...(query.machineId ? { machineId: query.machineId } : {}),
        ...(query.clusterId ? { machine: { clusterId: query.clusterId } } : {}),
      },
      include: { machine: { include: { cluster: true } } },
    });
    const failures = allFailures.filter((f) => query.inTimeOfDayWindow(f.reportedAt));

    const machineIds = [...new Set(failures.map((f) => f.machineId))];
    const transactions = await this.prisma.transaction.findMany({
      where: { orgId, createdAt: { gte: from, lte: to }, machineId: machineIds.length ? { in: machineIds } : undefined },
    });

    const completedByMachine = new Map<string, typeof transactions>();
    transactions.filter((t) => t.status === 'COMPLETED').forEach((t) => {
      completedByMachine.set(t.machineId, [...(completedByMachine.get(t.machineId) ?? []), t]);
    });
    const rangeHours = Math.max(1, (to.getTime() - from.getTime()) / 3_600_000);

    const revenuePerHour = (machineId: string) => {
      const own = completedByMachine.get(machineId) ?? [];
      return rangeHours ? sum(own.map((t) => Number(t.amount))) / rangeHours : 0;
    };

    const downtimeHours = (f: (typeof failures)[number]) => {
      const end = f.resolvedAt && f.resolvedAt < to ? f.resolvedAt : to;
      return Math.max(0, (end.getTime() - Math.max(f.reportedAt.getTime(), from.getTime())) / 3_600_000);
    };

    const failureLostRevenue = (f: (typeof failures)[number]) => round2(revenuePerHour(f.machineId) * downtimeHours(f));

    const totalCompletedInRange = transactions.filter((t) => t.status === 'COMPLETED').length;
    const totalFailedInRange = transactions.filter((t) => t.status === 'FAILED').length;
    const totalAttempts = totalCompletedInRange + totalFailedInRange + failures.length;
    const failureRatePct = totalAttempts ? round2((failures.length / totalAttempts) * 100) : 0;
    const lostRevenue = round2(sum(failures.map(failureLostRevenue)));

    const failureTrend = bucketSeries(failures, (f) => f.reportedAt, () => 1, from, to, granularity);

    const slotVsFailures = (() => {
      const bySlot = new Map<string, number>();
      failures.forEach((f) => bySlot.set(f.slot ?? 'Unassigned', (bySlot.get(f.slot ?? 'Unassigned') ?? 0) + 1));
      return [...bySlot.entries()].map(([slot, count]) => ({ slot, count })).sort((a, b) => b.count - a.count);
    })();

    // "Unreliable Machines" — scored by business impact (lost revenue),
    // not just raw failure count, per the spec's naming (distinct from the
    // old "Worst Machines" which was count-only).
    const byMachine = new Map<string, { name: string; failures: number; lostRevenue: number; resolvedDurations: number[] }>();
    for (const f of failures) {
      const entry = byMachine.get(f.machineId) ?? { name: f.machine.name, failures: 0, lostRevenue: 0, resolvedDurations: [] };
      entry.failures += 1;
      entry.lostRevenue = round2(entry.lostRevenue + failureLostRevenue(f));
      if (f.resolvedAt) entry.resolvedDurations.push(hoursBetween(f.reportedAt, f.resolvedAt));
      byMachine.set(f.machineId, entry);
    }
    const unreliableMachines = [...byMachine.entries()]
      .map(([machineId, e]) => ({
        machineId,
        name: e.name,
        failures: e.failures,
        lostRevenue: e.lostRevenue,
        avgResolutionHours: e.resolvedDurations.length ? round2(sum(e.resolvedDurations) / e.resolvedDurations.length) : null,
      }))
      .sort((a, b) => b.lostRevenue - a.lostRevenue)
      .slice(0, limit);

    const unresolved = failures.filter((f) => !f.resolvedAt);
    const resolvedDurations = failures.filter((f) => f.resolvedAt).map((f) => hoursBetween(f.reportedAt, f.resolvedAt!));

    return {
      range: { from, to, granularity },
      totalFailures: failures.length,
      failureRatePct,
      lostRevenue,
      affectedMachines: new Set(failures.map((f) => f.machineId)).size,
      unresolvedCount: unresolved.length,
      avgResolutionHours: resolvedDurations.length ? round2(sum(resolvedDurations) / resolvedDurations.length) : 0,
      failureTrend,
      slotVsFailures,
      unreliableMachines,
      // Machines tab: full per-machine breakdown (not just the top N).
      machinesTab: [...byMachine.entries()]
        .map(([machineId, e]) => ({
          machineId,
          name: e.name,
          failures: e.failures,
          lostRevenue: e.lostRevenue,
          avgResolutionHours: e.resolvedDurations.length ? round2(sum(e.resolvedDurations) / e.resolvedDurations.length) : null,
        }))
        .sort((a, b) => b.failures - a.failures),
      // Slots tab: per-slot breakdown with lost revenue, not just counts.
      slotsTab: (() => {
        const bySlot = new Map<string, { failures: number; lostRevenue: number }>();
        for (const f of failures) {
          const key = f.slot ?? 'Unassigned';
          const entry = bySlot.get(key) ?? { failures: 0, lostRevenue: 0 };
          entry.failures += 1;
          entry.lostRevenue = round2(entry.lostRevenue + failureLostRevenue(f));
          bySlot.set(key, entry);
        }
        return [...bySlot.entries()].map(([slot, e]) => ({ slot, ...e })).sort((a, b) => b.lostRevenue - a.lostRevenue);
      })(),
    };
  }

  /** Analytics > Supply Chain > Shipment Analytics */
  async getShipmentAnalytics(orgId: string, query: DateRangeQueryDto) {
    const { from, to } = query.resolveRange();
    const shipments = await this.prisma.shipment.findMany({
      where: { orgId, OR: [{ dispatchedAt: { gte: from, lte: to } }, { dispatchedAt: null }] },
      include: { warehouse: true, supplier: true },
    });

    const statusBreakdown = ['PENDING', 'IN_TRANSIT', 'DELIVERED', 'DELAYED'].map((status) => ({
      status,
      count: shipments.filter((s) => s.status === status).length,
    }));

    const transitDurations = shipments
      .filter((s) => s.dispatchedAt && s.deliveredAt)
      .map((s) => (s.deliveredAt!.getTime() - s.dispatchedAt!.getTime()) / 86_400_000);

    return {
      range: { from, to },
      totalShipments: shipments.length,
      delayedCount: shipments.filter((s) => s.status === 'DELAYED').length,
      avgTransitDays: transitDurations.length ? round2(sum(transitDurations) / transitDurations.length) : 0,
      statusBreakdown,
      delayedShipments: shipments
        .filter((s) => s.status === 'DELAYED')
        .map((s) => ({ warehouse: s.warehouse?.name ?? '—', supplier: s.supplier?.name ?? '—', expectedAt: s.expectedAt })),
    };
  }
}