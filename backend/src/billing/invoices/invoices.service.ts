import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryInvoiceDto } from './dto/query-invoices.dto';
import { Invoice } from './interfaces/invoices.interface';
import { MOCK_INVOICE, INVOICE_STATUSES, INVOICE_SUBSCRIPTIONPLAN } from './invoices.mock';

@Injectable()
export class InvoicesService {
  private readonly records: Invoice[] = MOCK_INVOICE;

  findAll(query: QueryInvoiceDto) {
    let results = this.records;

    if (query.search) {
      const term = query.search.toLowerCase();
      results = results.filter(
        (r) =>
        r.id.toLowerCase().includes(term),
      );
    }
    if (query.subscriptionPlan) {
      results = results.filter((r) => r.subscriptionPlan === query.subscriptionPlan);
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

  private buildSummary(rows: Invoice[]) {
    const summary = ((rows) => [
      { label: 'Total Invoices', value: rows.length },
      { label: 'Pending', value: rows.filter((r) => r.paymentStatus === 'Pending').length },
      { label: 'Overdue', value: rows.filter((r) => r.paymentStatus === 'Overdue').length },
      { label: 'Total Billed', value: `₹${rows.reduce((s, r) => s + r.amount, 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}` },
    ])(rows);
    return Object.fromEntries(summary.map((s: { label: string; value: unknown }) => [s.label, s.value]));
  }

  findOne(id: string): Invoice {
    const found = this.records.find((r) => r.id === id);
    if (!found) throw new NotFoundException(`Invoice ${id} not found`);
    return found;
  }

  getFilterOptions() {
    return {
      statuses: INVOICE_STATUSES,
      subscriptionPlans: INVOICE_SUBSCRIPTIONPLAN,
    };
  }
}
