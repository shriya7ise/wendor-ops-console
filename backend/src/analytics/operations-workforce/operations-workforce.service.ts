import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DateRangeQueryDto, Granularity } from '../../common/dto/date-range.dto';
import { OrgAttendanceQueryDto } from '../../common/dto/org-attendance-query.dto';
import { AttendanceMetricsQueryDto } from '../../common/dto/attendance-metrics-query.dto';
import { FleetDashboardQueryDto } from '../../common/dto/fleet-dashboard-query.dto';
import { bucketSeries, clamp, hoursBetween, minutesToTimeLabel, round2, sum, timeOfDayLabel, topBottom } from '../../common/analytics.util';

@Injectable()
export class OperationsWorkforceService {
  constructor(private readonly prisma: PrismaService) {}

  /** Analytics > Operations & Workforce > Refill Operations
   *  (org-wide refill activity — not scoped to one supplier, unlike the
   *  Entity Analysis > Supplier Analysis page).
   *
   *  Unique Refillers, Top Warehouses, the Regularity Leaderboard, and the
   *  Time of Day / Day of Week charts all read off Refill.employeeId, which
   *  now exists — see prisma/migrations/20260718180000_step1_schema_fixes. */
  async getRefillOperations(orgId: string, query: DateRangeQueryDto) {
    const limit = query.limit ?? 5;
    const { from, to } = query.resolveRange();
    const granularity = (query.granularity ?? 'week') as Granularity;

    const refills = await this.prisma.refill.findMany({
      where: { orgId, eventAt: { gte: from, lte: to } },
      include: { machine: true, product: true, warehouse: true, employee: true },
    });

    const refillTrend = bucketSeries(refills, (r) => r.eventAt, (r) => r.quantity, from, to, granularity);
    const byMachine = topBottom(refills, (r) => r.machine.name, (r) => r.quantity, limit);
    const byItem = topBottom(refills, (r) => r.product.name, (r) => r.quantity, limit);
    const byWarehouse = topBottom(
      refills.filter((r) => r.warehouse),
      (r) => r.warehouse!.name,
      (r) => r.quantity,
      limit,
    );

    const attributed = refills.filter((r) => r.employee);
    const byRefiller = topBottom(attributed, (r) => r.employee!.name, (r) => r.quantity, limit);

    // Regularity: for each refiller, how evenly spaced their refill events
    // were across the range — a low spread relative to the average gap
    // means a consistent route; a high spread means erratic/late coverage.
    const regularityLeaderboard = [...new Set(attributed.map((r) => r.employee!.id))]
      .map((employeeId) => {
        const events = attributed
          .filter((r) => r.employee!.id === employeeId)
          .map((r) => r.eventAt.getTime())
          .sort((a, b) => a - b);
        const name = attributed.find((r) => r.employee!.id === employeeId)!.employee!.name;
        if (events.length < 2) return { name, refillEvents: events.length, regularityScorePct: events.length ? 100 : 0 };
        const gaps = events.slice(1).map((t, i) => t - events[i]);
        const avgGap = sum(gaps) / gaps.length;
        const variance = sum(gaps.map((g) => (g - avgGap) ** 2)) / gaps.length;
        const coefficientOfVariation = avgGap ? Math.sqrt(variance) / avgGap : 0;
        // Convert to a 0-100 "regularity score" — lower variation is better.
        const regularityScorePct = round2(clamp(100 - coefficientOfVariation * 100, 0, 100));
        return { name, refillEvents: events.length, regularityScorePct };
      })
      .sort((a, b) => b.regularityScorePct - a.regularityScorePct);

    const timeOfDay = Array.from({ length: 24 }, (_, hour) => ({
      label: `${hour}:00`,
      value: refills.filter((r) => r.eventAt.getHours() === hour).length,
    }));
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayOfWeek = dayNames.map((label, day) => ({
      label,
      value: refills.filter((r) => r.eventAt.getDay() === day).length,
    }));

    return {
      range: { from, to, granularity },
      totalRefillQty: sum(refills.map((r) => r.quantity)),
      totalRefillEvents: refills.length,
      uniqueRefillers: new Set(attributed.map((r) => r.employee!.id)).size,
      uniqueMachinesRefilled: new Set(refills.map((r) => r.machineId)).size,
      refillTrend,
      topMachinesByRefill: byMachine.top,
      topItemsByRefill: byItem.top,
      topWarehousesByRefill: byWarehouse.top,
      topRefillers: byRefiller.top,
      regularityLeaderboard,
      timeOfDay,
      dayOfWeek,
    };
  }

