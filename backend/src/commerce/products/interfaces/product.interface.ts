export type ProductStatus = 'Active' | 'Inactive' | 'Out of Stock';

export interface Product {
  id: string; // Product ID
  name: string; // Product Name
  brand: string;
  category: string;
  cluster: string;
  machine: string;
  price: number;
  uom: string; // Unit of Measure e.g. "pcs", "ml", "g"
  status: ProductStatus;
}
