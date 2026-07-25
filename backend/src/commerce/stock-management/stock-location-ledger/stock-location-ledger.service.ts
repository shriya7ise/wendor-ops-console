import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryLedgerEntryDto } from './dto/query-stock-location-ledger.dto';
import { LedgerEntry } from './interfaces/stock-location-ledger.interface';
import { MOCK_LEDGER_ENTRY, LEDGER_ENTRY_MOVEMENTTYPE, LEDGER_ENTRY_SOURCEMODULE } from './stock-location-ledger.mock';

@Injectable()
export class StockLocationLedgerService {
  private readonly records: LedgerEntry[] = MOCK_LEDGER_ENTRY;

  findAll(query: QueryLedgerEntryDto) {
    let results = this.records;

    if (query.search) {
      const term = query.search.toLowerCase();
      results = results.filter(
        (r) =>
        r.id.toLowerCase().includes(term) ||
        r.referenceNumber.toLowerCase().includes(term) ||
        r.product.toLowerCase().includes(term),
      );
    }
    if (query.movementType) {
      results = results.filter((r) => r.movementType === query.movementType);
    }
    if (query.sourceModule) {
      results = results.filter((r) => r.sourceModule === query.sourceModule);
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

  private buildSummary(rows: LedgerEntry[]) {
    const summary = ((rows) => [
      { label: 'Opening Balance', value: rows.length ? rows[rows.length - 1].previousQuantity : 0 },
      { label: 'Total Stock In', value: rows.reduce((s, r) => s + r.stockIn, 0) },
      { label: 'Total Stock Out', value: rows.reduce((s, r) => s + r.stockOut, 0) },
      { label: 'Closing Balance', value: rows.length ? rows[0].balance : 0 },
    ])(rows);
    return Object.fromEntries(summary.map((s: { label: string; value: unknown }) => [s.label, s.value]));
  }

  findOne(id: string): LedgerEntry {
    const found = this.records.find((r) => r.id === id);
    if (!found) throw new NotFoundException(`LedgerEntry ${id} not found`);
    return found;
  }

  getFilterOptions() {
    return {

      movementTypes: LEDGER_ENTRY_MOVEMENTTYPE,
      sourceModules: LEDGER_ENTRY_SOURCEMODULE,
    };
  }
}
