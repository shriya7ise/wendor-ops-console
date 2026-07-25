import { Module } from '@nestjs/common';
import { UserAnalyticsController } from './user-analytics.controller';
import { UserAnalyticsService } from './user-analytics.service';

@Module({
  controllers: [UserAnalyticsController],
  providers: [UserAnalyticsService],
})
export class UserAnalyticsModule {}
