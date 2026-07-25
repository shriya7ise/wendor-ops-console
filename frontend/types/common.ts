export interface ListMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BaseQuery {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
  [key: string]: string | number | undefined;
}
