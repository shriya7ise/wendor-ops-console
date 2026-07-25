import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  BulkAssignMachinesDto,
  CreateSettlementDto,
} from './dto/create-settlement.dto';
import { QuerySettlementsDto } from './dto/query-settlements.dto';
import { UpdateSettlementStatusDto } from './dto/update-settlement-status.dto';
import { Settlement } from './interfaces/settlement.interface';
import {
  GATEWAY_OPTIONS,
  MACHINE_OPTIONS,
  MOCK_SETTLEMENTS,
  PROVIDER_OPTIONS,
  STATUS_OPTIONS,
} from './settlements.mock';

// NOTE: swap-in point for a real data layer (Postgres) — see
// products.service.ts for the same in-memory-mock pattern used elsewhere
// in this codebase. Baseline: in-memory mock array from settlements.mock.ts.
@Injectable()
export class SettlementsService {
  private readonly settlements: Settlement[] = MOCK_SETTLEMENTS;

  findAll(query: QuerySettlementsDto) {
    let results = this.settlements;

    if (query.search) {
      const term = query.search.toLowerCase();
      results = results.filter(
        (s) =>
          s.id.toLowerCase().includes(term) ||
          s.merchantId.toLowerCase().includes(term) ||
          s.gateway.toLowerCase().includes(term),
      );
    }
    if (query.gateway) results = results.filter((s) => s.gateway === query.gateway);
    if (query.serviceProvider) {
      results = results.filter((s) => s.serviceProvider === query.serviceProvider);
    }
    if (query.machine) {
      results = results.filter((s) => s.machines.includes(query.machine as string));
    }
    if (query.status) results = results.filter((s) => s.status === query.status);

    const total = results.length;
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const start = (page - 1) * limit;
    const paged = results.slice(start, start + limit);

    const summary = {
      totalSettlements: total,
      activeCount: results.filter((s) => s.status === 'Active').length,
      inactiveCount: results.filter((s) => s.status === 'Inactive').length,
      totalMachinesLinked: new Set(results.flatMap((s) => s.machines)).size,
    };

    return {
      data: paged,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      summary,
    };
  }

  findOne(id: string): Settlement {
    const found = this.settlements.find((s) => s.id === id);
    if (!found) throw new NotFoundException(`Settlement ${id} not found`);
    return found;
  }

  // Powers the "Create Settlement" action.
  create(dto: CreateSettlementDto): Settlement {
    const nextNumber =
      1001 +
      this.settlements.reduce((max, s) => Math.max(max, Number(s.id.replace('STL', ''))), 1000) -
      1000;
    const settlement: Settlement = {
      id: `STL${nextNumber + 1}`,
      gateway: dto.gateway,
      merchantId: dto.merchantId,
      serviceProvider: dto.serviceProvider,
      machines: dto.machines ?? [],
      status: dto.status ?? 'Active',
      createdAt: new Date().toISOString(),
    };
    this.settlements.unshift(settlement);
    return settlement;
  }

  // Powers the "Bulk Assign" action — attach many machines to an existing
  // settlement account in one call.
  bulkAssign(dto: BulkAssignMachinesDto): Settlement {
    const settlement = this.findOne(dto.settlementId);
    if (!dto.machines?.length) {
      throw new BadRequestException('At least one machine is required');
    }
    const merged = new Set([...settlement.machines, ...dto.machines]);
    settlement.machines = Array.from(merged);
    return settlement;
  }

  // Powers the "Actions" column toggle (Active/Inactive).
  updateStatus(id: string, dto: UpdateSettlementStatusDto): Settlement {
    const settlement = this.findOne(id);
    settlement.status = dto.status;
    return settlement;
  }

  getFilterOptions() {
    return {
      gateways: GATEWAY_OPTIONS,
      serviceProviders: PROVIDER_OPTIONS,
      machines: MACHINE_OPTIONS,
      statuses: STATUS_OPTIONS,
    };
  }
}
