import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryServiceTicketDto } from './dto/query-service-tickets.dto';
import { ServiceTicket } from './interfaces/service-tickets.interface';
import { MOCK_SERVICE_TICKET, SERVICE_TICKET_STATUSES, SERVICE_TICKET_MACHINE, SERVICE_TICKET_ESCALATIONPRIORITY, SERVICE_TICKET_APPLICATIONTYPE } from './service-tickets.mock';

@Injectable()
export class ServiceTicketsService {
  private readonly records: ServiceTicket[] = MOCK_SERVICE_TICKET;

  findAll(query: QueryServiceTicketDto) {
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
    if (query.escalationPriority) {
      results = results.filter((r) => r.escalationPriority === query.escalationPriority);
    }
    if (query.applicationType) {
      results = results.filter((r) => r.applicationType === query.applicationType);
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

  private buildSummary(rows: ServiceTicket[]) {
    const summary = ((rows) => [
      { label: 'Open', value: rows.filter((r) => r.status === 'Open').length },
      { label: 'In Progress', value: rows.filter((r) => r.status === 'In Progress').length },
      { label: 'Escalated', value: rows.filter((r) => r.status === 'Escalated').length },
      { label: 'Resolved', value: rows.filter((r) => r.status === 'Resolved').length },
    ])(rows);
    return Object.fromEntries(summary.map((s: { label: string; value: unknown }) => [s.label, s.value]));
  }

  findOne(id: string): ServiceTicket {
    const found = this.records.find((r) => r.id === id);
    if (!found) throw new NotFoundException(`ServiceTicket ${id} not found`);
    return found;
  }

  getFilterOptions() {
    return {
      statuses: SERVICE_TICKET_STATUSES,
      machines: SERVICE_TICKET_MACHINE,
      escalationPrioritys: SERVICE_TICKET_ESCALATIONPRIORITY,
      applicationTypes: SERVICE_TICKET_APPLICATIONTYPE,
    };
  }
}
