import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryRefundsDto } from './dto/query-refunds.dto';
import { RefundsService } from './refunds.service';

// PRD 2.1.1.2 — Refunds
@Controller('transactions/refunds')
export class RefundsController {
  constructor(private readonly refundsService: RefundsService) {}

  @Get()
  findAll(@Query() query: QueryRefundsDto) {
    return this.refundsService.findAll(query);
  }

  @Get('filters')
  getFilters() {
    return this.refundsService.getFilterOptions();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.refundsService.findOne(id);
  }
}
