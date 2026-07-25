import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryStockTransferDto } from './dto/query-stock-transfers.dto';
import { StockTransfersService } from './stock-transfers.service';

// PRD 2.2.2.7 — Stock Transfers
@Controller('commerce/stock-management/stock-transfers')
export class StockTransfersController {
  constructor(private readonly service: StockTransfersService) {}

  @Get()
  findAll(@Query() query: QueryStockTransferDto) {
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
