export interface WarehouseInventorySummary {
  totalWarehouses: number;
  uniqueProducts: number;
  totalStockUnits: number;
  totalStockValue: number;
}

export interface LowStockByWarehouse {
  warehouse: string;
  totalProducts: number;
  lowStockCount: number;
}

export interface BelowReorderPoint {
  product: string;
  warehouse: string;
  unitsLeft: number;
  reorderPoint: number;
}

export interface StockTransferSummary {
  totalTransfers: number;
  pending: number;
  inTransit: number;
  completed: number;
  transferValue: number;
}

export interface PurchaseOrderSummary {
  totalPOs: number;
  totalPOValue: number;
  openPOs: number;
  averagePOValue: number;
}

export interface StockOverview {
  warehouseInventory: WarehouseInventorySummary;
  lowStock: LowStockByWarehouse[];
  belowReorder: BelowReorderPoint[];
  stockTransfers: StockTransferSummary;
  purchaseOrders: PurchaseOrderSummary;
}
