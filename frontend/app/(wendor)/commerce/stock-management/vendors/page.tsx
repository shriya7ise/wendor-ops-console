'use client';

import { GenericListPage } from '@/app/components/generic/GenericListPage';
import { fetchVendorsDetail, fetchVendorsFilters, fetchVendorsList } from '@/lib/api';
import { FIELDS } from './fields';

export default function Page() {
  return (
    <GenericListPage
      breadcrumbHref="/commerce/stock-management"
      breadcrumbLabel="Stock Management"
      title="Vendors"
      prdRef="2.2.2.4"
      description="Supplier records maintained for procurement."
      fields={FIELDS}
      searchPlaceholder="Search Vendors..."
      titleField="vendorName"
      fetchList={fetchVendorsList}
      fetchFilters={fetchVendorsFilters}
      fetchDetail={fetchVendorsDetail}
    />
  );
}
