import { BaseQuery, ListMeta } from './common';

export type StockLocationType = 'Warehouse' | 'Vehicle' | 'Machine';

export interface StockLocation {
  id: string;
  name: string;
  type: StockLocationType;
  address: string;
  phone: string;
  manager: string;
}

export interface StockLocationListResponse {
  data: StockLocation[];
  meta: ListMeta;
  summary: { totalLocations: number };
}

export interface StockLocationFilterOptions {
  types: StockLocationType[];
}

export interface StockLocationQuery extends BaseQuery {
  type?: string;
}
