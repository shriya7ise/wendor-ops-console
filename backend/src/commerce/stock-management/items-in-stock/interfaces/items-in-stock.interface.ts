export interface StockItem {
  id: string;
  productName: string; // Product Name
  brand: string; // Brand
  barcode: string; // Barcode
  stockLocation: string; // Stock Location
  stockInHand: number; // Stock in Hand
  uom: string; // UOM
  productPrice: number; // Product Price
  warehousePrice: number; // Warehouse Price
}
