import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryStockAuditDto } from './dto/query-stock-audits.dto';
import { StockAuditsService } from './stock-audits.service';

// PRD 2.2.2.8 — Stock Audits
@Controller('commerce/stock-management/stock-audits')
export class StockAuditsController {
  constructor(private readonly service: StockAuditsService) {}

  @Get()
  findAll(@Query() query: QueryStockAuditDto) {
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
