import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryStockTransferDto } from './dto/query-stock-transfers.dto';
import { StockTransfer } from './interfaces/stock-transfers.interface';
import { MOCK_STOCK_TRANSFER, STOCK_TRANSFER_STATUSES, STOCK_TRANSFER_SOURCELOCATION, STOCK_TRANSFER_DESTINATIONLOCATION } from './stock-transfers.mock';

@Injectable()
export class StockTransfersService {
  private readonly records: StockTransfer[] = MOCK_STOCK_TRANSFER;

  findAll(query: QueryStockTransferDto) {
    let results = this.records;

    if (query.search) {
      const term = query.search.toLowerCase();
      results = results.filter(
        (r) =>
        r.id.toLowerCase().includes(term) ||
        r.sourceLocation.toLowerCase().includes(term) ||
        r.destinationLocation.toLowerCase().includes(term),
      );
    }
    if (query.sourceLocation) {
      results = results.filter((r) => r.sourceLocation === query.sourceLocation);
    }
    if (query.destinationLocation) {
      results = results.filter((r) => r.destinationLocation === query.destinationLocation);
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

  private buildSummary(rows: StockTransfer[]) {
    const summary = ((rows) => [
      { label: 'Total Transfers', value: rows.length },
      { label: 'In Transit', value: rows.filter((r) => r.status === 'Sent').length },
    ])(rows);
    return Object.fromEntries(summary.map((s: { label: string; value: unknown }) => [s.label, s.value]));
  }

  findOne(id: string): StockTransfer {
    const found = this.records.find((r) => r.id === id);
    if (!found) throw new NotFoundException(`StockTransfer ${id} not found`);
    return found;
  }

  getFilterOptions() {
    return {
      statuses: STOCK_TRANSFER_STATUSES,
      sourceLocations: STOCK_TRANSFER_SOURCELOCATION,
      destinationLocations: STOCK_TRANSFER_DESTINATIONLOCATION,
    };
  }
}
