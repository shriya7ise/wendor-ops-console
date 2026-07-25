'use client';

import { GenericListPage } from '@/app/components/generic/GenericListPage';
import { fetchReturnOrdersDetail, fetchReturnOrdersFilters, fetchReturnOrdersList } from '@/lib/api';
import { FIELDS, STATUS_TONE } from './fields';

export default function Page() {
  return (
    <GenericListPage
      breadcrumbHref="/commerce/stock-management"
      breadcrumbLabel="Stock Management"
      title="Return Orders"
      prdRef="2.2.2.6"
      description="Inventory returned from machines back to stock locations."
      fields={FIELDS}
      statusTone={STATUS_TONE}
      hasStatus
      searchPlaceholder="Search Return Orders..."
      fetchList={fetchReturnOrdersList}
      fetchFilters={fetchReturnOrdersFilters}
      fetchDetail={fetchReturnOrdersDetail}
    />
  );
}
