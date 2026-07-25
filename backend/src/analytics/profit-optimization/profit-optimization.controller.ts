import { Controller, Get, Query, Req } from '@nestjs/common';
import { ProfitOptimizationService } from './profit-optimization.service';
import { ProfitOptimizationQueryDto } from '../../common/dto/profit-optimization-query.dto';

@Controller('analytics/profit-optimization')
export class ProfitOptimizationController {
  constructor(private readonly service: ProfitOptimizationService) {}

  @Get()
  get(@Req() req: any, @Query() query: ProfitOptimizationQueryDto) {
    return this.service.getRecommendations(req.orgId, query);
  }
}
