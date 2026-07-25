import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryVendorDto } from './dto/query-vendors.dto';
import { Vendor } from './interfaces/vendors.interface';
import { MOCK_VENDOR } from './vendors.mock';

@Injectable()
export class VendorsService {
  private readonly records: Vendor[] = MOCK_VENDOR;

  findAll(query: QueryVendorDto) {
    let results = this.records;

    if (query.search) {
      const term = query.search.toLowerCase();
      results = results.filter(
        (r) =>
        r.vendorName.toLowerCase().includes(term) ||
        r.gstin.toLowerCase().includes(term),
      );
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

  private buildSummary(rows: Vendor[]) {
    const summary = ((rows) => [{ label: 'Total Vendors', value: rows.length }])(rows);
    return Object.fromEntries(summary.map((s: { label: string; value: unknown }) => [s.label, s.value]));
  }

  findOne(id: string): Vendor {
    const found = this.records.find((r) => r.id === id);
    if (!found) throw new NotFoundException(`Vendor ${id} not found`);
    return found;
  }

  getFilterOptions() {
    return {

    };
  }
}
