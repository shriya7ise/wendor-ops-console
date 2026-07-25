import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryLedgerEntryDto } from './dto/query-stock-location-ledger.dto';
import { StockLocationLedgerService } from './stock-location-ledger.service';

// PRD 2.2.2.10 — Stock Location Ledger
@Controller('commerce/stock-management/stock-location-ledger')
export class StockLocationLedgerController {
  constructor(private readonly service: StockLocationLedgerService) {}

  @Get()
  findAll(@Query() query: QueryLedgerEntryDto) {
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
