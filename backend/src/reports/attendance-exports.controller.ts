import { Controller, Get, Query, Req } from '@nestjs/common';
import { AttendanceExportsService } from './attendance-exports.service';
import { AttendanceExportQueryDto } from './dto/attendance-export-query.dto';

// Analytics & Reports > Attendance Exports (1.11) — previously this page
// didn't exist at all; attendance data was only reachable through the
// generic "All Exports" screen as one export type among six. This gives it
// its own filter bar, color-key summary, and (via the existing
// /reports/exports endpoints) the two distinct output buttons the spec
// calls for — "Export Attendance Sheet" and "Register Sheet".
@Controller('reports/attendance-exports')
export class AttendanceExportsController {
  constructor(private readonly service: AttendanceExportsService) {}

  @Get('clusters')
  clusters(@Req() req: any) {
    return this.service.listClusters(req.orgId);
  }

  @Get('summary')
  summary(@Req() req: any, @Query() query: AttendanceExportQueryDto) {
    return this.service.getSummary(req.orgId, query);
  }
}
