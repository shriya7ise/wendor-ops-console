import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AttendanceExportQueryDto } from './dto/attendance-export-query.dto';
import { classifyAttendance, hoursBetween, round2 } from '../common/analytics.util';

@Injectable()
export class AttendanceExportsService {
  constructor(private readonly prisma: PrismaService) {}

  async listClusters(orgId: string) {
    return this.prisma.cluster.findMany({ where: { orgId }, select: { id: true, name: true }, orderBy: { name: 'asc' } });
  }

  /** Powers the color-key summary + preview table on the Attendance Exports
   *  page — status classification is exactly what the eventual CSV
   *  (`ATTENDANCE_EXPORT` in export-generators.ts) uses, so the on-screen
   *  color key always matches what gets downloaded. */
  async getSummary(orgId: string, query: AttendanceExportQueryDto) {
    const { from, to } = query.resolveRange();
    const now = new Date();

    const records = await this.prisma.attendance.findMany({
      where: { orgId, checkIn: { gte: from, lte: to }, ...(query.clusterId ? { clusterId: query.clusterId } : {}) },
      include: { employee: true, cluster: true },
      orderBy: { checkIn: 'desc' },
    });

    const rows = records.map((r) => ({
      date: r.checkIn.toISOString().slice(0, 10),
      employee: r.employee.name,
      cluster: r.cluster?.name ?? '—',
      checkIn: r.checkIn.toISOString(),
      checkOut: r.checkOut?.toISOString() ?? null,
      hoursWorked: r.checkOut ? round2(hoursBetween(r.checkIn, r.checkOut)) : null,
      status: classifyAttendance(r, now),
    }));

    const statusCounts = rows.reduce<Record<string, number>>((acc, r) => {
      acc[r.status] = (acc[r.status] ?? 0) + 1;
      return acc;
    }, {});

    return {
      range: { from, to },
      totalRecords: rows.length,
      statusCounts: {
        ON_TIME: statusCounts.ON_TIME ?? 0,
        LATE_CHECKIN: statusCounts.LATE_CHECKIN ?? 0,
        MISSED_CHECKOUT: statusCounts.MISSED_CHECKOUT ?? 0,
        OVERTIME: statusCounts.OVERTIME ?? 0,
        PENDING: statusCounts.PENDING ?? 0,
      },
      rows: rows.slice(0, 50), // preview only — full data goes through the export job, not this endpoint
    };
  }
}
