import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryConsumerTicketDto } from './dto/query-consumer-help-center.dto';
import { ConsumerTicket } from './interfaces/consumer-help-center.interface';
import { MOCK_CONSUMER_TICKET, CONSUMER_TICKET_STATUSES, CONSUMER_TICKET_MACHINE } from './consumer-help-center.mock';

@Injectable()
export class ConsumerHelpCenterService {
  private readonly records: ConsumerTicket[] = MOCK_CONSUMER_TICKET;

  findAll(query: QueryConsumerTicketDto) {
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

  private buildSummary(rows: ConsumerTicket[]) {
    const summary = ((rows) => [
      { label: 'Open', value: rows.filter((r) => r.status === 'Open').length },
      { label: 'In Progress', value: rows.filter((r) => r.status === 'In Progress').length },
      { label: 'Resolved', value: rows.filter((r) => r.status === 'Resolved').length },
    ])(rows);
    return Object.fromEntries(summary.map((s: { label: string; value: unknown }) => [s.label, s.value]));
  }

  findOne(id: string): ConsumerTicket {
    const found = this.records.find((r) => r.id === id);
    if (!found) throw new NotFoundException(`ConsumerTicket ${id} not found`);
    return found;
  }

  getFilterOptions() {
    return {
      statuses: CONSUMER_TICKET_STATUSES,
      machines: CONSUMER_TICKET_MACHINE,
    };
  }
}
