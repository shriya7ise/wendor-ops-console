import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryOrdersDto } from './dto/query-orders.dto';
import { OrdersService } from './orders.service';

// PRD 2.1.1.1 — Order (the "Transactions" list screen)
@Controller('transactions/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // GET /api/transactions/orders?search=&status=&paymentMode=&cluster=&machine=&dateFrom=&dateTo=&page=&limit=
  @Get()
  findAll(@Query() query: QueryOrdersDto) {
    return this.ordersService.findAll(query);
  }

  // GET /api/transactions/orders/filters — options to populate dropdowns
  @Get('filters')
  getFilters() {
    return this.ordersService.getFilterOptions();
  }

  // GET /api/transactions/orders/:id — powers the "Details" action
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }
}
