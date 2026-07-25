import { Controller, Get } from '@nestjs/common';
import { OverviewService } from './overview.service';

// PRD 2.2.2.1 — Overview
@Controller('commerce/stock-management/overview')
export class OverviewController {
  constructor(private readonly overviewService: OverviewService) {}

  @Get()
  get() {
    return this.overviewService.get();
  }
}
