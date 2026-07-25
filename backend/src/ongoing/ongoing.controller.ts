import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryOngoingDto } from './dto/query-ongoing.dto';
import { OngoingService } from './ongoing.service';

// PRD 2.1.1.3 — Ongoing Transactions & Requests
@Controller('transactions/ongoing')
export class OngoingController {
  constructor(private readonly ongoingService: OngoingService) {}

  @Get()
  findAll(@Query() query: QueryOngoingDto) {
    return this.ongoingService.findAll(query);
  }

  @Get('filters')
  getFilters() {
    return this.ongoingService.getFilterOptions();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ongoingService.findOne(id);
  }
}
