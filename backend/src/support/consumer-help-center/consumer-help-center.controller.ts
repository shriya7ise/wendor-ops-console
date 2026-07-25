import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryConsumerTicketDto } from './dto/query-consumer-help-center.dto';
import { ConsumerHelpCenterService } from './consumer-help-center.service';

// PRD 3.2.4 — Consumer Help Center
@Controller('support/consumer-help-center')
export class ConsumerHelpCenterController {
  constructor(private readonly service: ConsumerHelpCenterService) {}

  @Get()
  findAll(@Query() query: QueryConsumerTicketDto) {
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
