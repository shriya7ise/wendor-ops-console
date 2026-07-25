import { Controller, Get, Query, Req } from '@nestjs/common';
import { SupplyChainService } from './supply-chain.service';
import { DateRangeQueryDto } from '../../common/dto/date-range.dto';
import { FailureAnalyticsQueryDto } from '../../common/dto/failure-analytics-query.dto';

@Controller('analytics/supply-chain')
export class SupplyChainController {
  constructor(private readonly service: SupplyChainService) {}

  @Get('org-procurement')
  orgProcurement(@Req() req: any, @Query() query: DateRangeQueryDto) {
    return this.service.getOrgProcurement(req.orgId, query);
  }

  @Get('vendors-dashboard')
  vendorsDashboard(@Req() req: any, @Query() query: DateRangeQueryDto) {
    return this.service.getVendorsDashboard(req.orgId, query);
  }

  @Get('inventory-risk')
  inventoryRisk(@Req() req: any, @Query() query: DateRangeQueryDto) {
    return this.service.getInventoryRisk(req.orgId, query);
  }

  @Get('failure-analytics')
  failureAnalytics(@Req() req: any, @Query() query: FailureAnalyticsQueryDto) {
    return this.service.getFailureAnalytics(req.orgId, query);
  }

  @Get('shipment-analytics')
  shipmentAnalytics(@Req() req: any, @Query() query: DateRangeQueryDto) {
    return this.service.getShipmentAnalytics(req.orgId, query);
  }
}