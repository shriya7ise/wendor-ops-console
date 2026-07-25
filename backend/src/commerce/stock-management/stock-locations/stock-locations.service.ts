import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryStockLocationsDto } from './dto/query-stock-locations.dto';
import { StockLocation } from './interfaces/stock-location.interface';
import { MOCK_STOCK_LOCATIONS, STOCK_LOCATION_TYPES } from './stock-locations.mock';

@Injectable()
export class StockLocationsService {
  private readonly locations: StockLocation[] = MOCK_STOCK_LOCATIONS;

  findAll(query: QueryStockLocationsDto) {
    let results = this.locations;

    if (query.search) {
      const term = query.search.toLowerCase();
      results = results.filter(
        (l) =>
          l.name.toLowerCase().includes(term) ||
          l.manager.toLowerCase().includes(term),
      );
    }
    if (query.type) {
      results = results.filter((l) => l.type === query.type);
    }

    const total = results.length;
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const start = (page - 1) * limit;
    const paged = results.slice(start, start + limit);

    return {
      data: paged,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      summary: { totalLocations: total },
    };
  }

  findOne(id: string): StockLocation {
    const found = this.locations.find((l) => l.id === id);
    if (!found) throw new NotFoundException(`Stock location ${id} not found`);
    return found;
  }

  getFilterOptions() {
    return { types: STOCK_LOCATION_TYPES };
  }
}
