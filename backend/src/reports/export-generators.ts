import { PrismaService } from '../prisma/prisma.service';
import { toCsv } from './csv.util';
import { classifyAttendance } from '../common/analytics.util';

/** One generator per ExportType. Each takes the org + the filters the user
 *  had selected on the source screen and returns CSV text + a row count.
 *  All six types now hit real Prisma models. */
export async function generateExport(
  prisma: PrismaService,
  orgId: string,
  type: string,
  filters: Record<string, any> = {},
): Promise<{ csv: string; rowCount: number }> {
  const dateFilter = (field: string) =>
    filters.from || filters.to
      ? { [field]: { ...(filters.from ? { gte: new Date(filters.from) } : {}), ...(filters.to ? { lte: new Date(filters.to) } : {}) } }
      : {};

  switch (type) {
    case 'SUPPLIER_ANALYSIS': {
      const pos = await prisma.purchaseOrder.findMany({
        where: { supplier: { orgId }, ...(filters.supplierId ? { supplierId: filters.supplierId } : {}), ...dateFilter('orderedAt') },
        include: { supplier: true, items: true },
      });
      const rows = pos.map((po) => ({
        poNumber: po.poNumber,
        supplier: po.supplier.name,
        status: po.status,
        orderedAt: po.orderedAt?.toISOString() ?? '',
        receivedAt: po.receivedAt?.toISOString() ?? '',
        orderedQty: po.items.reduce((s, i) => s + i.orderedQty, 0),
        receivedQty: po.items.reduce((s, i) => s + i.receivedQty, 0),
      }));
      return { csv: toCsv(rows), rowCount: rows.length };
    }

    case 'TRANSACTION_DOWNLOAD': {
      const tx = await prisma.transaction.findMany({
        where: { orgId, ...(filters.machineId ? { machineId: filters.machineId } : {}), ...dateFilter('createdAt') },
        include: { machine: true, product: true, employee: true },
        orderBy: { createdAt: 'desc' },
      });
      const rows = tx.map((t) => ({
        date: t.createdAt.toISOString(),
        machine: t.machine.name,
        product: t.product.name,
        quantity: t.quantity,
        amount: Number(t.amount),
        paymentMethod: t.paymentMethod ?? '',
        status: t.status,
        employee: t.employee?.name ?? '',
      }));
      return { csv: toCsv(rows), rowCount: rows.length };
    }

    case 'WALLET_USER_DOWNLOAD': {
      const users = await prisma.walletUser.findMany({ where: { orgId } });
      const rows = users.map((u) => ({
        name: u.name,
        phone: u.phone ?? '',
        balance: Number(u.balance),
        lastActivityAt: u.lastActivityAt?.toISOString() ?? '',
      }));
      return { csv: toCsv(rows), rowCount: rows.length };
    }

    case 'ATTENDANCE_EXPORT': {
      const records = await prisma.attendance.findMany({
        where: {
          orgId,
          ...(filters.clusterId ? { clusterId: filters.clusterId } : {}),
          ...dateFilter('checkIn'),
        },
        include: { employee: true, cluster: true },
        orderBy: filters.variant === 'register' ? [{ cluster: { name: 'asc' } }, { employee: { name: 'asc' } }] : { checkIn: 'desc' },
      });

      // Two distinct outputs off the same underlying data, per spec:
      // "Export Attendance Sheet" (chronological log with hours + status)
      // vs. "Register Sheet" (roll-call style, grouped by cluster then
      // employee — no hours/status columns, matches a physical sign-in
      // register).
      if (filters.variant === 'register') {
        const rows = records.map((a) => ({
          date: a.checkIn.toISOString().slice(0, 10),
          cluster: a.cluster?.name ?? '',
          employee: a.employee.name,
          checkIn: a.checkIn.toISOString(),
          checkOut: a.checkOut?.toISOString() ?? '',
        }));
        return { csv: toCsv(rows), rowCount: rows.length };
      }

      const rows = records.map((a) => ({
        employee: a.employee.name,
        cluster: a.cluster?.name ?? '',
        checkIn: a.checkIn.toISOString(),
        checkOut: a.checkOut?.toISOString() ?? '',
        hoursWorked: a.checkOut ? round2((a.checkOut.getTime() - a.checkIn.getTime()) / 3_600_000) : '',
        status: classifyAttendance(a),
      }));
      return { csv: toCsv(rows), rowCount: rows.length };
    }

    case 'MACHINE_LOCATIONS': {
      const machines = await prisma.machine.findMany({ where: { orgId }, include: { cluster: true } });
      const rows = machines.map((m) => ({
        name: m.name,
        code: m.code ?? '',
        cluster: m.cluster?.name ?? '',
        status: m.status,
        lat: m.lat ?? '',
        lng: m.lng ?? '',
      }));
      return { csv: toCsv(rows), rowCount: rows.length };
    }

    case 'EMPLOYEE_REPORT': {
      const tx = await prisma.transaction.findMany({
        where: { orgId, employeeId: { not: null }, ...dateFilter('createdAt') },
        include: { employee: true, product: true },
        orderBy: { createdAt: 'desc' },
      });
      const rows = tx.map((t) => ({
        date: t.createdAt.toISOString(),
        orderId: t.id,
        product: t.product.name,
        employee: t.employee?.name ?? '',
        eventStatus: t.status,
      }));
      return { csv: toCsv(rows), rowCount: rows.length };
    }

    case 'SCHEDULED_REPORT': {
      const schedules = await prisma.reportSchedule.findMany({ where: { orgId } });
      const rows = schedules.map((s) => ({
        type: s.type,
        frequency: s.frequency,
        isActive: s.isActive,
        lastRunAt: s.lastRunAt?.toISOString() ?? '',
        nextRunAt: s.nextRunAt?.toISOString() ?? '',
        recipients: s.recipients.join('; '),
      }));
      return { csv: toCsv(rows), rowCount: rows.length };
    }

    default:
      return { csv: toCsv([{ note: `Unknown export type ${type}` }]), rowCount: 0 };
  }
}

function round2(n: number) { return Math.round(n * 100) / 100; }
