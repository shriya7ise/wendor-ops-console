'use client';

import { GenericListPage } from '@/app/components/generic/GenericListPage';
import { fetchCreditHistoryDetail, fetchCreditHistoryFilters, fetchCreditHistoryList } from '@/lib/api';
import { FIELDS } from './fields';

export default function Page() {
  return (
    <GenericListPage
      breadcrumbHref="/billing/invoices"
      breadcrumbLabel="Accounts"
      title="Credit History"
      prdRef="3.1.3"
      description="Ledger of all credit and debit transactions related to vending machines."
      fields={FIELDS}
      searchPlaceholder="Search Credit History..."
      titleField="machineName"
      fetchList={fetchCreditHistoryList}
      fetchFilters={fetchCreditHistoryFilters}
      fetchDetail={fetchCreditHistoryDetail}
    />
  );
}
