import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryInvoiceDto } from './dto/query-invoices.dto';
import { InvoicesService } from './invoices.service';

// PRD 3.1.1 — Invoices
@Controller('billing/invoices')
export class InvoicesController {
  constructor(private readonly service: InvoicesService) {}

  @Get()
  findAll(@Query() query: QueryInvoiceDto) {
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
