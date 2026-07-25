import { CLUSTERS, MACHINES, mulberry32, pick } from '../../common/mock.util';
import { Product, ProductStatus } from './interfaces/product.interface';

const BRANDS = ['Coca-Cola', 'PepsiCo', 'Britannia', 'Nestle', 'ITC', 'Parle'];
const CATEGORIES = ['Beverages', 'Snacks', 'Biscuits', 'Confectionery', 'Water'];
const UOMS = ['pcs', 'ml', 'g'];
const STATUSES: ProductStatus[] = ['Active', 'Active', 'Active', 'Inactive', 'Out of Stock'];

const PRODUCT_NAMES = [
  'Coca-Cola 250ml',
  'Sprite 250ml',
  'Lays Classic 52g',
  'Kurkure Masala Munch',
  'Britannia Good Day',
  'Britannia Marie Gold',
  'KitKat 4-finger',
  'Munch',
  'Real Juice 200ml',
  'Bisleri 500ml',
  'Aquafina 500ml',
  'Parle-G 100g',
];

function generateProducts(count: number): Product[] {
  const rng = mulberry32(404);
  const list: Product[] = [];

  for (let i = 0; i < count; i++) {
    list.push({
      id: `PRD${String(900000 + i)}`,
      name: pick(rng, PRODUCT_NAMES),
      brand: pick(rng, BRANDS),
      category: pick(rng, CATEGORIES),
      cluster: pick(rng, CLUSTERS),
      machine: pick(rng, MACHINES),
      price: Math.round((10 + rng() * 90) * 100) / 100,
      uom: pick(rng, UOMS),
      status: pick(rng, STATUSES),
    });
  }

  return list;
}

// Mutable on purpose: PATCH /commerce/products/:id/status writes back to
// this array so the "Actions -> Manage product" flow has somewhere to land.
export const MOCK_PRODUCTS: Product[] = generateProducts(90);
export const BRAND_OPTIONS = BRANDS;
export const CATEGORY_OPTIONS = CATEGORIES;
export const CLUSTER_OPTIONS = CLUSTERS;
export const MACHINE_OPTIONS = MACHINES;
export const STATUS_OPTIONS: ProductStatus[] = ['Active', 'Inactive', 'Out of Stock'];
