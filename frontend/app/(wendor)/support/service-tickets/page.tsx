'use client';

import { GenericListPage } from '@/app/components/generic/GenericListPage';
import { fetchServiceTicketsDetail, fetchServiceTicketsFilters, fetchServiceTicketsList } from '@/lib/api';
import { FIELDS, STATUS_TONE } from './fields';

export default function Page() {
  return (
    <GenericListPage
      breadcrumbHref="/support/service-tickets"
      breadcrumbLabel="Help Desk"
      title="Service Tickets"
      prdRef="3.2.1"
      description="Operational issues, machine faults, maintenance requests, and internal service activities."
      fields={FIELDS}
      statusTone={STATUS_TONE}
      hasStatus
      searchPlaceholder="Search Service Tickets..."
      titleField="subject"
      fetchList={fetchServiceTicketsList}
      fetchFilters={fetchServiceTicketsFilters}
      fetchDetail={fetchServiceTicketsDetail}
    />
  );
}
