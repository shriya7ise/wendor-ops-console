import { Controller, Get, Query, Req } from '@nestjs/common';
import { MachineAnalyticsService } from './machine-analytics.service';
import { MachineQueryDto } from './machine-query.dto';

@Controller('analytics/machine')
export class MachineAnalyticsController {
  constructor(private readonly service: MachineAnalyticsService) {}

  @Get('search')
  search(@Req() req: any, @Query('q') q = '') {
    return this.service.search(req.orgId, q);
  }

  @Get()
  get(@Req() req: any, @Query() query: MachineQueryDto) {
    return this.service.getMachineAnalytics(req.orgId, query);
  }
}
