import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryReimbursementDto } from './dto/query-reimbursements.dto';
import { ReimbursementsService } from './reimbursements.service';

// PRD 2.1.2.2 — Reimbursements
@Controller('transactions/claims/reimbursements')
export class ReimbursementsController {
  constructor(private readonly service: ReimbursementsService) {}

  @Get()
  findAll(@Query() query: QueryReimbursementDto) {
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
