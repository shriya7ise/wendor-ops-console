import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryFeatureRequestDto } from './dto/query-feature-requests.dto';
import { FeatureRequestsService } from './feature-requests.service';

// PRD 3.2.2 — Feature Requests
@Controller('support/feature-requests')
export class FeatureRequestsController {
  constructor(private readonly service: FeatureRequestsService) {}

  @Get()
  findAll(@Query() query: QueryFeatureRequestDto) {
    return this.service.findAll(query);
  }

  @Get('filters')
  getFilters() {
    return this.service.getFilterOptions();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
