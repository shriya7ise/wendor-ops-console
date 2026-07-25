'use client';

import { GenericListPage } from '@/app/components/generic/GenericListPage';
import { fetchPurchaseOrdersDetail, fetchPurchaseOrdersFilters, fetchPurchaseOrdersList } from '@/lib/api';
import { FIELDS, STATUS_TONE } from './fields';

export default function Page() {
  return (
    <GenericListPage
      breadcrumbHref="/commerce/stock-management"
      breadcrumbLabel="Stock Management"
      title="Purchase Orders"
      prdRef="2.2.2.5"
      description="Procurement requests and their approval lifecycle."
      fields={FIELDS}
      statusTone={STATUS_TONE}
      hasStatus
      searchPlaceholder="Search Purchase Orders..."
      titleField="vendor"
      fetchList={fetchPurchaseOrdersList}
      fetchFilters={fetchPurchaseOrdersFilters}
      fetchDetail={fetchPurchaseOrdersDetail}
    />
  );
}
