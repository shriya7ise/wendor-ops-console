import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
  BulkAssignMachinesDto,
  CreateSettlementDto,
} from './dto/create-settlement.dto';
import { QuerySettlementsDto } from './dto/query-settlements.dto';
import { UpdateSettlementStatusDto } from './dto/update-settlement-status.dto';
import { SettlementsService } from './settlements.service';

// PRD 2.2.3 — Settlements
@Controller('commerce/settlements')
export class SettlementsController {
  constructor(private readonly settlementsService: SettlementsService) {}

  // GET /api/commerce/settlements?search=&gateway=&serviceProvider=&machine=&status=&page=&limit=
  @Get()
  findAll(@Query() query: QuerySettlementsDto) {
    return this.settlementsService.findAll(query);
  }

  // GET /api/commerce/settlements/filters — dropdown options
  @Get('filters')
  getFilters() {
    return this.settlementsService.getFilterOptions();
  }

  // GET /api/commerce/settlements/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.settlementsService.findOne(id);
  }

  // POST /api/commerce/settlements — the "Create Settlement" action
  @Post()
  create(@Body() dto: CreateSettlementDto) {
    return this.settlementsService.create(dto);
  }

  // POST /api/commerce/settlements/bulk-assign — the "Bulk Assign" action
  @Post('bulk-assign')
  bulkAssign(@Body() dto: BulkAssignMachinesDto) {
    return this.settlementsService.bulkAssign(dto);
  }

  // PATCH /api/commerce/settlements/:id/status — the "Actions" column
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateSettlementStatusDto) {
    return this.settlementsService.updateStatus(id, dto);
  }
}
