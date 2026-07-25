import { Controller, Get, Query, Req } from '@nestjs/common';
import { SupplierAnalyticsService } from './supplier-analytics.service';
import { SupplierQueryDto } from './dto/supplier-query.dto';

// Swap `req.orgId` below for however your auth guard actually attaches the
// caller's organisation (e.g. req.user.orgId from a JWT strategy).
@Controller('analytics/supplier')
export class SupplierAnalyticsController {
  constructor(private readonly service: SupplierAnalyticsService) {}

  @Get('search')
  search(@Req() req: any, @Query('q') q = '') {
    return this.service.search(req.orgId, q);
  }

  @Get()
  getAnalysis(@Req() req: any, @Query() query: SupplierQueryDto) {
    return this.service.getAnalysis(req.orgId, query);
  }
}
