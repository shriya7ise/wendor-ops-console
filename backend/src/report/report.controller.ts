import { Controller, Get, Query, Req } from '@nestjs/common';
import { BusinessPerformanceService } from '../analytics/business-performance/business-performance.service';
import { DateRangeQueryDto } from '../common/dto/date-range.dto';

// Top-level "Report" nav item (sidebar, not under Analytics). Same Org
// Sales metrics as Analytics > Business Performance > Big Sales — the
// recordings show identical filter/table shape on both screens, so this
// controller is a thin second entry point onto BusinessPerformanceService
// rather than a duplicate implementation.
@Controller('report')
export class ReportController {
  constructor(private readonly businessPerformance: BusinessPerformanceService) {}

  @Get()
  getReport(@Req() req: any, @Query() query: DateRangeQueryDto) {
    return this.businessPerformance.getOrgSales(req.orgId, query);
  }
}
