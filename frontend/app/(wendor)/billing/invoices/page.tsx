'use client';

import { GenericListPage } from '@/app/components/generic/GenericListPage';
import { fetchInvoicesDetail, fetchInvoicesFilters, fetchInvoicesList } from '@/lib/api';
import { FIELDS, STATUS_TONE } from './fields';

export default function Page() {
  return (
    <GenericListPage
      breadcrumbHref="/billing/invoices"
      breadcrumbLabel="Accounts"
      title="Invoices"
      prdRef="3.1.1"
      description="All generated invoices for subscriptions and services."
      fields={FIELDS}
      statusTone={STATUS_TONE}
      hasStatus
      searchPlaceholder="Search Invoices..."
      fetchList={fetchInvoicesList}
      fetchFilters={fetchInvoicesFilters}
      fetchDetail={fetchInvoicesDetail}
    />
  );
}
