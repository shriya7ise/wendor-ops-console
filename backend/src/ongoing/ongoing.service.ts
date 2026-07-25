import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryOngoingDto } from './dto/query-ongoing.dto';
import { OngoingTransaction } from './interfaces/ongoing-transaction.interface';
import {
  CLUSTER_OPTIONS,
  MACHINE_OPTIONS,
  MOCK_ONGOING,
  PAYMENT_STATUS_OPTIONS,
} from './ongoing.mock';

@Injectable()
export class OngoingService {
  private readonly items: OngoingTransaction[] = MOCK_ONGOING;

  findAll(query: QueryOngoingDto) {
    let results = this.items;

    if (query.search) {
      const term = query.search.toLowerCase();
      results = results.filter(
        (t) =>
          t.id.toLowerCase().includes(term) ||
          t.machine.toLowerCase().includes(term),
      );
    }
    if (query.status) {
      results = results.filter((t) => t.paymentStatus === query.status);
    }
    if (query.cluster) {
      results = results.filter((t) => t.cluster === query.cluster);
    }
    if (query.machine) {
      results = results.filter((t) => t.machine === query.machine);
    }

    const total = results.length;
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const start = (page - 1) * limit;
    const paged = results.slice(start, start + limit);

    const summary = {
      totalOngoing: total,
      totalAmount: Math.round(
        results.reduce((sum, t) => sum + t.amount, 0) * 100,
      ) / 100,
    };

    return {
      data: paged,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      summary,
    };
  }

  findOne(id: string): OngoingTransaction {
    const found = this.items.find((t) => t.id === id);
    if (!found) {
      throw new NotFoundException(`Transaction ${id} not found`);
    }
    return found;
  }

  getFilterOptions() {
    return {
      clusters: CLUSTER_OPTIONS,
      machines: MACHINE_OPTIONS,
      statuses: PAYMENT_STATUS_OPTIONS,
    };
  }
}
