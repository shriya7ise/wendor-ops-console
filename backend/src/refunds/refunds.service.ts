import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryRefundsDto } from './dto/query-refunds.dto';
import { Refund } from './interfaces/refund.interface';
import {
  MOCK_REFUNDS,
  PAYMENT_MODE_OPTIONS,
  REFUND_STATUS_OPTIONS,
  REFUND_TYPE_OPTIONS,
} from './refunds.mock';

@Injectable()
export class RefundsService {
  private readonly refunds: Refund[] = MOCK_REFUNDS;

  findAll(query: QueryRefundsDto) {
    let results = this.refunds;

    if (query.search) {
      const term = query.search.toLowerCase();
      results = results.filter(
        (r) =>
          r.id.toLowerCase().includes(term) ||
          r.transactionId.toLowerCase().includes(term),
      );
    }
    if (query.status) {
      results = results.filter((r) => r.refundStatus === query.status);
    }
    if (query.refundType) {
      results = results.filter((r) => r.refundType === query.refundType);
    }
    if (query.paymentMode) {
      results = results.filter((r) => r.paymentMode === query.paymentMode);
    }

    const total = results.length;
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const start = (page - 1) * limit;
    const paged = results.slice(start, start + limit);

    // Summary cards per PRD 2.1.1.2: Total Refunds, Refunded, Pending, Failed, Disabled
    const summary = {
      totalRefunds: Math.round(
        results.reduce((sum, r) => sum + r.refundAmount, 0) * 100,
      ) / 100,
      refundedCount: results.filter((r) => r.refundStatus === 'Refunded').length,
      pendingCount: results.filter((r) => r.refundStatus === 'Pending').length,
      failedCount: results.filter((r) => r.refundStatus === 'Failed').length,
      disabledCount: results.filter((r) => r.refundStatus === 'Disabled').length,
    };

    return {
      data: paged,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      summary,
    };
  }

  findOne(id: string): Refund {
    const found = this.refunds.find((r) => r.id === id);
    if (!found) {
      throw new NotFoundException(`Refund ${id} not found`);
    }
    return found;
  }

  getFilterOptions() {
    return {
      statuses: REFUND_STATUS_OPTIONS,
      refundTypes: REFUND_TYPE_OPTIONS,
      paymentModes: PAYMENT_MODE_OPTIONS,
    };
  }
}
