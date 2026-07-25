import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DateRangeQueryDto, Granularity } from '../../common/dto/date-range.dto';
import { IsOptional, IsString } from 'class-validator';
import { bucketSeries, classifyAttendance, round2, sum } from '../../common/analytics.util';

export class UserQueryDto extends DateRangeQueryDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  user?: string;
}

@Injectable()
export class UserAnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async search(orgId: string, term: string) {
    return this.prisma.employee.findMany({
      where: { orgId, name: { contains: term, mode: 'insensitive' } },
      select: { id: true, name: true, role: true },
      take: 10,
    });
  }

  /** Analytics > User Analytics — the "Operator Intelligence Board" */
  async getUserAnalytics(orgId: string, query: UserQueryDto) {
    const employee = query.userId
      ? await this.prisma.employee.findFirst({ where: { id: query.userId, orgId } })
      : await this.prisma.employee.findFirst({ where: { orgId, name: { equals: query.user, mode: 'insensitive' } } });
    if (!employee) throw new NotFoundException('User not found for this organisation.');

    const { from, to } = query.resolveRange();
    const granularity = (query.granularity ?? 'day') as Granularity;

    const [attendance, refillsHandled, txHandled] = await Promise.all([
      this.prisma.attendance.findMany({ where: { employeeId: employee.id, checkIn: { gte: from, lte: to } } }),
      this.prisma.refill.findMany({ where: { employeeId: employee.id, eventAt: { gte: from, lte: to } } }),
      this.prisma.transaction.findMany({ where: { employeeId: employee.id, createdAt: { gte: from, lte: to } } }),
    ]);

    const workedDays = attendance.filter((a) => a.checkOut).length;
    const lateCount = attendance.filter((a) => a.checkIn.getHours() >= 10).length;
    const totalHours = round2(
      sum(attendance.filter((a) => a.checkOut).map((a) => (a.checkOut!.getTime() - a.checkIn.getTime()) / 3_600_000)),
    );

    const refillTrips = refillsHandled.length;
    const refillQuantity = sum(refillsHandled.map((r) => r.quantity));
    const machinesServiced = new Set(refillsHandled.map((r) => r.machineId)).size;
    const attendanceRate = attendance.length ? round2((workedDays / attendance.length) * 100) : 0;

    // Step 4 (1.9.19): Activity Calendar — a heatmap-style calendar over the
    // same attendance/refill-trip data already fetched above. One entry per
    // day in range; day-level attendance status reuses `classifyAttendance`
    // so the calendar's coloring matches Attendance Analytics/Exports.
    const activityCalendar = buildActivityCalendar(from, to, attendance, refillsHandled, txHandled);

    // Step 4 (1.9.19): "Show AI Summary" — the gap-closure doc recommends
    // templated-from-metrics for v1 (no LLM call) rather than a black box;
    // upgrade to a real LLM summary later without changing the response shape.
    const aiSummary = buildAiSummary({
      name: employee.name,
      refillTrips,
      refillQuantity,
      machinesServiced,
      businessTxCount: txHandled.length,
      attendanceRate,
      lateCount,
      totalHours,
      rangeDays: activityCalendar.length,
    });

    return {
      user: { id: employee.id, name: employee.name, role: employee.role },
      range: { from, to, granularity },
      refillTrips,
      refillQuantity,
      machinesServiced,
      businessTxCount: txHandled.length,
      attendanceRate,
      lateCount,
      totalHours,
      attendanceTrend: bucketSeries(attendance, (a) => a.checkIn, () => 1, from, to, granularity),
      activityCalendar,
      aiSummary,
    };
  }
}

type CalendarDay = {
  date: string;
  attendanceStatus: 'ON_TIME' | 'LATE_CHECKIN' | 'MISSED_CHECKOUT' | 'OVERTIME' | 'PENDING' | 'ABSENT';
  refillTrips: number;
  txCount: number;
};

function buildActivityCalendar(
  from: Date,
  to: Date,
  attendance: { checkIn: Date; checkOut: Date | null }[],
  refills: { eventAt: Date }[],
  tx: { createdAt: Date }[],
): CalendarDay[] {
  const days: CalendarDay[] = [];
  const cursor = new Date(from);
  cursor.setHours(0, 0, 0, 0);
  const end = new Date(to);
  end.setHours(0, 0, 0, 0);

  while (cursor <= end) {
    const dayStart = new Date(cursor);
    const dayEnd = new Date(cursor);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const record = attendance.find((a) => a.checkIn >= dayStart && a.checkIn < dayEnd);
    const attendanceStatus = record ? classifyAttendance(record) : 'ABSENT';

    const refillTrips = refills.filter((r) => r.eventAt >= dayStart && r.eventAt < dayEnd).length;
    const txCount = tx.filter((t) => t.createdAt >= dayStart && t.createdAt < dayEnd).length;

    days.push({ date: dayStart.toISOString().slice(0, 10), attendanceStatus, refillTrips, txCount });
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

function buildAiSummary(m: {
  name: string;
  refillTrips: number;
  refillQuantity: number;
  machinesServiced: number;
  businessTxCount: number;
  attendanceRate: number;
  lateCount: number;
  totalHours: number;
  rangeDays: number;
}): string {
  const parts: string[] = [];
  parts.push(
    `${m.name} attended ${m.attendanceRate}% of expected days over the last ${m.rangeDays} days, logging ${m.totalHours} total hours.`,
  );
  if (m.lateCount > 0) {
    parts.push(`${m.lateCount} check-in${m.lateCount === 1 ? ' was' : 's were'} late.`);
  } else {
    parts.push('No late check-ins in this period.');
  }
  if (m.refillTrips > 0) {
    parts.push(
      `Completed ${m.refillTrips} refill trip${m.refillTrips === 1 ? '' : 's'} (${m.refillQuantity} units) across ${m.machinesServiced} machine${m.machinesServiced === 1 ? '' : 's'}.`,
    );
  } else {
    parts.push('No refill activity recorded in this period.');
  }
  if (m.businessTxCount > 0) {
    parts.push(`Handled ${m.businessTxCount} transaction${m.businessTxCount === 1 ? '' : 's'}.`);
  }
  return parts.join(' ');
}