  /** Analytics > Operations & Workforce > Attendance Analytics (1.9.6) — grid rebuild.
   *  The spec's core artifact is an employee-rows × day-columns grid, each
   *  cell colored by a 5-state legend, driven by Member multi-select + Month
   *  picker (not a date-range + trend-line, which is what previously shipped
   *  here — see gap-closure doc, this was a page-shape mismatch, not a few
   *  missing widgets). Shares month/member resolution with Attendance
   *  Metrics (1.9.8) via the same query DTO. */
  async getAttendanceGrid(orgId: string, query: AttendanceMetricsQueryDto) {
    const { from, to } = query.resolveMonthRange();
    const memberIds = query.resolveMemberIds();
    const daysInMonth = Math.round((to.getTime() - from.getTime()) / 86_400_000) + 1;
    const lateThresholdHour = 10; // consistent with Attendance Analytics' prior late-arrival cutoff

    const records = await this.prisma.attendance.findMany({
      where: {
        orgId,
        checkIn: { gte: from, lte: to },
        ...(memberIds ? { employeeId: { in: memberIds } } : {}),
      },
      include: { employee: true },
      orderBy: { checkIn: 'asc' },
    });

    const employeesById = new Map<string, { id: string; name: string }>();
    records.forEach((r) => employeesById.set(r.employeeId, { id: r.employeeId, name: r.employee.name }));
    const employees = [...employeesById.values()].sort((a, b) => a.name.localeCompare(b.name));

    const days = Array.from({ length: daysInMonth }, (_, i) => {
      const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i);
      return { day: i + 1, label: String(i + 1), weekday: d.toLocaleDateString('en-US', { weekday: 'short' }) };
    });

    // 5-state legend, evaluated in priority order per cell:
    // lateDay > under4_5 > over9 > normal — arrival-time and shortfall
    // issues are surfaced ahead of "worked plenty of hours" framing.
    const legend = [
      { state: 'under4_5', label: '<4.5 Hours', color: '#dc2626' },
      { state: 'late', label: 'Late Days', color: '#d97706' },
      { state: 'over9', label: '>9 Hours', color: '#2563eb' },
      { state: 'normal', label: 'Normal Day', color: '#16a34a' },
      { state: 'none', label: 'No Hours', color: '#d4d4d4' },
    ] as const;

    const grid = employees.map((employee) => {
      const own = records.filter((r) => r.employeeId === employee.id);
      const cells = days.map(({ day }) => {
        const rec = own.find((r) => r.checkIn.getDate() === day && r.checkIn.getMonth() === from.getMonth());
        if (!rec) return { day, state: 'none' as const, checkIn: null, checkOut: null };
        const isLate = rec.checkIn.getHours() >= lateThresholdHour;
        const hoursWorked = rec.checkOut ? hoursBetween(rec.checkIn, rec.checkOut) : null;
        let state: (typeof legend)[number]['state'] = 'normal';
        if (isLate) state = 'late';
        else if (hoursWorked !== null && hoursWorked < 4.5) state = 'under4_5';
        else if (hoursWorked !== null && hoursWorked > 9) state = 'over9';
        return {
          day,
          state,
          checkIn: timeOfDayLabel(rec.checkIn),
          checkOut: rec.checkOut ? timeOfDayLabel(rec.checkOut) : null,
        };
      });
      return { employeeId: employee.id, name: employee.name, cells };
    });

