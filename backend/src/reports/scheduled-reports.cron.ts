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
//
// isRunning guard: EVERY_5_MINUTES fires on a fixed schedule regardless of
// whether the previous tick finished. If a batch of exports ever takes
// longer than 5 minutes, overlapping ticks stack on top of each other and
// each one holds DB connections open — that's what was exhausting the
// Prisma connection pool (17 connections) within ~20 minutes. This guard
// makes a tick that overlaps a still-running one skip instead of stack.
@Injectable()
export class ScheduledReportsCronService {
  private readonly logger = new Logger(ScheduledReportsCronService.name);
  private isRunning = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly reportsService: ReportsService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async runDueSchedules() {
    if (this.isRunning) {
      this.logger.warn('Previous runDueSchedules() still in progress — skipping this tick.');
      return;
    }
    this.isRunning = true;

    try {
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
    } finally {
      this.isRunning = false;
    }
  }
}