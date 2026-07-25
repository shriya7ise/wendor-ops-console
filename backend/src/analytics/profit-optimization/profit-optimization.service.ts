import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProfitOptimizationQueryDto } from '../../common/dto/profit-optimization-query.dto';
import { round2, sum, topBottom } from '../../common/analytics.util';

@Injectable()
export class ProfitOptimizationService {
  constructor(private readonly prisma: PrismaService) {}

  /** Analytics > Profit Optimization
   *  Compares each product's revenue-per-unit at this machine against the
   *  org-wide average for that product, and flags SKUs that are
   *  meaningfully underperforming — the actual "recommendation" engine,
   *  not just a metrics dump. */
  async getRecommendations(orgId: string, query: ProfitOptimizationQueryDto) {
    const machine = query.machineId
      ? await this.prisma.machine.findFirst({ where: { id: query.machineId, orgId } })
      : await this.prisma.machine.findFirst({ where: { orgId, name: { equals: query.machine, mode: 'insensitive' } } });
    if (!machine) throw new NotFoundException('Machine not found for this organisation.');

    // Step 4 (1.9.20): Weekly/Monthly tabs. If the caller pinned an explicit
    // from/to we respect it as before; otherwise the period drives a
    // genuinely different window (7d vs 30d) so the two tabs are not the
    // same query relabeled.
    const period = query.period ?? 'week';
    let from: Date, to: Date;
    if (query.from || query.to) {
      ({ from, to } = query.resolveRange());
    } else {
      to = new Date();
      const spanDays = period === 'week' ? 7 : 30;
      from = new Date(to.getTime() - spanDays * 86_400_000);
    }

    const [machineTx, orgTx] = await Promise.all([
      this.prisma.transaction.findMany({ where: { machineId: machine.id, createdAt: { gte: from, lte: to }, status: 'COMPLETED' }, include: { product: true } }),
      this.prisma.transaction.findMany({ where: { orgId, createdAt: { gte: from, lte: to }, status: 'COMPLETED' }, include: { product: true } }),
    ]);

    const orgAvgByProduct = new Map<string, number>();
    for (const p of new Set(orgTx.map((t) => t.productId))) {
      const rows = orgTx.filter((t) => t.productId === p);
      const units = sum(rows.map((t) => t.quantity));
      orgAvgByProduct.set(p, units ? sum(rows.map((t) => Number(t.amount))) / units : 0);
    }

    // Step 5 (1.9.20 P2 — "show the reasoning behind each tip so operators
    // trust it instead of a black box"): every tip now carries the sample it
    // was computed from (units, revenue) plus a risk/confidence score.
    // Confidence scales with how much data backed the observation — a swap
    // suggested off 1 transaction is not as trustworthy as one backed by 20
    // — and is capped below 100% since this is a heuristic, not a guarantee.
    // Risk is the inverse: thin samples are higher-risk to act on.
    const scoreConfidence = (units: number) => Math.min(95, Math.round(35 + Math.min(units, 20) * 3));
    const scoreRisk = (units: number): 'LOW' | 'MED' | 'HIGH' => (units >= 10 ? 'LOW' : units >= 3 ? 'MED' : 'HIGH');

    const recommendations: Array<{
      product: string;
      productId: string;
      type: 'underperforming' | 'top_seller';
      detail: string;
      units: number;
      revenue: number;
      potentialGain?: number;
      risk: 'LOW' | 'MED' | 'HIGH';
      confidencePct: number;
      priceRangeLow: number;
      priceRangeHigh: number;
      action?: string;
    }> = [];

    for (const productId of new Set(machineTx.map((t) => t.productId))) {
      const rows = machineTx.filter((t) => t.productId === productId);
      const units = sum(rows.map((t) => t.quantity));
      const revenue = round2(sum(rows.map((t) => Number(t.amount))));
      const revenuePerUnit = units ? revenue / units : 0;
      const orgAvg = orgAvgByProduct.get(productId) ?? revenuePerUnit;
      const name = rows[0].product.name;

      if (orgAvg > 0 && revenuePerUnit < orgAvg * 0.7) {
        recommendations.push({
          product: name,
          productId,
          type: 'underperforming',
          detail: `Reduce facing for ${name} — revenue/unit here is ₹${round2(revenuePerUnit)} vs org avg ₹${round2(orgAvg)}. Consider swapping for a higher performer.`,
          units,
          revenue,
          potentialGain: round2((orgAvg - revenuePerUnit) * units),
          risk: scoreRisk(units),
          confidencePct: scoreConfidence(units),
          priceRangeLow: 0,
          priceRangeHigh: revenue,
          action: 'Remove 1 facing',
        });
      }
    }

    const topSellers = topBottom(machineTx, (t) => t.product.name, (t) => Number(t.amount), 3).top;
    for (const s of topSellers) {
      const rows = machineTx.filter((t) => t.product.name === s.name);
      const units = sum(rows.map((t) => t.quantity));
      const productId = rows[0]?.productId ?? '';
      recommendations.push({
        product: s.name,
        productId,
        type: 'top_seller',
        detail: `${s.name} is a top performer here (₹${s.value} in range) — protect its facing/stock priority.`,
        units,
        revenue: s.value,
        risk: scoreRisk(units),
        confidencePct: scoreConfidence(units),
        priceRangeLow: 0,
        priceRangeHigh: s.value,
      });
    }

    // Step 5 (P2): Gross Profit / Margin. Product has no cost field in the
    // schema yet (Product.unitPrice is sale price, not cost), so these are
    // surfaced honestly as "no cost data" rather than faked off a made-up
    // margin assumption. Once a real cost field (e.g. Product.costPrice)
    // lands, grossProfit = revenue - costOfGoods and margin = grossProfit /
    // revenue drop in here without changing the response shape.
    const totalRevenue = round2(sum(machineTx.map((t) => Number(t.amount))));

    return {
      machine: { id: machine.id, name: machine.name },
      period,
      range: { from, to },
      totalRevenue,
      grossProfit: null as number | null,
      margin: null as number | null,
      costDataAvailable: false,
      recommendations,
    };
  }
}