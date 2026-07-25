import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryReturnOrderDto } from './dto/query-return-orders.dto';
import { ReturnOrder } from './interfaces/return-orders.interface';
import { MOCK_RETURN_ORDER, RETURN_ORDER_STATUSES, RETURN_ORDER_MACHINE, RETURN_ORDER_STOCKLOCATION } from './return-orders.mock';

@Injectable()
export class ReturnOrdersService {
  private readonly records: ReturnOrder[] = MOCK_RETURN_ORDER;

  findAll(query: QueryReturnOrderDto) {
    let results = this.records;

    if (query.search) {
      const term = query.search.toLowerCase();
      results = results.filter(
        (r) =>
        r.id.toLowerCase().includes(term) ||
        r.machine.toLowerCase().includes(term),
      );
    }
    if (query.machine) {
      results = results.filter((r) => r.machine === query.machine);
    }
    if (query.stockLocation) {
      results = results.filter((r) => r.stockLocation === query.stockLocation);
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

  private buildSummary(rows: ReturnOrder[]) {
    const summary = ((rows) => [
      { label: 'Total Returns', value: rows.length },
      { label: 'Pending', value: rows.filter((r) => r.status === 'Pending').length },
    ])(rows);
    return Object.fromEntries(summary.map((s: { label: string; value: unknown }) => [s.label, s.value]));
  }

  findOne(id: string): ReturnOrder {
    const found = this.records.find((r) => r.id === id);
    if (!found) throw new NotFoundException(`ReturnOrder ${id} not found`);
    return found;
  }

  getFilterOptions() {
    return {
      statuses: RETURN_ORDER_STATUSES,
      machines: RETURN_ORDER_MACHINE,
      stockLocations: RETURN_ORDER_STOCKLOCATION,
    };
  }
}
