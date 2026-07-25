import { Controller, Get, Param, Post, Body, Query, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { ReportsService } from './reports.service';
import { CreateExportDto, ListExportsQueryDto } from './dto/export.dto';

@Controller('reports/exports')
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreateExportDto) {
    return this.service.create(req.orgId, req.userId ?? 'unknown', dto);
  }

  @Get()
  list(@Req() req: any, @Query() query: ListExportsQueryDto) {
    return this.service.list(req.orgId, query);
  }

  @Get(':id/download')
  async download(@Req() req: any, @Param('id') id: string, @Res() res: Response) {
    const filePath = await this.service.getDownloadPath(req.orgId, id);
    res.download(filePath);
  }
}
