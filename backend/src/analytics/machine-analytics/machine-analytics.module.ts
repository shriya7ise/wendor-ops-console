import { Module } from '@nestjs/common';
import { MachineAnalyticsController } from './machine-analytics.controller';
import { MachineAnalyticsService } from './machine-analytics.service';

@Module({
  controllers: [MachineAnalyticsController],
  providers: [MachineAnalyticsService],
})
export class MachineAnalyticsModule {}
