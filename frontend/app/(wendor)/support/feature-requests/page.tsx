'use client';

import { GenericListPage } from '@/app/components/generic/GenericListPage';
import { fetchFeatureRequestsDetail, fetchFeatureRequestsFilters, fetchFeatureRequestsList } from '@/lib/api';
import { FIELDS, STATUS_TONE } from './fields';

export default function Page() {
  return (
    <GenericListPage
      breadcrumbHref="/support/service-tickets"
      breadcrumbLabel="Help Desk"
      title="Feature Requests"
      prdRef="3.2.2"
      description="Read-only tracking of feature enhancement requests submitted by users."
      fields={FIELDS}
      statusTone={STATUS_TONE}
      hasStatus
      searchPlaceholder="Search Feature Requests..."
      titleField="subject"
      fetchList={fetchFeatureRequestsList}
      fetchFilters={fetchFeatureRequestsFilters}
      fetchDetail={fetchFeatureRequestsDetail}
    />
  );
}
