import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryExpenseClaimDto } from './dto/query-expenses.dto';
import { ExpensesService } from './expenses.service';

// PRD 2.1.2.1 — Expenses
@Controller('transactions/claims/expenses')
export class ExpensesController {
  constructor(private readonly service: ExpensesService) {}

  @Get()
  findAll(@Query() query: QueryExpenseClaimDto) {
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
