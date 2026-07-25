import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryPurchaseOrderDto } from './dto/query-purchase-orders.dto';
import { PurchaseOrder } from './interfaces/purchase-orders.interface';
import { MOCK_PURCHASE_ORDER, PURCHASE_ORDER_STATUSES, PURCHASE_ORDER_VENDOR, PURCHASE_ORDER_STOCKLOCATION } from './purchase-orders.mock';

@Injectable()
export class PurchaseOrdersService {
  private readonly records: PurchaseOrder[] = MOCK_PURCHASE_ORDER;

  findAll(query: QueryPurchaseOrderDto) {
    let results = this.records;

    if (query.search) {
      const term = query.search.toLowerCase();
      results = results.filter(
        (r) =>
        r.id.toLowerCase().includes(term) ||
        r.vendor.toLowerCase().includes(term),
      );
    }
    if (query.vendor) {
      results = results.filter((r) => r.vendor === query.vendor);
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

  private buildSummary(rows: PurchaseOrder[]) {
    const summary = ((rows) => [
      { label: 'Total POs', value: rows.length },
      { label: 'Pending Approval', value: rows.filter((r) => r.status === 'Pending Approval').length },
      { label: 'Total Value', value: `₹${rows.reduce((s, r) => s + r.totalCost, 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}` },
    ])(rows);
    return Object.fromEntries(summary.map((s: { label: string; value: unknown }) => [s.label, s.value]));
  }

  findOne(id: string): PurchaseOrder {
    const found = this.records.find((r) => r.id === id);
    if (!found) throw new NotFoundException(`PurchaseOrder ${id} not found`);
    return found;
  }

  getFilterOptions() {
    return {
      statuses: PURCHASE_ORDER_STATUSES,
      vendors: PURCHASE_ORDER_VENDOR,
      stockLocations: PURCHASE_ORDER_STOCKLOCATION,
    };
  }
}
