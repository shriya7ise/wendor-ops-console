import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryStockItemDto } from './dto/query-items-in-stock.dto';
import { ItemsInStockService } from './items-in-stock.service';

// PRD 2.2.2.3 — Items in Stock Locations
@Controller('commerce/stock-management/items-in-stock')
export class ItemsInStockController {
  constructor(private readonly service: ItemsInStockService) {}

  @Get()
  findAll(@Query() query: QueryStockItemDto) {
    return this.service.findAll(query);
  }

  @Get('filters')
  getFilters() {
    return this.service.getFilterOptions();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
