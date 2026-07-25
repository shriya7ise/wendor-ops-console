import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DateRangeQueryDto, Granularity } from '../../common/dto/date-range.dto';
import { bucketByHourOfDay, bucketSeries, pctDelta, round2, sum, topBottom } from '../../common/analytics.util';

@Injectable()
export class BusinessPerformanceService {
  constructor(private readonly prisma: PrismaService) {}

  private async fetchTx(orgId: string, from: Date, to: Date) {
    return this.prisma.transaction.findMany({
      where: { orgId, createdAt: { gte: from, lte: to }, status: 'COMPLETED' },
      include: { machine: { include: { cluster: true } }, product: true },
    });
  }

  /** Analytics > Business Performance > Sales Analytics */
  async getSalesAnalytics(orgId: string, query: DateRangeQueryDto) {
    const { from, to } = query.resolveRange();
    const granularity = (query.granularity ?? 'week') as Granularity;
    const tx = await this.fetchTx(orgId, from, to);

    const totalRevenue = round2(sum(tx.map((t) => Number(t.amount))));
    const totalUnits = sum(tx.map((t) => t.quantity));

    const revenueTrend = bucketSeries(tx, (t) => t.createdAt, (t) => Number(t.amount), from, to, granularity);

    const byMethod = new Map<string, number>();
    for (const t of tx) {
      const key = t.paymentMethod ?? 'Unknown';
      byMethod.set(key, (byMethod.get(key) ?? 0) + Number(t.amount));
    }
    const paymentMethodBreakdown = [...byMethod.entries()].map(([method, revenue]) => ({ method, revenue: round2(revenue) }));

    // Step 4 (1.9.2): Day-wise / Hour-wise drill-down views. Same underlying
    // `tx` dataset as revenueTrend — day-wise is just a fixed-granularity
    // rebucket, hour-wise sums every transaction into its hour-of-day.
    const dayWiseTrend = bucketSeries(tx, (t) => t.createdAt, (t) => Number(t.amount), from, to, 'day');
    const hourWiseTrend = bucketByHourOfDay(tx, (t) => t.createdAt, (t) => Number(t.amount));

    return {
      range: { from, to, granularity },
      totalRevenue,
      totalUnits,
      revenueTrend,
      paymentMethodBreakdown,
      dayWiseTrend,
      hourWiseTrend,
    };
  }

  /** Analytics > Business Performance > Big Sales (Org Sales)
   *  Also backs the standalone top-level "Report" page — same underlying
   *  metrics, both screens showed identical filter/table shape in the
   *  recordings, so this is shared rather than duplicated. */
  async getOrgSales(orgId: string, query: DateRangeQueryDto) {
    const limit = query.limit ?? 5;
    const { from, to } = query.resolveRange();
    const granularity = (query.granularity ?? 'week') as Granularity;
    const tx = await this.fetchTx(orgId, from, to);

    const spanMs = to.getTime() - from.getTime();
    const prevTx = await this.fetchTx(orgId, new Date(from.getTime() - spanMs), from);

    const totalRevenue = round2(sum(tx.map((t) => Number(t.amount))));
    const totalUnits = sum(tx.map((t) => t.quantity));
    const activeMachines = new Set(tx.map((t) => t.machineId)).size;
    const prevRevenue = round2(sum(prevTx.map((t) => Number(t.amount))));

    const revenueSeries = bucketSeries(tx, (t) => t.createdAt, (t) => Number(t.amount), from, to, granularity);
    const unitsSeries = bucketSeries(tx, (t) => t.createdAt, (t) => t.quantity, from, to, granularity);
    const revenueUnitsTrend = revenueSeries.map((r, i) => ({ label: r.label, revenue: r.value, units: unitsSeries[i]?.value ?? 0 }));

    const machines = topBottom(tx, (t) => t.machine.name, (t) => Number(t.amount), limit);
    const clusters = topBottom(
      tx.filter((t) => t.machine.cluster),
      (t) => t.machine.cluster!.name,
      (t) => Number(t.amount),
      limit,
    );
    const products = topBottom(tx, (t) => t.product.name, (t) => Number(t.amount), limit);

    return {
      range: { from, to, granularity },
      totalRevenue,
      totalUnits,
      activeMachines,
      revenueGrowthPct: pctDelta(prevRevenue, totalRevenue),
      revenueUnitsTrend,
      topMachines: machines.top,
      worstMachines: machines.worst,
      topClusters: clusters.top,
      worstClusters: clusters.worst,
      topProducts: products.top,
      worstProducts: products.worst,
    };
  }

  /** Analytics > Business Performance > Transaction Analytics */
  async getTransactionAnalytics(orgId: string, query: DateRangeQueryDto) {
    const { from, to } = query.resolveRange();
    const granularity = (query.granularity ?? 'day') as Granularity;
    const tx = await this.prisma.transaction.findMany({ where: { orgId, createdAt: { gte: from, lte: to } } });

    const transactionsPerDay = bucketSeries(tx, (t) => t.createdAt, () => 1, from, to, 'day');

    const dayOfWeekCounts = Array.from({ length: 7 }, (_, i) => ({
      day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
      count: tx.filter((t) => t.createdAt.getDay() === i).length,
    }));

    const statusBreakdown = ['COMPLETED', 'FAILED', 'REFUNDED'].map((status) => ({
      status,
      count: tx.filter((t) => t.status === status).length,
    }));

    // Step 4 (1.9.4): Day-wise / Hour-wise drill-down views, same pattern as
    // Sales Analytics — transactionsPerDay already covers day-wise, this
    // adds the hour-of-day rebucket.
    const dayWiseTrend = transactionsPerDay;
    const hourWiseTrend = bucketByHourOfDay(tx, (t) => t.createdAt, () => 1);

    return {
      range: { from, to, granularity },
      totalTransactions: tx.length,
      transactionsPerDay,
      dayOfWeekCounts,
      statusBreakdown,
      dayWiseTrend,
      hourWiseTrend,
    };
  }
}
