import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryPurchaseOrderDto } from './dto/query-purchase-orders.dto';
import { PurchaseOrdersService } from './purchase-orders.service';

// PRD 2.2.2.5 — Purchase Orders
@Controller('commerce/stock-management/purchase-orders')
export class PurchaseOrdersController {
  constructor(private readonly service: PurchaseOrdersService) {}

  @Get()
  findAll(@Query() query: QueryPurchaseOrderDto) {
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
