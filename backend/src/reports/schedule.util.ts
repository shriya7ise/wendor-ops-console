import { ScheduleFrequency } from '@prisma/client';

/** Advances `from` by one occurrence of `frequency`. Used both when a
 *  ReportSchedule is first created (to seed nextRunAt) and every time the
 *  cron trigger fires a due schedule (to push nextRunAt forward again). */
export function computeNextRunAt(frequency: ScheduleFrequency, from: Date): Date {
  const next = new Date(from);
  if (frequency === 'DAILY') next.setDate(next.getDate() + 1);
  else if (frequency === 'WEEKLY') next.setDate(next.getDate() + 7);
  else next.setMonth(next.getMonth() + 1); // MONTHLY
  return next;
}
