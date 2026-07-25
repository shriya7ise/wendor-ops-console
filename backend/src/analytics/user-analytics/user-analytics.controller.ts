import { Controller, Get, Query, Req } from '@nestjs/common';
import { UserAnalyticsService, UserQueryDto } from './user-analytics.service';

@Controller('analytics/user')
export class UserAnalyticsController {
  constructor(private readonly service: UserAnalyticsService) {}

  @Get('search')
  search(@Req() req: any, @Query('q') q = '') {
    return this.service.search(req.orgId, q);
  }

  @Get()
  get(@Req() req: any, @Query() query: UserQueryDto) {
    return this.service.getUserAnalytics(req.orgId, query);
  }
}
