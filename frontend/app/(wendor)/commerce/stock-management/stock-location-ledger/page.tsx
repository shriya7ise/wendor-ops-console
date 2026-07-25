'use client';

import { GenericListPage } from '@/app/components/generic/GenericListPage';
import { fetchStockLocationLedgerDetail, fetchStockLocationLedgerFilters, fetchStockLocationLedgerList } from '@/lib/api';
import { FIELDS } from './fields';

export default function Page() {
  return (
    <GenericListPage
      breadcrumbHref="/commerce/stock-management"
      breadcrumbLabel="Stock Management"
      title="Stock Location Ledger"
      prdRef="2.2.2.10"
      description="Complete audit trail of every inventory movement."
      fields={FIELDS}
      searchPlaceholder="Search Stock Location Ledger..."
      fetchList={fetchStockLocationLedgerList}
      fetchFilters={fetchStockLocationLedgerFilters}
      fetchDetail={fetchStockLocationLedgerDetail}
    />
  );
}
