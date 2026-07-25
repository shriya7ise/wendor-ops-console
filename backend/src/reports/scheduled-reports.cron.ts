// scheduled-reports.cron.ts
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
// whether the previous tick finished. Without it, a slow tick and the next
// tick could overlap and stack connection usage on top of each other.
//
// CONCURRENCY: create() used to be fire-and-forget (kicked off process()
// without awaiting it), so every due schedule in a tick started processing
// simultaneously with no cap — N due schedules meant N concurrent
// findMany()/include-heavy queries all holding DB connections at once,
// which is what was exhausting the 17-connection pool. Processing in small
// batches (and awaiting each export's processing via create(..., true))
// caps how many exports run — and how many connections are held — at once.
@Injectable()
export class ScheduledReportsCronService {
  private readonly logger = new Logger(ScheduledReportsCronService.name);
  private isRunning = false;

  // How many exports are allowed to process at the same time. Tune this
  // against your DB's connection_limit — keep it comfortably below it,
  // since each export can itself use more than one connection over its
  // lifetime (status update -> generate -> status update).
  private static readonly CONCURRENCY = 3;

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

      const { CONCURRENCY } = ScheduledReportsCronService;
      for (let i = 0; i < due.length; i += CONCURRENCY) {
        const batch = due.slice(i, i + CONCURRENCY);

        await Promise.all(
          batch.map(async (schedule) => {
            try {
              // awaitProcessing=true — cron must wait for each export to
              // actually finish (or fail) before it's "done", so the
              // batching above genuinely caps concurrent connection use
              // instead of just capping how fast job rows get created.
              await this.reportsService.create(
                schedule.orgId,
                'scheduler',
                {
                  type: schedule.type,
                  filters: (schedule.filters as Record<string, unknown>) ?? {},
                },
                true,
              );

              await this.prisma.reportSchedule.update({
                where: { id: schedule.id },
                data: { lastRunAt: now, nextRunAt: computeNextRunAt(schedule.frequency, now) },
              });
            } catch (err) {
              this.logger.error(`Failed to run schedule ${schedule.id}`, err as Error);
            }
          }),
        );
      }
    } finally {
      this.isRunning = false;
    }
  }
}