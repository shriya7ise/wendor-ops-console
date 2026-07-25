import { Controller, Get, Query, Req } from '@nestjs/common';
import { OperationsWorkforceService } from './operations-workforce.service';
import { DateRangeQueryDto } from '../../common/dto/date-range.dto';
import { OrgAttendanceQueryDto } from '../../common/dto/org-attendance-query.dto';
import { AttendanceMetricsQueryDto } from '../../common/dto/attendance-metrics-query.dto';
import { FleetDashboardQueryDto } from '../../common/dto/fleet-dashboard-query.dto';

@Controller('analytics/operations-workforce')
export class OperationsWorkforceController {
  constructor(private readonly service: OperationsWorkforceService) {}

  @Get('refill-operations')
  refillOperations(@Req() req: any, @Query() query: DateRangeQueryDto) {
    return this.service.getRefillOperations(req.orgId, query);
  }

  @Get('attendance-analytics')
  attendanceAnalytics(@Req() req: any, @Query() query: AttendanceMetricsQueryDto) {
    return this.service.getAttendanceGrid(req.orgId, query);
  }

  @Get('org-attendance')
  orgAttendance(@Req() req: any, @Query() query: OrgAttendanceQueryDto) {
    return this.service.getOrgAttendanceDiscipline(req.orgId, query);
  }

  @Get('attendance-metrics')
  attendanceMetrics(@Req() req: any, @Query() query: AttendanceMetricsQueryDto) {
    return this.service.getAttendanceMetrics(req.orgId, query);
  }

  @Get('clusters')
  clusters(@Req() req: any) {
    return this.service.listClusters(req.orgId);
  }

  @Get('fleet-dashboard')
  fleetDashboard(@Req() req: any, @Query() query: FleetDashboardQueryDto) {
    return this.service.getFleetDashboard(req.orgId, query);
  }
}