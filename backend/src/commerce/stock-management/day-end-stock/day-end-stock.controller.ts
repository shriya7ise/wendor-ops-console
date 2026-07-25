import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryDayEndStockDto } from './dto/query-day-end-stock.dto';
import { DayEndStockService } from './day-end-stock.service';

// PRD 2.2.2.9 — Day End Stock
@Controller('commerce/stock-management/day-end-stock')
export class DayEndStockController {
  constructor(private readonly service: DayEndStockService) {}

  @Get()
  findAll(@Query() query: QueryDayEndStockDto) {
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
