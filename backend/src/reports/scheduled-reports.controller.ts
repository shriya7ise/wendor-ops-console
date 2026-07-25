import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleDto, UpdateScheduleDto } from './dto/schedule.dto';
import { Prisma } from '@prisma/client';
import { computeNextRunAt } from '../../src/reports/schedule.util';
// Exports > Scheduled Reports — recurring export configs, separate from
// one-off ExportJob rows created via ReportsController.
@Controller('reports/schedules')
export class ScheduledReportsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  list(@Req() req: any) {
    return this.prisma.reportSchedule.findMany({ where: { orgId: req.orgId }, orderBy: { createdAt: 'desc' } });
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreateScheduleDto) {
    // Step 4 (1.10): nextRunAt is what makes a schedule "due" — previously
    // left null forever, so ScheduledReportsCronService had nothing to pick
    // up. Seed it to the first occurrence of `frequency` from now.
    return this.prisma.reportSchedule.create({
      data: {
        orgId: req.orgId,
        type: dto.type,
        frequency: dto.frequency,
        filters: (dto.filters ?? {}) as Prisma.InputJsonValue,
        recipients: dto.recipients,
        nextRunAt: computeNextRunAt(dto.frequency, new Date()),
      },
    });
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateScheduleDto) {
    // If the frequency changes, re-derive nextRunAt so the schedule doesn't
    // keep firing on the old cadence.
    const data: Prisma.ReportScheduleUpdateInput = { ...dto };
    if (dto.frequency) {
      data.nextRunAt = computeNextRunAt(dto.frequency, new Date());
    }
    return this.prisma.reportSchedule.update({ where: { id }, data });
  }
}
