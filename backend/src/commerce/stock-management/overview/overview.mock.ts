import { mulberry32, pick } from '../../../common/mock.util';

// Warehouse names deliberately mirror the vending "cluster" names elsewhere
// in the app, with " Warehouse" appended — same physical regions, so the
// numbers stay sensible if you cross-check against Stock Locations later.
export const WAREHOUSES = [
  'North Delhi Warehouse',
  'Gurgaon Warehouse',
  'Bangalore East Warehouse',
  'Pune Hinjewadi Warehouse',
];

const PRODUCTS = [
  'Coca-Cola 250ml',
  'Lays Classic 52g',
  'Britannia Good Day',
  'Real Juice 200ml',
  'KitKat 4-finger',
  'Bisleri 500ml',
];

function buildOverview() {
  const rng = mulberry32(505);

  const warehouseInventory = {
    totalWarehouses: WAREHOUSES.length,
    uniqueProducts: 128,
    totalStockUnits: 42650,
    totalStockValue: 3182400,
  };

  const lowStock = WAREHOUSES.map((warehouse) => {
    const totalProducts = 20 + Math.floor(rng() * 40);
    return {
      warehouse,
      totalProducts,
      lowStockCount: Math.floor(rng() * 12),
    };
  });

  const belowReorder = Array.from({ length: 6 }, () => ({
    product: pick(rng, PRODUCTS),
    warehouse: pick(rng, WAREHOUSES),
    unitsLeft: Math.floor(rng() * 15),
    reorderPoint: 20 + Math.floor(rng() * 20),
  }));

  const stockTransfers = {
    totalTransfers: 64,
    pending: 9,
    inTransit: 14,
    completed: 41,
    transferValue: 486200,
  };

  const purchaseOrders = {
    totalPOs: 37,
    totalPOValue: 1245800,
    openPOs: 11,
    averagePOValue: 33670,
  };

  return { warehouseInventory, lowStock, belowReorder, stockTransfers, purchaseOrders };
}

export const OVERVIEW_MOCK = buildOverview();
