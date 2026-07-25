import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryDayEndStockDto } from './dto/query-day-end-stock.dto';
import { DayEndStock } from './interfaces/day-end-stock.interface';
import { MOCK_DAY_END_STOCK, DAY_END_STOCK_STOCKLOCATION, DAY_END_STOCK_MACHINE } from './day-end-stock.mock';

@Injectable()
export class DayEndStockService {
  private readonly records: DayEndStock[] = MOCK_DAY_END_STOCK;

  findAll(query: QueryDayEndStockDto) {
    let results = this.records;

    if (query.search) {
      const term = query.search.toLowerCase();
      results = results.filter(
        (r) =>
        r.id.toLowerCase().includes(term) ||
        r.product.toLowerCase().includes(term),
      );
    }
    if (query.stockLocation) {
      results = results.filter((r) => r.stockLocation === query.stockLocation);
    }
    if (query.machine) {
      results = results.filter((r) => r.machine === query.machine);
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

  private buildSummary(rows: DayEndStock[]) {
    const summary = ((rows) => [{ label: 'Snapshots', value: rows.length }])(rows);
    return Object.fromEntries(summary.map((s: { label: string; value: unknown }) => [s.label, s.value]));
  }

  findOne(id: string): DayEndStock {
    const found = this.records.find((r) => r.id === id);
    if (!found) throw new NotFoundException(`DayEndStock ${id} not found`);
    return found;
  }

  getFilterOptions() {
    return {

      stockLocations: DAY_END_STOCK_STOCKLOCATION,
      machines: DAY_END_STOCK_MACHINE,
    };
  }
}
