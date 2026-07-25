import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { ReportsService } from './reports.service';
import { computeNextRunAt } from './schedule.util';

// Step 4 (1.10) — "the cron trigger that turns a due schedule into an actual
// ExportJob isn't wired yet". This is that trigger: every 5 minutes, find
// every active ReportSchedule whose nextRunAt has passed, fire a real
// ExportJob for it through ReportsService.create() (same path the on-demand
// export button uses), then push nextRunAt forward by one more occurrence of
// its frequency and stamp lastRunAt.
//
// Runs in-process on a single instance, matching how ReportsService.process()
// already runs one-off jobs in this pass — swap both for a real queue
// consumer together when volume needs it.
@Injectable()
export class ScheduledReportsCronService {
  private readonly logger = new Logger(ScheduledReportsCronService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly reportsService: ReportsService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async runDueSchedules() {
    const now = new Date();
    const due = await this.prisma.reportSchedule.findMany({
      where: { isActive: true, nextRunAt: { lte: now } },
    });

    if (due.length === 0) return;
    this.logger.log(`Found ${due.length} due schedule(s) — creating export jobs.`);

    for (const schedule of due) {
      try {
        await this.reportsService.create(schedule.orgId, 'scheduler', {
          type: schedule.type,
          filters: (schedule.filters as Record<string, unknown>) ?? {},
        });

        await this.prisma.reportSchedule.update({
          where: { id: schedule.id },
          data: { lastRunAt: now, nextRunAt: computeNextRunAt(schedule.frequency, now) },
        });
      } catch (err) {
        this.logger.error(`Failed to run schedule ${schedule.id}`, err as Error);
      }
    }
  }
}
