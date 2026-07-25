import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryVendorDto } from './dto/query-vendors.dto';
import { VendorsService } from './vendors.service';

// PRD 2.2.2.4 — Vendors
@Controller('commerce/stock-management/vendors')
export class VendorsController {
  constructor(private readonly service: VendorsService) {}

  @Get()
  findAll(@Query() query: QueryVendorDto) {
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
