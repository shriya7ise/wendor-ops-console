import { BaseQuery, ListMeta } from './common';

export type ProductStatus = 'Active' | 'Inactive' | 'Out of Stock';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  cluster: string;
  machine: string;
  price: number;
  uom: string;
  status: ProductStatus;
}

export interface ProductListResponse {
  data: Product[];
  meta: ListMeta;
  summary: {
    totalProducts: number;
    activeCount: number;
    inactiveCount: number;
    outOfStockCount: number;
  };
}

export interface ProductFilterOptions {
  brands: string[];
  categories: string[];
  clusters: string[];
  machines: string[];
  statuses: ProductStatus[];
}

export interface ProductQuery extends BaseQuery {
  brand?: string;
  category?: string;
  cluster?: string;
  machine?: string;
}
