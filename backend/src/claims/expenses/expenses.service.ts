import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryExpenseClaimDto } from './dto/query-expenses.dto';
import { ExpenseClaim } from './interfaces/expenses.interface';
import { MOCK_EXPENSE_CLAIM, EXPENSE_CLAIM_STATUSES, EXPENSE_CLAIM_CATEGORY } from './expenses.mock';

@Injectable()
export class ExpensesService {
  private readonly records: ExpenseClaim[] = MOCK_EXPENSE_CLAIM;

  findAll(query: QueryExpenseClaimDto) {
    let results = this.records;

    if (query.search) {
      const term = query.search.toLowerCase();
      results = results.filter(
        (r) =>
        r.id.toLowerCase().includes(term) ||
        r.submittedBy.toLowerCase().includes(term),
      );
    }
    if (query.category) {
      results = results.filter((r) => r.category === query.category);
    }
    if (query.status) {
      results = results.filter((r) => r.status === query.status);
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

  private buildSummary(rows: ExpenseClaim[]) {
    const summary = ((rows) => [
      { label: 'Total Expenses', value: `₹${rows.reduce((s, r) => s + r.amount, 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}` },
      { label: 'In Review', value: rows.filter((r) => r.status === 'In Review').length },
      { label: 'Paid Out', value: rows.filter((r) => r.status === 'Paid Out').length },
      { label: 'Draft', value: rows.filter((r) => r.status === 'Draft').length },
    ])(rows);
    return Object.fromEntries(summary.map((s: { label: string; value: unknown }) => [s.label, s.value]));
  }

  findOne(id: string): ExpenseClaim {
    const found = this.records.find((r) => r.id === id);
    if (!found) throw new NotFoundException(`ExpenseClaim ${id} not found`);
    return found;
  }

  getFilterOptions() {
    return {
      statuses: EXPENSE_CLAIM_STATUSES,
      categorys: EXPENSE_CLAIM_CATEGORY,
    };
  }
}
