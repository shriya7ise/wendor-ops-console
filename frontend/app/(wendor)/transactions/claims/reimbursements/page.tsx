'use client';

import { GenericListPage } from '@/app/components/generic/GenericListPage';
import { fetchReimbursementsDetail, fetchReimbursementsFilters, fetchReimbursementsList } from '@/lib/api';
import { FIELDS, STATUS_TONE } from './fields';

export default function Page() {
  return (
    <GenericListPage
      breadcrumbHref="/transactions/claims/expenses"
      breadcrumbLabel="Claims Desk"
      title="Reimbursements"
      prdRef="2.1.2.2"
      description="Reimbursement requests tracked after claim approval."
      fields={FIELDS}
      statusTone={STATUS_TONE}
      hasStatus
      searchPlaceholder="Search Reimbursements..."
      titleField="employee"
      fetchList={fetchReimbursementsList}
      fetchFilters={fetchReimbursementsFilters}
      fetchDetail={fetchReimbursementsDetail}
    />
  );
}
