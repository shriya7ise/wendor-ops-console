import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryServiceTicketDto } from './dto/query-service-tickets.dto';
import { ServiceTicketsService } from './service-tickets.service';

// PRD 3.2.1 — Service Tickets
@Controller('support/service-tickets')
export class ServiceTicketsController {
  constructor(private readonly service: ServiceTicketsService) {}

  @Get()
  findAll(@Query() query: QueryServiceTicketDto) {
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
