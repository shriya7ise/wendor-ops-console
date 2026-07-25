import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryOrdersDto } from './dto/query-orders.dto';
import { Order } from './interfaces/order.interface';
import {
  CLUSTER_OPTIONS,
  MACHINE_OPTIONS,
  MOCK_ORDERS,
  PAYMENT_MODE_OPTIONS,
  VEND_STATUS_OPTIONS,
} from './orders.mock';

// NOTE: This service is the swap-in point for a real data layer.
// Baseline (this PoC): in-memory mock array from orders.mock.ts.
// Stretch goal: replace MOCK_ORDERS reads below with a repository
// (e.g. TypeORM/Prisma) backed by Postgres — the controller and DTO
// contracts would not need to change.
@Injectable()
export class OrdersService {
  private readonly orders: Order[] = MOCK_ORDERS;

  findAll(query: QueryOrdersDto) {
    let results = this.orders;

    if (query.search) {
      const term = query.search.toLowerCase();
      results = results.filter(
        (t) =>
          t.id.toLowerCase().includes(term) ||
          t.machine.toLowerCase().includes(term),
      );
    }
    if (query.status) {
      results = results.filter((t) => t.vendStatus === query.status);
    }
    if (query.paymentMode) {
      results = results.filter((t) => t.paymentMode === query.paymentMode);
    }
    if (query.cluster) {
      results = results.filter((t) => t.cluster === query.cluster);
    }
    if (query.machine) {
      results = results.filter((t) => t.machine === query.machine);
    }
    if (query.dateFrom) {
      const from = new Date(query.dateFrom).getTime();
      results = results.filter((t) => new Date(t.time).getTime() >= from);
    }
    if (query.dateTo) {
      const to = new Date(query.dateTo).getTime();
      results = results.filter((t) => new Date(t.time).getTime() <= to);
    }

    const total = results.length;
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const start = (page - 1) * limit;
    const paged = results.slice(start, start + limit);

    const summary = {
      totalTransactions: total,
      totalAmount: Math.round(
        results.reduce((sum, t) => sum + t.amount, 0) * 100,
      ) / 100,
      successCount: results.filter((t) => t.vendStatus === 'Success').length,
      failedCount: results.filter((t) => t.vendStatus === 'Failed').length,
      pendingCount: results.filter((t) => t.vendStatus === 'Pending').length,
    };

    return {
      data: paged,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      summary,
    };
  }

  findOne(id: string): Order {
    const found = this.orders.find((t) => t.id === id);
    if (!found) {
      throw new NotFoundException(`Order ${id} not found`);
    }
    return found;
  }

  getFilterOptions() {
    return {
      clusters: CLUSTER_OPTIONS,
      machines: MACHINE_OPTIONS,
      paymentModes: PAYMENT_MODE_OPTIONS,
      statuses: VEND_STATUS_OPTIONS,
    };
  }
}
