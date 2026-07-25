import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryCancelledCartDto } from './dto/query-cancelled-cart.dto';
import { CancelledCartItem } from './interfaces/cancelled-cart.interface';
import {
  CLUSTER_OPTIONS,
  FAILURE_REASON_OPTIONS,
  MACHINE_OPTIONS,
  MOCK_CANCELLED_CART,
  PAYMENT_STATUS_OPTIONS,
} from './cancelled-cart.mock';

@Injectable()
export class CancelledCartService {
  private readonly items: CancelledCartItem[] = MOCK_CANCELLED_CART;

  private filtered(query: QueryCancelledCartDto) {
    let results = this.items;

    if (query.search) {
      const term = query.search.toLowerCase();
      results = results.filter(
        (r) =>
          r.id.toLowerCase().includes(term) ||
          r.machine.toLowerCase().includes(term),
      );
    }
    if (query.status) {
      results = results.filter((r) => r.paymentStatus === query.status);
    }
    if (query.cluster) {
      results = results.filter((r) => r.cluster === query.cluster);
    }
    if (query.machine) {
      results = results.filter((r) => r.machine === query.machine);
    }
    if (query.failureReason) {
      results = results.filter(
        (r) => r.details.failureReason === query.failureReason,
      );
    }
    return results;
  }

  findAll(query: QueryCancelledCartDto) {
    const results = this.filtered(query);

    const total = results.length;
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const start = (page - 1) * limit;
    const paged = results.slice(start, start + limit);

    const summary = {
      totalRequests: total,
      totalAmount: Math.round(
        results.reduce((sum, r) => sum + r.amount, 0) * 100,
      ) / 100,
    };

    return {
      data: paged,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      summary,
    };
  }

  findOne(id: string): CancelledCartItem {
    const found = this.items.find((r) => r.id === id);
    if (!found) {
      throw new NotFoundException(`Cancelled cart entry ${id} not found`);
    }
    return found;
  }

  // Powers the PRD "Download" action — CSV export of the filtered set.
  exportCsv(query: QueryCancelledCartDto): string {
    const rows = this.filtered(query);
    const header = [
      'Request ID',
      'Cluster',
      'Date',
      'Gateway ID',
      'Machine',
      'Amount',
      'Payment Method',
      'Status',
      'Failure Reason',
    ];
    const lines = rows.map((r) =>
      [
        r.id,
        r.cluster,
        r.date,
        r.gatewayId,
        r.machine,
        r.amount,
        r.paymentMethod,
        r.paymentStatus,
        r.details.failureReason,
      ].join(','),
    );
    return [header.join(','), ...lines].join('\n');
  }

  getFilterOptions() {
    return {
      clusters: CLUSTER_OPTIONS,
      machines: MACHINE_OPTIONS,
      statuses: PAYMENT_STATUS_OPTIONS,
      failureReasons: FAILURE_REASON_OPTIONS,
    };
  }
}