    return {
      month: query.month ?? `${from.getFullYear()}-${String(from.getMonth() + 1).padStart(2, '0')}`,
      daysInMonth,
      days,
      legend,
      grid,
    };
  }

  /** Analytics > Operations & Workforce > Org Attendance & Discipline (1.9.7)
   *  Org-wide attendance health, as distinct from Attendance Analytics
   *  (per-check-in trend) and Attendance Metrics (per-employee table) — this
   *  page is the discipline/compliance rollup: who's missing days, who's
   *  racking up overtime, how clusters compare. Previously missing
   *  entirely (no route, no service). */
  async getOrgAttendanceDiscipline(orgId: string, query: OrgAttendanceQueryDto) {
    const limit = query.limit ?? 5;
    const { from, to } = query.resolveRange();
    const granularity = (query.granularity ?? 'week') as Granularity;
    const lateThresholdHour = query.lateThresholdHour ?? 10;

    const records = await this.prisma.attendance.findMany({
      where: { orgId, checkIn: { gte: from, lte: to }, ...(query.clusterId ? { clusterId: query.clusterId } : {}) },
      include: { employee: true, cluster: true },
    });

    const totalUsers = await this.prisma.employee.count({ where: { orgId } });
    const activeEmployeeIds = new Set(records.map((r) => r.employeeId));

    // Expected working days per active employee, approximated as calendar
    // days in the selected range (no shift-roster model in this schema
    // pass — see the gap-closure doc's note on this same approximation
    // pattern used elsewhere, e.g. Org Inventory Risk).
    const daysInRange = Math.max(1, Math.ceil((to.getTime() - from.getTime()) / 86_400_000));
    const expectedDays = activeEmployeeIds.size * daysInRange;
    const presentDays = records.length;
    const missedDays = Math.max(0, expectedDays - presentDays);

    const lateRecords = records.filter((r) => r.checkIn.getHours() >= lateThresholdHour);
    const missedCheckoutRecords = records.filter((r) => !r.checkOut);
    const overtimeByRecord = records
      .filter((r) => r.checkOut)
      .map((r) => ({ r, hours: hoursBetween(r.checkIn, r.checkOut!) }))
      .filter((x) => x.hours > 9);
    const overtimeHoursTotal = sum(overtimeByRecord.map((x) => round2(x.hours - 9)));

    const hoursWorkedRecords = records.filter((r) => r.checkOut).map((r) => hoursBetween(r.checkIn, r.checkOut!));
    const avgHoursPerDay = hoursWorkedRecords.length ? round2(sum(hoursWorkedRecords) / hoursWorkedRecords.length) : 0;

    const attendanceTrend = bucketSeries(records, (r) => r.checkIn, () => 1, from, to, granularity);

    const overtimeTop = topBottom(overtimeByRecord, (x) => x.r.employee.name, (x) => round2(x.hours - 9), limit);
    const clusterSummary = topBottom(records.filter((r) => r.cluster), (r) => r.cluster!.name, () => 1, 10);

    // Per-employee rollups, used by every Worst/Best list below.
    const byEmployee = [...activeEmployeeIds].map((employeeId) => {
      const own = records.filter((r) => r.employeeId === employeeId);
      const name = own[0].employee.name;
      const ownPresent = own.length;
      const ownMissedDays = Math.max(0, daysInRange - ownPresent);
      const ownLate = own.filter((r) => r.checkIn.getHours() >= lateThresholdHour).length;
      const ownMissedCheckout = own.filter((r) => !r.checkOut).length;
      const ownHours = own.filter((r) => r.checkOut).map((r) => hoursBetween(r.checkIn, r.checkOut!));
      const ownAvgHours = ownHours.length ? round2(sum(ownHours) / ownHours.length) : 0;
      return { name, present: ownPresent, missedDays: ownMissedDays, late: ownLate, missedCheckout: ownMissedCheckout, avgHours: ownAvgHours };
    });

    const rankBy = (fn: (e: (typeof byEmployee)[number]) => number, asc = false) =>
      [...byEmployee]
        .sort((a, b) => (asc ? fn(a) - fn(b) : fn(b) - fn(a)))
        .slice(0, limit)
        .map((e) => ({ name: e.name, value: fn(e) }));

    return {
      range: { from, to, granularity },
      lateThresholdHour,
      totalUsers,
      activeUsers: activeEmployeeIds.size,
      presentDays,
      missedDays,
      lateCheckIns: lateRecords.length,
      missedCheckOuts: missedCheckoutRecords.length,
      overtimeHours: overtimeHoursTotal,
      avgHoursPerDay,
      attendanceTrend,
      overtimeTopMembers: overtimeTop.top,
      clusterSummary: clusterSummary.top,
      worstByMissedDays: rankBy((e) => e.missedDays),
      worstByLateCheckins: rankBy((e) => e.late),
      worstByMissedCheckout: rankBy((e) => e.missedCheckout),
      worstByLowestHours: rankBy((e) => e.avgHours, true),
      bestByAttendance: rankBy((e) => e.present),
      bestByPunctuality: rankBy((e) => -e.late),
    };
  }

  /** Analytics > Operations & Workforce > Attendance Metrics (1.9.8)
   *  Per-employee monthly attendance table. Previously missing entirely
   *  (no route, no service). */
  async getAttendanceMetrics(orgId: string, query: AttendanceMetricsQueryDto) {
    const { from, to } = query.resolveMonthRange();
    const memberIds = query.resolveMemberIds();
    const daysInMonth = Math.round((to.getTime() - from.getTime()) / 86_400_000) + 1;

    const records = await this.prisma.attendance.findMany({
      where: {
        orgId,
        checkIn: { gte: from, lte: to },
        ...(memberIds ? { employeeId: { in: memberIds } } : {}),
      },
      include: { employee: true },
      orderBy: { checkIn: 'asc' },
    });

    const employeeIds = [...new Set(records.map((r) => r.employeeId))];
    const rows = employeeIds.map((employeeId) => {
      const own = records.filter((r) => r.employeeId === employeeId);
      const name = own[0].employee.name;

      const missedAttendanceDays = Math.max(0, daysInMonth - own.length);

      // "Average Late Hours": how far past a 9:00 AM standard start each
      // check-in was, averaged across every present day (not just the
      // late ones) — 0 on days the employee was on time or early.
      const lateHoursPerDay = own.map((r) => Math.max(0, r.checkIn.getHours() + r.checkIn.getMinutes() / 60 - 9));
      const averageLateHours = round2(sum(lateHoursPerDay) / own.length);

      const checkOutRecords = own.filter((r) => r.checkOut);
      const hoursWorked = checkOutRecords.map((r) => hoursBetween(r.checkIn, r.checkOut!));
      const avgWorkingHours = hoursWorked.length ? round2(sum(hoursWorked) / hoursWorked.length) : 0;

      const avgInMinutes = round2(sum(own.map((r) => r.checkIn.getHours() * 60 + r.checkIn.getMinutes())) / own.length);
      const avgInTime = minutesToTimeLabel(avgInMinutes);
      const avgOutTime = checkOutRecords.length
        ? minutesToTimeLabel(round2(sum(checkOutRecords.map((r) => r.checkOut!.getHours() * 60 + r.checkOut!.getMinutes())) / checkOutRecords.length))
        : '—';

      const missingInOut = own.filter((r) => !r.checkOut).length;

      const earliestIn = own.reduce((min, r) => (r.checkIn < min ? r.checkIn : min), own[0].checkIn);
      const latestOut = checkOutRecords.reduce<Date | null>((max, r) => (!max || r.checkOut! > max ? r.checkOut! : max), null);

      return {
        employeeId,
        name,
        missedAttendanceDays,
        averageLateHours,
        avgInTime,
        avgOutTime,
        avgWorkingHours,
        missingInOut,
        earliestIn: timeOfDayLabel(earliestIn),
        latestOut: latestOut ? timeOfDayLabel(latestOut) : '—',
      };
    });

    return { month: query.month ?? `${from.getFullYear()}-${String(from.getMonth() + 1).padStart(2, '0')}`, daysInMonth, rows };
  }

  /** Cluster options for the Org Attendance & Discipline cluster filter. */
  async listClusters(orgId: string) {
    return this.prisma.cluster.findMany({ where: { orgId }, select: { id: true, name: true }, orderBy: { name: 'asc' } });
  }

  /** Analytics > Operations & Workforce > Fleet Dashboard (1.9.9)
   *  Previously: no filters, a card set that didn't match spec, no donut
   *  charts, and two tables that didn't match the spec's ranked lists — a
   *  bigger gap than "needs a check", per the audit. Rebuilt against
   *  From/To + Ranking limit + Threshold + Sales metric filters.
   *
   *  Schema note: Machine has no direct warehouseId (only Refill does, via
   *  its own warehouseId), so "Top/Worst warehouses" is ranked by refill
   *  volume rather than sales — there's no path from a warehouse to a sale.
   *  Same approximation pattern as Org Inventory Risk's supplier stand-in
   *  until a real Machine↔Warehouse link exists. Also: the schema has no
   *  "activated"/deactivated concept or heartbeat field, so "Activated" is
   *  reported as Total Machines and "Recently Alive" is derived from the
   *  most recent transaction/refill timestamp against the Threshold filter,
   *  rather than a true device heartbeat. */
  async getFleetDashboard(orgId: string, query: FleetDashboardQueryDto) {
    const limit = query.limit ?? 5;
    const { from, to } = query.resolveRange();
    const thresholdHours = query.thresholdHours ?? 48;
    const salesMetric = query.salesMetric ?? 'revenue';
    const recentCutoff = new Date(Date.now() - thresholdHours * 3_600_000);

    const machines = await this.prisma.machine.findMany({ where: { orgId }, include: { cluster: true } });

    const [transactions, refills] = await Promise.all([
      this.prisma.transaction.findMany({
        where: { orgId, createdAt: { gte: from, lte: to }, status: 'COMPLETED' },
        include: { machine: { include: { cluster: true } } },
      }),
      this.prisma.refill.findMany({
        where: { orgId, eventAt: { gte: from, lte: to } },
        include: { machine: { include: { cluster: true } }, warehouse: true },
      }),
    ]);

    const salesValue = (t: (typeof transactions)[number]) => (salesMetric === 'revenue' ? Number(t.amount) : t.quantity);

    // Last-activity-per-machine, for the "Recently Alive" card + state donut.
    const lastActivityByMachine = new Map<string, Date>();
    for (const t of transactions) {
      const prev = lastActivityByMachine.get(t.machineId);
      if (!prev || t.createdAt > prev) lastActivityByMachine.set(t.machineId, t.createdAt);
    }
    for (const r of refills) {
      const prev = lastActivityByMachine.get(r.machineId);
      if (!prev || r.eventAt > prev) lastActivityByMachine.set(r.machineId, r.eventAt);
    }

    const recentlyAliveIds = new Set(
      [...lastActivityByMachine.entries()].filter(([, last]) => last >= recentCutoff).map(([id]) => id),
    );

    const statusBreakdown = ['ONLINE', 'OFFLINE', 'MAINTENANCE'].map((status) => ({
      status,
      count: machines.filter((m) => m.status === status).length,
    }));

    // "State" is a business-activity read distinct from raw connectivity
    // status: has the machine actually been transacted/refilled recently.
    const stateBreakdown = [
      { state: 'Recently Alive', count: machines.filter((m) => recentlyAliveIds.has(m.id)).length },
      { state: 'Idle (Online, no recent activity)', count: machines.filter((m) => m.status === 'ONLINE' && !recentlyAliveIds.has(m.id)).length },
      { state: 'Maintenance', count: machines.filter((m) => m.status === 'MAINTENANCE').length },
      { state: 'Dormant (Offline, no recent activity)', count: machines.filter((m) => m.status === 'OFFLINE' && !recentlyAliveIds.has(m.id)).length },
    ];

    const machinesBySales = topBottom(transactions, (t) => t.machine.name, salesValue, limit);
    const clustersBySales = topBottom(
      transactions.filter((t) => t.machine.cluster),
      (t) => t.machine.cluster!.name,
      salesValue,
      limit,
    );
    const warehousesByRefills = topBottom(
      refills.filter((r) => r.warehouse),
      (r) => r.warehouse!.name,
      (r) => r.quantity,
      limit,
    );

    const drilldown = machines
      .map((m) => {
        const machineTxns = transactions.filter((t) => t.machineId === m.id);
        const machineRefills = refills.filter((r) => r.machineId === m.id);
        const last = lastActivityByMachine.get(m.id);
        return {
          name: m.name,
          code: m.code,
          cluster: m.cluster?.name ?? '—',
          status: m.status,
          state: recentlyAliveIds.has(m.id) ? 'Recently Alive' : m.status === 'MAINTENANCE' ? 'Maintenance' : m.status === 'ONLINE' ? 'Idle' : 'Dormant',
          sales: round2(sum(machineTxns.map(salesValue))),
          refillQty: sum(machineRefills.map((r) => r.quantity)),
          lastActive: last ? last.toISOString() : null,
        };
      })
      .sort((a, b) => b.sales - a.sales);

    return {
      range: { from, to },
      thresholdHours,
      salesMetric,
      totalMachines: machines.length,
      activated: machines.length,
      running: machines.filter((m) => m.status === 'ONLINE').length,
      offline: machines.filter((m) => m.status === 'OFFLINE').length,
      recentlyAlive: recentlyAliveIds.size,
      statusBreakdown,
      stateBreakdown,
      topMachinesBySales: machinesBySales.top,
      worstMachinesBySales: machinesBySales.worst,
      topClustersBySales: clustersBySales.top,
      worstClustersBySales: clustersBySales.worst,
      topWarehousesByRefills: warehousesByRefills.top,
      worstWarehousesByRefills: warehousesByRefills.worst,
      drilldown,
    };
  }
}