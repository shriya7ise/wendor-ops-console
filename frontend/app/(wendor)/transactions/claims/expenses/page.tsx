'use client';

import { GenericListPage } from '@/app/components/generic/GenericListPage';
import { fetchExpensesDetail, fetchExpensesFilters, fetchExpensesList } from '@/lib/api';
import { FIELDS, STATUS_TONE } from './fields';

export default function Page() {
  return (
    <GenericListPage
      breadcrumbHref="/transactions/claims/expenses"
      breadcrumbLabel="Claims Desk"
      title="Expenses"
      prdRef="2.1.2.1"
      description="Expense claims submitted by employees or vendors."
      fields={FIELDS}
      statusTone={STATUS_TONE}
      hasStatus
      searchPlaceholder="Search Expenses..."
      fetchList={fetchExpensesList}
      fetchFilters={fetchExpensesFilters}
      fetchDetail={fetchExpensesDetail}
    />
  );
}
