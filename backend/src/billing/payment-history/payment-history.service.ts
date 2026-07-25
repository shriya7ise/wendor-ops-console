import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryPaymentRecordDto } from './dto/query-payment-history.dto';
import { PaymentRecord } from './interfaces/payment-history.interface';
import { MOCK_PAYMENT_RECORD, PAYMENT_RECORD_STATUSES, PAYMENT_RECORD_PAYMENTMETHOD } from './payment-history.mock';

@Injectable()
export class PaymentHistoryService {
  private readonly records: PaymentRecord[] = MOCK_PAYMENT_RECORD;

  findAll(query: QueryPaymentRecordDto) {
    let results = this.records;

    if (query.search) {
      const term = query.search.toLowerCase();
      results = results.filter(
        (r) =>
        r.id.toLowerCase().includes(term) ||
        r.invoiceNumber.toLowerCase().includes(term),
      );
    }
    if (query.paymentMethod) {
      results = results.filter((r) => r.paymentMethod === query.paymentMethod);
    }
    if (query.paymentStatus) {
      results = results.filter((r) => r.paymentStatus === query.paymentStatus);
    }

    const total = results.length;
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const start = (page - 1) * limit;
    const paged = results.slice(start, start + limit);

    return {
      data: paged,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      summary: this.buildSummary(results),
    };
  }

  private buildSummary(rows: PaymentRecord[]) {
    const summary = ((rows) => [
      { label: 'Total Payments', value: rows.length },
      { label: 'Failed', value: rows.filter((r) => r.paymentStatus === 'Failed').length },
      { label: 'Refunded', value: rows.filter((r) => r.paymentStatus === 'Refunded').length },
    ])(rows);
    return Object.fromEntries(summary.map((s: { label: string; value: unknown }) => [s.label, s.value]));
  }

  findOne(id: string): PaymentRecord {
    const found = this.records.find((r) => r.id === id);
    if (!found) throw new NotFoundException(`PaymentRecord ${id} not found`);
    return found;
  }

  getFilterOptions() {
    return {
      statuses: PAYMENT_RECORD_STATUSES,
      paymentMethods: PAYMENT_RECORD_PAYMENTMETHOD,
    };
  }
}
