import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExportDto, ListExportsQueryDto } from './dto/export.dto';
import { generateExport } from './export-generators';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Prisma } from '@prisma/client';

const EXPORT_DIR = process.env.EXPORT_STORAGE_DIR ?? path.join(process.cwd(), 'storage', 'exports');

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /** Creates and (fire-and-forget) processes an ExportJob. Used both by the
   *  on-demand `/reports/exports` endpoint and by ScheduledReportsCronService
   *  when a due ReportSchedule fires — same job row, same status machine,
   *  just a different `requestedBy` ("scheduler" vs. a real user id). */
  async create(orgId: string, requestedBy: string, dto: CreateExportDto) {
    const job = await this.prisma.exportJob.create({
      data: { orgId, requestedBy, type: dto.type, filters: (dto.filters ?? {}) as Prisma.InputJsonValue, status: 'PENDING' },
    });

    // Fire-and-forget. In production, swap this for a BullMQ/SQS producer —
    // the job row + status machine below already matches that shape, so
    // the only change is who calls `process()`.
    this.process(job.id).catch((err) => this.logger.error(`Export ${job.id} failed`, err));

    return job;
  }

  async list(orgId: string, query: ListExportsQueryDto) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const where = { orgId, ...(query.type ? { type: query.type } : {}), ...(query.status ? { status: query.status } : {}) };

    const [items, total] = await Promise.all([
      this.prisma.exportJob.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.exportJob.count({ where }),
    ]);

    return { items, total, page, pageSize };
  }

  async getDownloadPath(orgId: string, id: string) {
    const job = await this.prisma.exportJob.findFirst({ where: { id, orgId } });
    if (!job || job.status !== 'COMPLETED' || !job.fileUrl) {
      throw new NotFoundException('Export not ready or not found.');
    }
    return job.fileUrl;
  }

  private async process(jobId: string) {
    const job = await this.prisma.exportJob.update({
      where: { id: jobId },
      data: { status: 'PROCESSING', startedAt: new Date() },
    });

    try {
      const { csv, rowCount } = await generateExport(this.prisma, job.orgId, job.type, (job.filters as any) ?? {});
      await fs.mkdir(EXPORT_DIR, { recursive: true });
      const filePath = path.join(EXPORT_DIR, `${jobId}.csv`);
      await fs.writeFile(filePath, csv, 'utf-8');

      await this.prisma.exportJob.update({
        where: { id: jobId },
        data: { status: 'COMPLETED', completedAt: new Date(), rowCount, fileUrl: filePath },
      });
    } catch (err: any) {
      await this.prisma.exportJob.update({
        where: { id: jobId },
        data: { status: 'FAILED', completedAt: new Date(), errorMessage: err?.message ?? 'Unknown error' },
      });
    }
  }
}
