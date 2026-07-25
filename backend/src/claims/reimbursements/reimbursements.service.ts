import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryReimbursementDto } from './dto/query-reimbursements.dto';
import { Reimbursement } from './interfaces/reimbursements.interface';
import { MOCK_REIMBURSEMENT, REIMBURSEMENT_STATUSES, REIMBURSEMENT_EMPLOYEE } from './reimbursements.mock';

@Injectable()
export class ReimbursementsService {
  private readonly records: Reimbursement[] = MOCK_REIMBURSEMENT;

  findAll(query: QueryReimbursementDto) {
    let results = this.records;

    if (query.search) {
      const term = query.search.toLowerCase();
      results = results.filter(
        (r) =>
        r.id.toLowerCase().includes(term) ||
        r.employee.toLowerCase().includes(term),
      );
    }
    if (query.employee) {
      results = results.filter((r) => r.employee === query.employee);
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

  private buildSummary(rows: Reimbursement[]) {
    const summary = ((rows) => [
      { label: 'Total Reimbursements', value: rows.length },
      { label: 'Pending', value: rows.filter((r) => r.status === 'Pending').length },
      { label: 'Total Paid', value: `₹${rows.filter((r) => r.status === 'Paid').reduce((s, r) => s + r.amount, 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}` },
    ])(rows);
    return Object.fromEntries(summary.map((s: { label: string; value: unknown }) => [s.label, s.value]));
  }

  findOne(id: string): Reimbursement {
    const found = this.records.find((r) => r.id === id);
    if (!found) throw new NotFoundException(`Reimbursement ${id} not found`);
    return found;
  }

  getFilterOptions() {
    return {
      statuses: REIMBURSEMENT_STATUSES,
      employees: REIMBURSEMENT_EMPLOYEE,
    };
  }
}
