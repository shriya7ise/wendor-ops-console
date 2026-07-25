import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryFeatureRequestDto } from './dto/query-feature-requests.dto';
import { FeatureRequest } from './interfaces/feature-requests.interface';
import { MOCK_FEATURE_REQUEST, FEATURE_REQUEST_STATUSES, FEATURE_REQUEST_MACHINE } from './feature-requests.mock';

@Injectable()
export class FeatureRequestsService {
  private readonly records: FeatureRequest[] = MOCK_FEATURE_REQUEST;

  findAll(query: QueryFeatureRequestDto) {
    let results = this.records;

    if (query.search) {
      const term = query.search.toLowerCase();
      results = results.filter(
        (r) =>
        r.id.toLowerCase().includes(term) ||
        r.subject.toLowerCase().includes(term),
      );
    }
    if (query.machine) {
      results = results.filter((r) => r.machine === query.machine);
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

  private buildSummary(rows: FeatureRequest[]) {
    const summary = ((rows) => [
      { label: 'Total Requests', value: rows.length },
      { label: 'Under Review', value: rows.filter((r) => r.status === 'Under Review').length },
      { label: 'Shipped', value: rows.filter((r) => r.status === 'Shipped').length },
    ])(rows);
    return Object.fromEntries(summary.map((s: { label: string; value: unknown }) => [s.label, s.value]));
  }

  findOne(id: string): FeatureRequest {
    const found = this.records.find((r) => r.id === id);
    if (!found) throw new NotFoundException(`FeatureRequest ${id} not found`);
    return found;
  }

  getFilterOptions() {
    return {
      statuses: FEATURE_REQUEST_STATUSES,
      machines: FEATURE_REQUEST_MACHINE,
    };
  }
}
