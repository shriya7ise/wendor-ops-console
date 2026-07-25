import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { QueryProductsDto } from './dto/query-products.dto';
import { UpdateProductStatusDto } from './dto/update-product-status.dto';
import { ProductsService } from './products.service';

// PRD 2.2.1 — Products
@Controller('commerce/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // GET /api/commerce/products?search=&brand=&category=&cluster=&machine=&status=&page=&limit=
  @Get()
  findAll(@Query() query: QueryProductsDto) {
    return this.productsService.findAll(query);
  }

  // GET /api/commerce/products/filters — dropdown options
  @Get('filters')
  getFilters() {
    return this.productsService.getFilterOptions();
  }

  // GET /api/commerce/products/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  // PATCH /api/commerce/products/:id/status — the "Actions" column
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateProductStatusDto) {
    return this.productsService.updateStatus(id, dto);
  }
}
