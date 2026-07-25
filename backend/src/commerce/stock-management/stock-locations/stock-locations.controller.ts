import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryStockLocationsDto } from './dto/query-stock-locations.dto';
import { StockLocationsService } from './stock-locations.service';

// PRD 2.2.2.2 — Stock Locations
@Controller('commerce/stock-management/stock-locations')
export class StockLocationsController {
  constructor(private readonly stockLocationsService: StockLocationsService) {}

  @Get()
  findAll(@Query() query: QueryStockLocationsDto) {
    return this.stockLocationsService.findAll(query);
  }

  @Get('filters')
  getFilters() {
    return this.stockLocationsService.getFilterOptions();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockLocationsService.findOne(id);
  }
}
