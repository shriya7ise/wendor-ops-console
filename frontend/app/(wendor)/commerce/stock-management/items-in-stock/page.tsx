'use client';

import { GenericListPage } from '@/app/components/generic/GenericListPage';
import { fetchItemsInStockDetail, fetchItemsInStockFilters, fetchItemsInStockList } from '@/lib/api';
import { FIELDS } from './fields';

export default function Page() {
  return (
    <GenericListPage
      breadcrumbHref="/commerce/stock-management"
      breadcrumbLabel="Stock Management"
      title="Items in Stock Locations"
      prdRef="2.2.2.3"
      description="All products currently available across inventory, with pricing and location allocation."
      fields={FIELDS}
      searchPlaceholder="Search Items in Stock Locations..."
      titleField="productName"
      fetchList={fetchItemsInStockList}
      fetchFilters={fetchItemsInStockFilters}
      fetchDetail={fetchItemsInStockDetail}
    />
  );
}
