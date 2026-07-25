import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MachineQueryDto } from './machine-query.dto';
import { Granularity } from '../../common/dto/date-range.dto';
import { bucketSeries, round2, sum } from '../../common/analytics.util';

@Injectable()
export class MachineAnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async search(orgId: string, term: string) {
    return this.prisma.machine.findMany({
      where: { orgId, OR: [{ name: { contains: term, mode: 'insensitive' } }, { code: { contains: term, mode: 'insensitive' } }] },
      select: { id: true, name: true, code: true, status: true },
      take: 10,
    });
  }

  /** Analytics > Machine Analytics */
  async getMachineAnalytics(orgId: string, query: MachineQueryDto) {
    const machine = query.machineId
      ? await this.prisma.machine.findFirst({ where: { id: query.machineId, orgId } })
      : await this.prisma.machine.findFirst({ where: { orgId, name: { equals: query.machine, mode: 'insensitive' } } });
    if (!machine) throw new NotFoundException('Machine not found for this organisation.');

    const { from, to } = query.resolveRange();
    const granularity = (query.granularity ?? 'week') as Granularity;

    const [tx, refills, failures] = await Promise.all([
      this.prisma.transaction.findMany({ where: { machineId: machine.id, createdAt: { gte: from, lte: to }, status: 'COMPLETED' } }),
      this.prisma.refill.findMany({ where: { machineId: machine.id, eventAt: { gte: from, lte: to } } }),
      this.prisma.failureEvent.findMany({ where: { machineId: machine.id, reportedAt: { gte: from, lte: to } } }),
    ]);

    return {
      machine: { id: machine.id, name: machine.name, code: machine.code, status: machine.status },
      range: { from, to, granularity },
      salesRevenue: round2(sum(tx.map((t) => Number(t.amount)))),
      unitsSold: sum(tx.map((t) => t.quantity)),
      refillQty: sum(refills.map((r) => r.quantity)),
      failureCount: failures.length,
      analyticsOverview: bucketSeries(tx, (t) => t.createdAt, (t) => Number(t.amount), from, to, granularity),
      refillTrend: bucketSeries(refills, (r) => r.eventAt, (r) => r.quantity, from, to, granularity),
      // No IoT sensor model in this schema pass — mirrors the source app's
      // own empty state rather than fabricating readings.
      temperatureAnalytics: { available: false, message: 'No temperature data available for this machine.' },
    };
  }
}
