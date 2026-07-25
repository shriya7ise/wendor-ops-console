import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryCreditTransactionDto } from './dto/query-credit-history.dto';
import { CreditTransaction } from './interfaces/credit-history.interface';
import { MOCK_CREDIT_TRANSACTION, CREDIT_TRANSACTION_TRANSACTIONTYPE, CREDIT_TRANSACTION_MACHINENAME } from './credit-history.mock';

@Injectable()
export class CreditHistoryService {
  private readonly records: CreditTransaction[] = MOCK_CREDIT_TRANSACTION;

  findAll(query: QueryCreditTransactionDto) {
    let results = this.records;

    if (query.search) {
      const term = query.search.toLowerCase();
      results = results.filter(
        (r) =>
        r.id.toLowerCase().includes(term) ||
        r.machineName.toLowerCase().includes(term),
      );
    }
    if (query.transactionType) {
      results = results.filter((r) => r.transactionType === query.transactionType);
    }
    if (query.machineName) {
      results = results.filter((r) => r.machineName === query.machineName);
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

  private buildSummary(rows: CreditTransaction[]) {
    const summary = ((rows) => [
      { label: 'Total Entries', value: rows.length },
      { label: 'Net Credits', value: rows.reduce((s, r) => s + r.credits, 0) },
    ])(rows);
    return Object.fromEntries(summary.map((s: { label: string; value: unknown }) => [s.label, s.value]));
  }

  findOne(id: string): CreditTransaction {
    const found = this.records.find((r) => r.id === id);
    if (!found) throw new NotFoundException(`CreditTransaction ${id} not found`);
    return found;
  }

  getFilterOptions() {
    return {

      transactionTypes: CREDIT_TRANSACTION_TRANSACTIONTYPE,
      machineNames: CREDIT_TRANSACTION_MACHINENAME,
    };
  }
}
