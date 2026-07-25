import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryProductsDto } from './dto/query-products.dto';
import { UpdateProductStatusDto } from './dto/update-product-status.dto';
import { Product } from './interfaces/product.interface';
import {
  BRAND_OPTIONS,
  CATEGORY_OPTIONS,
  CLUSTER_OPTIONS,
  MACHINE_OPTIONS,
  MOCK_PRODUCTS,
  STATUS_OPTIONS,
} from './products.mock';

// NOTE: swap-in point for a real data layer — see orders.service.ts for
// the same pattern. Baseline: in-memory mock array from products.mock.ts.
@Injectable()
export class ProductsService {
  private readonly products: Product[] = MOCK_PRODUCTS;

  findAll(query: QueryProductsDto) {
    let results = this.products;

    if (query.search) {
      const term = query.search.toLowerCase();
      results = results.filter(
        (p) =>
          p.id.toLowerCase().includes(term) ||
          p.name.toLowerCase().includes(term),
      );
    }
    if (query.brand) results = results.filter((p) => p.brand === query.brand);
    if (query.category) results = results.filter((p) => p.category === query.category);
    if (query.cluster) results = results.filter((p) => p.cluster === query.cluster);
    if (query.machine) results = results.filter((p) => p.machine === query.machine);
    if (query.status) results = results.filter((p) => p.status === query.status);

    const total = results.length;
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const start = (page - 1) * limit;
    const paged = results.slice(start, start + limit);

    const summary = {
      totalProducts: total,
      activeCount: results.filter((p) => p.status === 'Active').length,
      inactiveCount: results.filter((p) => p.status === 'Inactive').length,
      outOfStockCount: results.filter((p) => p.status === 'Out of Stock').length,
    };

    return {
      data: paged,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      summary,
    };
  }

  findOne(id: string): Product {
    const found = this.products.find((p) => p.id === id);
    if (!found) throw new NotFoundException(`Product ${id} not found`);
    return found;
  }

  // Powers the PRD "Actions -> Manage product" column.
  updateStatus(id: string, dto: UpdateProductStatusDto): Product {
    const product = this.findOne(id);
    product.status = dto.status;
    return product;
  }

  getFilterOptions() {
    return {
      brands: BRAND_OPTIONS,
      categories: CATEGORY_OPTIONS,
      clusters: CLUSTER_OPTIONS,
      machines: MACHINE_OPTIONS,
      statuses: STATUS_OPTIONS,
    };
  }
}
