export type FieldKind = 'string' | 'number' | 'currency' | 'date' | 'datetime' | 'status' | 'signed';

export interface FieldDef {
  key: string;
  label: string;
  kind: FieldKind;
  mono?: boolean;
  /** Rendered as a filter dropdown in the FilterBar when true. */
  filter?: boolean;
}

export interface GenericListMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GenericListResponse<T> {
  data: T[];
  meta: GenericListMeta;
  summary: Record<string, string | number>;
}

export interface GenericFilterOptions {
  statuses?: string[];
  [key: string]: string[] | undefined;
}

export interface GenericQuery {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
  [key: string]: string | number | undefined;
}
