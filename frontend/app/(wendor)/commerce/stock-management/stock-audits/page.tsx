'use client';

import { GenericListPage } from '@/app/components/generic/GenericListPage';
import { fetchStockAuditsDetail, fetchStockAuditsFilters, fetchStockAuditsList } from '@/lib/api';
import { FIELDS } from './fields';

export default function Page() {
  return (
    <GenericListPage
      breadcrumbHref="/commerce/stock-management"
      breadcrumbLabel="Stock Management"
      title="Stock Audits"
      prdRef="2.2.2.8"
      description="Physical inventory verification and discrepancy detection."
      fields={FIELDS}
      searchPlaceholder="Search Stock Audits..."
      fetchList={fetchStockAuditsList}
      fetchFilters={fetchStockAuditsFilters}
      fetchDetail={fetchStockAuditsDetail}
    />
  );
}
