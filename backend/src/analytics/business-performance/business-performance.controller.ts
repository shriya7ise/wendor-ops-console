import { Controller, Get, Query, Req } from '@nestjs/common';
import { BusinessPerformanceService } from './business-performance.service';
import { DateRangeQueryDto } from '../../common/dto/date-range.dto';

@Controller('analytics/business-performance')
export class BusinessPerformanceController {
  constructor(private readonly service: BusinessPerformanceService) {}

  @Get('sales-analytics')
  salesAnalytics(@Req() req: any, @Query() query: DateRangeQueryDto) {
    return this.service.getSalesAnalytics(req.orgId, query);
  }

  @Get('big-sales')
  bigSales(@Req() req: any, @Query() query: DateRangeQueryDto) {
    return this.service.getOrgSales(req.orgId, query);
  }

  @Get('transaction-analytics')
  transactionAnalytics(@Req() req: any, @Query() query: DateRangeQueryDto) {
    return this.service.getTransactionAnalytics(req.orgId, query);
  }
}
