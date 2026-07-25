import { FieldDef } from '@/app/components/generic/types';
import { PillTone } from '@/app/components/ui/StatusPill';

// PRD 2.2.2.3 — Items in Stock Locations
export const FIELDS: FieldDef[] = [
  { key: 'productName', label: 'Product Name', kind: 'string' },
  { key: 'brand', label: 'Brand', kind: 'string', filter: true },
  { key: 'barcode', label: 'Barcode', kind: 'string', mono: true },
  { key: 'stockLocation', label: 'Stock Location', kind: 'string', filter: true },
  { key: 'stockInHand', label: 'Stock in Hand', kind: 'number' },
  { key: 'uom', label: 'UOM', kind: 'string' },
  { key: 'productPrice', label: 'Product Price', kind: 'currency' },
  { key: 'warehousePrice', label: 'Warehouse Price', kind: 'currency' },
];
