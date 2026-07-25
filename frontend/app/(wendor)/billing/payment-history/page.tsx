'use client';

import { GenericListPage } from '@/app/components/generic/GenericListPage';
import { fetchPaymentHistoryDetail, fetchPaymentHistoryFilters, fetchPaymentHistoryList } from '@/lib/api';
import { FIELDS, STATUS_TONE } from './fields';

export default function Page() {
  return (
    <GenericListPage
      breadcrumbHref="/billing/invoices"
      breadcrumbLabel="Accounts"
      title="Payment History"
      prdRef="3.1.2"
      description="Complete history of successful, failed, and refunded payments."
      fields={FIELDS}
      statusTone={STATUS_TONE}
      hasStatus
      searchPlaceholder="Search Payment History..."
      fetchList={fetchPaymentHistoryList}
      fetchFilters={fetchPaymentHistoryFilters}
      fetchDetail={fetchPaymentHistoryDetail}
    />
  );
}
