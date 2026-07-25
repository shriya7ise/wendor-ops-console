import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { BusinessPerformanceModule } from '../analytics/business-performance/business-performance.module';

@Module({
  imports: [BusinessPerformanceModule],
  controllers: [ReportController],
})
export class ReportModule {}
