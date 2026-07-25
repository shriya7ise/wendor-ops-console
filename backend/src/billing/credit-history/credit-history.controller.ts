import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryCreditTransactionDto } from './dto/query-credit-history.dto';
import { CreditHistoryService } from './credit-history.service';

// PRD 3.1.3 — Credit History
@Controller('billing/credit-history')
export class CreditHistoryController {
  constructor(private readonly service: CreditHistoryService) {}

  @Get()
  findAll(@Query() query: QueryCreditTransactionDto) {
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
