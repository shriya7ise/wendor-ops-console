'use client';

import { GenericListPage } from '@/app/components/generic/GenericListPage';
import { fetchDayEndStockDetail, fetchDayEndStockFilters, fetchDayEndStockList } from '@/lib/api';
import { FIELDS } from './fields';

export default function Page() {
  return (
    <GenericListPage
      breadcrumbHref="/commerce/stock-management"
      breadcrumbLabel="Stock Management"
      title="Day End Stock"
      prdRef="2.2.2.9"
      description="Daily inventory snapshots for historical tracking."
      fields={FIELDS}
      searchPlaceholder="Search Day End Stock..."
      fetchList={fetchDayEndStockList}
      fetchFilters={fetchDayEndStockFilters}
      fetchDetail={fetchDayEndStockDetail}
    />
  );
}
