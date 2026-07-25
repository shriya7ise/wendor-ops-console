export type StockLocationType = 'Warehouse' | 'Vehicle' | 'Machine';

export interface StockLocation {
  id: string;
  name: string; // Location Name
  type: StockLocationType;
  address: string;
  phone: string;
  manager: string;
}
