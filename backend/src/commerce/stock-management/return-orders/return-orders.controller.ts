import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryReturnOrderDto } from './dto/query-return-orders.dto';
import { ReturnOrdersService } from './return-orders.service';

// PRD 2.2.2.6 — Return Orders
@Controller('commerce/stock-management/return-orders')
export class ReturnOrdersController {
  constructor(private readonly service: ReturnOrdersService) {}

  @Get()
  findAll(@Query() query: QueryReturnOrderDto) {
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
