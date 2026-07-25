import { Controller, Get, Query, Req } from '@nestjs/common';
import { EntityAnalysisService } from './entity-analysis.service';
import { ItemQueryDto, BrandQueryDto } from './dto/entity-query.dto';

@Controller('analytics/entity-analysis')
export class EntityAnalysisController {
  constructor(private readonly service: EntityAnalysisService) {}

  @Get('item/search')
  searchItems(@Req() req: any, @Query('q') q = '') {
    return this.service.searchItems(req.orgId, q);
  }

  @Get('item')
  itemAnalysis(@Req() req: any, @Query() query: ItemQueryDto) {
    return this.service.getItemAnalysis(req.orgId, query);
  }

  @Get('brand/search')
  searchBrands(@Req() req: any, @Query('q') q = '') {
    return this.service.searchBrands(req.orgId, q);
  }

  @Get('brand/warehouses')
  warehouses(@Req() req: any) {
    return this.service.listWarehouses(req.orgId);
  }

  @Get('brand')
  brandAnalysis(@Req() req: any, @Query() query: BrandQueryDto) {
    return this.service.getBrandAnalysis(req.orgId, query);
  }
}