import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryStockItemDto } from './dto/query-items-in-stock.dto';
import { StockItem } from './interfaces/items-in-stock.interface';
import { MOCK_STOCK_ITEM, STOCK_ITEM_BRAND, STOCK_ITEM_STOCKLOCATION } from './items-in-stock.mock';

@Injectable()
export class ItemsInStockService {
  private readonly records: StockItem[] = MOCK_STOCK_ITEM;

  findAll(query: QueryStockItemDto) {
    let results = this.records;

    if (query.search) {
      const term = query.search.toLowerCase();
      results = results.filter(
        (r) =>
        r.productName.toLowerCase().includes(term) ||
        r.barcode.toLowerCase().includes(term),
      );
    }
    if (query.brand) {
      results = results.filter((r) => r.brand === query.brand);
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

  private buildSummary(rows: StockItem[]) {
    const summary = ((rows) => [
      { label: 'Total SKUs', value: rows.length },
      { label: 'Low Stock (<15)', value: rows.filter((r) => r.stockInHand < 15).length },
      { label: 'Total Stock Value', value: `₹${rows.reduce((s, r) => s + r.stockInHand * r.warehousePrice, 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}` },
    ])(rows);
    return Object.fromEntries(summary.map((s: { label: string; value: unknown }) => [s.label, s.value]));
  }

  findOne(id: string): StockItem {
    const found = this.records.find((r) => r.id === id);
    if (!found) throw new NotFoundException(`StockItem ${id} not found`);
    return found;
  }

  getFilterOptions() {
    return {

      brands: STOCK_ITEM_BRAND,
      stockLocations: STOCK_ITEM_STOCKLOCATION,
    };
  }
}
