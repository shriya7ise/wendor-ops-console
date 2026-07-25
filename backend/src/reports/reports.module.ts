import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { ScheduledReportsController } from './scheduled-reports.controller';
import { ScheduledReportsCronService } from './scheduled-reports.cron';
import { AttendanceExportsController } from './attendance-exports.controller';
import { AttendanceExportsService } from './attendance-exports.service';

@Module({
  controllers: [ReportsController, ScheduledReportsController, AttendanceExportsController],
  providers: [ReportsService, ScheduledReportsCronService, AttendanceExportsService],
})
export class ReportsModule {}
