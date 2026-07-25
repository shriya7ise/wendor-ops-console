import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryPaymentRecordDto } from './dto/query-payment-history.dto';
import { PaymentHistoryService } from './payment-history.service';

// PRD 3.1.2 — Payment History
@Controller('billing/payment-history')
export class PaymentHistoryController {
  constructor(private readonly service: PaymentHistoryService) {}

  @Get()
  findAll(@Query() query: QueryPaymentRecordDto) {
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
