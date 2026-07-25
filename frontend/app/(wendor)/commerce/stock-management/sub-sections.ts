export interface StockSubSection {
  slug: string;
  label: string;
  prdRef: string;
  description: string;
  columns: string[];
  live: boolean;
}

export const STOCK_SUB_SECTIONS: StockSubSection[] = [
  {
    slug: 'stock-locations',
    label: 'Stock Locations',
    prdRef: '2.2.2.2',
    description: 'Warehouses, vehicles, and machine storage locations.',
    columns: ['Location Name', 'Type', 'Address', 'Phone', 'Manager', 'Actions'],
    live: true,
  },
  {
    slug: 'items-in-stock',
    label: 'Items in Stock',
    prdRef: '2.2.2.3',
    description: 'All products currently available across inventory.',
    columns: [
      'Product Name',
      'Brand',
      'Barcode',
      'Stock Location',
      'Stock in Hand',
      'UOM',
      'Product Price',
      'Warehouse Price',
      'Actions',
    ],
    live: true,
  },
  {
    slug: 'vendors',
    label: 'Vendors',
    prdRef: '2.2.2.4',
    description: 'Supplier records for procurement.',
    columns: ['Vendor Name', 'Primary Contact', 'GSTIN', 'Address', 'Created Date', 'Actions'],
    live: true,
  },
  {
    slug: 'purchase-orders',
    label: 'Purchase Orders',
    prdRef: '2.2.2.5',
    description: 'Procurement requests and their approval lifecycle.',
    columns: [
      'Order ID',
      'Vendor',
      'Stock Location',
      'Total Cost',
      'Generation Type',
      'Created By',
      'Approved By',
      'Received By',
      'Status',
    ],
    live: true,
  },
  {
    slug: 'return-orders',
    label: 'Return Orders',
    prdRef: '2.2.2.6',
    description: 'Inventory returned from machines.',
    columns: ['Return ID', 'Machine', 'Stock Location', 'Assigned To', 'Executed By', 'Created At', 'Status'],
    live: true,
  },
  {
    slug: 'stock-transfers',
    label: 'Stock Transfers',
    prdRef: '2.2.2.7',
    description: 'Inventory moved between stock locations.',
    columns: [
      'Transfer ID',
      'Source Location',
      'Destination Location',
      'Status',
      'Amount',
      'Requested Date',
      'Sent Date',
      'Received Date',
    ],
    live: true,
  },
  {
    slug: 'stock-audits',
    label: 'Stock Audits',
    prdRef: '2.2.2.8',
    description: 'Physical inventory verification and discrepancy detection.',
    columns: ['Audit ID', 'Date', 'Stock Location', 'Reason', 'Total Amount', 'Stock Change'],
    live: true,
  },
  {
    slug: 'day-end-stock',
    label: 'Day End Stock',
    prdRef: '2.2.2.9',
    description: 'Daily inventory snapshots for historical tracking.',
    columns: ['Date', 'Stock Location', 'Machine', 'Product', 'Closing Stock'],
    live: true,
  },
  {
    slug: 'stock-location-ledger',
    label: 'Stock Location Ledger',
    prdRef: '2.2.2.10',
    description: 'Complete audit trail of every inventory movement.',
    columns: [
      'Date & Time',
      'Movement Type',
      'Source Module',
      'Reference Number',
      'Stock Location',
      'Product',
      'Previous Quantity',
      'Stock In',
      'Stock Out',
      'Balance',
    ],
    live: true,
  },
];
