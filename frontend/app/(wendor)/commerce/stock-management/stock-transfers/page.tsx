'use client';

import { GenericListPage } from '@/app/components/generic/GenericListPage';
import { fetchStockTransfersDetail, fetchStockTransfersFilters, fetchStockTransfersList } from '@/lib/api';
import { FIELDS, STATUS_TONE } from './fields';

export default function Page() {
  return (
    <GenericListPage
      breadcrumbHref="/commerce/stock-management"
      breadcrumbLabel="Stock Management"
      title="Stock Transfers"
      prdRef="2.2.2.7"
      description="Inventory moved between stock locations to balance availability."
      fields={FIELDS}
      statusTone={STATUS_TONE}
      hasStatus
      searchPlaceholder="Search Stock Transfers..."
      fetchList={fetchStockTransfersList}
      fetchFilters={fetchStockTransfersFilters}
      fetchDetail={fetchStockTransfersDetail}
    />
  );
}
