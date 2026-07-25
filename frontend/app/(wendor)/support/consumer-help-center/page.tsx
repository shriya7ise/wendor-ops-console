'use client';

import { GenericListPage } from '@/app/components/generic/GenericListPage';
import { fetchConsumerHelpCenterDetail, fetchConsumerHelpCenterFilters, fetchConsumerHelpCenterList } from '@/lib/api';
import { FIELDS, STATUS_TONE } from './fields';

export default function Page() {
  return (
    <GenericListPage
      breadcrumbHref="/support/service-tickets"
      breadcrumbLabel="Help Desk"
      title="Consumer Help Center"
      prdRef="3.2.4"
      description="Consumer-facing issues such as wallet problems, payment issues, and account access — kept separate from operational Service Tickets."
      fields={FIELDS}
      statusTone={STATUS_TONE}
      hasStatus
      searchPlaceholder="Search Consumer Help Center..."
      titleField="subject"
      fetchList={fetchConsumerHelpCenterList}
      fetchFilters={fetchConsumerHelpCenterFilters}
      fetchDetail={fetchConsumerHelpCenterDetail}
    />
  );
}
