import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { QueryCancelledCartDto } from './dto/query-cancelled-cart.dto';
import { CancelledCartService } from './cancelled-cart.service';

// PRD 2.1.1.4 — Cancelled Cart
@Controller('transactions/cancelled-cart')
export class CancelledCartController {
  constructor(private readonly cancelledCartService: CancelledCartService) {}

  @Get()
  findAll(@Query() query: QueryCancelledCartDto) {
    return this.cancelledCartService.findAll(query);
  }

  @Get('filters')
  getFilters() {
    return this.cancelledCartService.getFilterOptions();
  }

  // GET /api/transactions/cancelled-cart/export — the PRD "Download" action
  @Get('export')
  export(@Query() query: QueryCancelledCartDto, @Res() res: Response) {
    const csv = this.cancelledCartService.exportCsv(query);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="cancelled-cart.csv"',
    );
    res.send(csv);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cancelledCartService.findOne(id);
  }
}
