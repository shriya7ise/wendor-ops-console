import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryStockAuditDto } from './dto/query-stock-audits.dto';
import { StockAudit } from './interfaces/stock-audits.interface';
import { MOCK_STOCK_AUDIT, STOCK_AUDIT_STOCKLOCATION } from './stock-audits.mock';

@Injectable()
export class StockAuditsService {
  private readonly records: StockAudit[] = MOCK_STOCK_AUDIT;

  findAll(query: QueryStockAuditDto) {
    let results = this.records;

    if (query.search) {
      const term = query.search.toLowerCase();
      results = results.filter(
        (r) =>
        r.id.toLowerCase().includes(term) ||
        r.stockLocation.toLowerCase().includes(term),
      );
    }
    if (query.stockLocation) {
      results = results.filter((r) => r.stockLocation === query.stockLocation);
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

  private buildSummary(rows: StockAudit[]) {
    const summary = ((rows) => [
      { label: 'Total Audits', value: rows.length },
      { label: 'Net Stock Change', value: rows.reduce((s, r) => s + r.stockChange, 0) },
    ])(rows);
    return Object.fromEntries(summary.map((s: { label: string; value: unknown }) => [s.label, s.value]));
  }

  findOne(id: string): StockAudit {
    const found = this.records.find((r) => r.id === id);
    if (!found) throw new NotFoundException(`StockAudit ${id} not found`);
    return found;
  }

  getFilterOptions() {
    return {

      stockLocations: STOCK_AUDIT_STOCKLOCATION,
    };
  }
}
