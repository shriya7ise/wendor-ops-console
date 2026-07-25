import { StockItem } from './interfaces/items-in-stock.interface';

// Deterministic mock dataset for PRD 2.2.2.3 — Items in Stock Locations.
export const MOCK_STOCK_ITEM: StockItem[] = [
  {
    "id": "ITM1000",
    "productName": "Lays Classic 52g",
    "brand": "Nestle",
    "barcode": "895807058020",
    "stockLocation": "North Delhi Warehouse",
    "stockInHand": 76,
    "uom": "Case",
    "productPrice": 107.05,
    "warehousePrice": 77.08
  },
  {
    "id": "ITM1001",
    "productName": "Bisleri 500ml",
    "brand": "Nestle",
    "barcode": "899986476689",
    "stockLocation": "North Delhi Warehouse",
    "stockInHand": 212,
    "uom": "Box",
    "productPrice": 91.95,
    "warehousePrice": 66.2
  },
  {
    "id": "ITM1002",
    "productName": "Oreo 50g",
    "brand": "ITC",
    "barcode": "898451179612",
    "stockLocation": "VM-3125",
    "stockInHand": 174,
    "uom": "Case",
    "productPrice": 102.72,
    "warehousePrice": 73.96
  },
  {
    "id": "ITM1003",
    "productName": "Bisleri 500ml",
    "brand": "PepsiCo",
    "barcode": "891707188226",
    "stockLocation": "VM-1042",
    "stockInHand": 12,
    "uom": "Box",
    "productPrice": 35.83,
    "warehousePrice": 25.8
  },
  {
    "id": "ITM1004",
    "productName": "Bisleri 500ml",
    "brand": "PepsiCo",
    "barcode": "899445426908",
    "stockLocation": "VM-1021",
    "stockInHand": 125,
    "uom": "Case",
    "productPrice": 54.2,
    "warehousePrice": 39.02
  },
  {
    "id": "ITM1005",
    "productName": "Britannia Good Day",
    "brand": "Nestle",
    "barcode": "895376086419",
    "stockLocation": "Bangalore East Warehouse",
    "stockInHand": 187,
    "uom": "Pcs",
    "productPrice": 67.9,
    "warehousePrice": 48.89
  },
  {
    "id": "ITM1006",
    "productName": "Coca-Cola 250ml",
    "brand": "Bisleri",
    "barcode": "899544596905",
    "stockLocation": "Pune Hinjewadi Warehouse",
    "stockInHand": 218,
    "uom": "Box",
    "productPrice": 25.14,
    "warehousePrice": 18.1
  },
  {
    "id": "ITM1007",
    "productName": "KitKat 4-finger",
    "brand": "PepsiCo",
    "barcode": "892085887504",
    "stockLocation": "Gurgaon Warehouse",
    "stockInHand": 57,
    "uom": "Case",
    "productPrice": 46.75,
    "warehousePrice": 33.66
  },
  {
    "id": "ITM1008",
    "productName": "Britannia Good Day",
    "brand": "PepsiCo",
    "barcode": "899765408505",
    "stockLocation": "VM-1042",
    "stockInHand": 9,
    "uom": "Pcs",
    "productPrice": 109.98,
    "warehousePrice": 79.19
  },
  {
    "id": "ITM1009",
    "productName": "Britannia Good Day",
    "brand": "PepsiCo",
    "barcode": "891778616307",
    "stockLocation": "VM-2007",
    "stockInHand": 17,
    "uom": "Box",
    "productPrice": 22.16,
    "warehousePrice": 15.96
  },
  {
    "id": "ITM1010",
    "productName": "Real Juice 200ml",
    "brand": "Bisleri",
    "barcode": "897925473106",
    "stockLocation": "VM-3010",
    "stockInHand": 179,
    "uom": "Pcs",
    "productPrice": 42.71,
    "warehousePrice": 30.75
  },
  {
    "id": "ITM1011",
    "productName": "Sprite 250ml",
    "brand": "Britannia",
    "barcode": "896763471921",
    "stockLocation": "VM-1021",
    "stockInHand": 48,
    "uom": "Box",
    "productPrice": 50.85,
    "warehousePrice": 36.61
  },
  {
    "id": "ITM1012",
    "productName": "Real Juice 200ml",
    "brand": "Nestle",
    "barcode": "894779998019",
    "stockLocation": "VM-3125",
    "stockInHand": 212,
    "uom": "Box",
    "productPrice": 79.98,
    "warehousePrice": 57.59
  },
  {
    "id": "ITM1013",
    "productName": "Real Juice 200ml",
    "brand": "ITC",
    "barcode": "893329213058",
    "stockLocation": "VM-1042",
    "stockInHand": 27,
    "uom": "Case",
    "productPrice": 37.96,
    "warehousePrice": 27.33
  },
  {
    "id": "ITM1014",
    "productName": "Britannia Good Day",
    "brand": "Britannia",
    "barcode": "896746759567",
    "stockLocation": "VM-2088",
    "stockInHand": 201,
    "uom": "Box",
    "productPrice": 115.57,
    "warehousePrice": 83.21
  },
  {
    "id": "ITM1015",
    "productName": "KitKat 4-finger",
    "brand": "Coca-Cola",
    "barcode": "897211415583",
    "stockLocation": "North Delhi Warehouse",
    "stockInHand": 219,
    "uom": "Pcs",
    "productPrice": 28.06,
    "warehousePrice": 20.2
  },
  {
    "id": "ITM1016",
    "productName": "Oreo 50g",
    "brand": "Bisleri",
    "barcode": "892111886242",
    "stockLocation": "Pune Hinjewadi Warehouse",
    "stockInHand": 236,
    "uom": "Pcs",
    "productPrice": 23.77,
    "warehousePrice": 17.11
  },
  {
    "id": "ITM1017",
    "productName": "Britannia Good Day",
    "brand": "Bisleri",
    "barcode": "893565254425",
    "stockLocation": "Gurgaon Warehouse",
    "stockInHand": 136,
    "uom": "Case",
    "productPrice": 56.36,
    "warehousePrice": 40.58
  },
  {
    "id": "ITM1018",
    "productName": "Lays Classic 52g",
    "brand": "ITC",
    "barcode": "893135316248",
    "stockLocation": "Pune Hinjewadi Warehouse",
    "stockInHand": 214,
    "uom": "Pcs",
    "productPrice": 55.03,
    "warehousePrice": 39.62
  },
  {
    "id": "ITM1019",
    "productName": "Oreo 50g",
    "brand": "PepsiCo",
    "barcode": "896490891219",
    "stockLocation": "North Delhi Warehouse",
    "stockInHand": 20,
    "uom": "Case",
    "productPrice": 52.46,
    "warehousePrice": 37.77
  },
  {
    "id": "ITM1020",
    "productName": "Coca-Cola 250ml",
    "brand": "PepsiCo",
    "barcode": "893117041249",
    "stockLocation": "VM-3125",
    "stockInHand": 43,
    "uom": "Box",
    "productPrice": 48.31,
    "warehousePrice": 34.78
  },
  {
    "id": "ITM1021",
    "productName": "Bisleri 500ml",
    "brand": "Britannia",
    "barcode": "892220040834",
    "stockLocation": "VM-1021",
    "stockInHand": 72,
    "uom": "Pcs",
    "productPrice": 48.71,
    "warehousePrice": 35.07
  },
  {
    "id": "ITM1022",
    "productName": "Coca-Cola 250ml",
    "brand": "Britannia",
    "barcode": "891169493370",
    "stockLocation": "VM-2088",
    "stockInHand": 219,
    "uom": "Box",
    "productPrice": 110.14,
    "warehousePrice": 79.3
  },
  {
    "id": "ITM1023",
    "productName": "Oreo 50g",
    "brand": "ITC",
    "barcode": "895819393549",
    "stockLocation": "VM-3125",
    "stockInHand": 5,
    "uom": "Pcs",
    "productPrice": 74.16,
    "warehousePrice": 53.4
  },
  {
    "id": "ITM1024",
    "productName": "KitKat 4-finger",
    "brand": "Nestle",
    "barcode": "895268197962",
    "stockLocation": "Gurgaon Warehouse",
    "stockInHand": 62,
    "uom": "Pcs",
    "productPrice": 32.57,
    "warehousePrice": 23.45
  },
  {
    "id": "ITM1025",
    "productName": "Bisleri 500ml",
    "brand": "PepsiCo",
    "barcode": "898285511489",
    "stockLocation": "VM-2088",
    "stockInHand": 89,
    "uom": "Box",
    "productPrice": 63.9,
    "warehousePrice": 46.01
  },
  {
    "id": "ITM1026",
    "productName": "Lays Classic 52g",
    "brand": "Bisleri",
    "barcode": "894581599971",
    "stockLocation": "VM-2088",
    "stockInHand": 108,
    "uom": "Pcs",
    "productPrice": 54.01,
    "warehousePrice": 38.89
  },
  {
    "id": "ITM1027",
    "productName": "Britannia Good Day",
    "brand": "Bisleri",
    "barcode": "893073600389",
    "stockLocation": "North Delhi Warehouse",
    "stockInHand": 180,
    "uom": "Pcs",
    "productPrice": 96.1,
    "warehousePrice": 69.19
  },
  {
    "id": "ITM1028",
    "productName": "Coca-Cola 250ml",
    "brand": "PepsiCo",
    "barcode": "892643432571",
    "stockLocation": "North Delhi Warehouse",
    "stockInHand": 75,
    "uom": "Box",
    "productPrice": 49.82,
    "warehousePrice": 35.87
  },
  {
    "id": "ITM1029",
    "productName": "Lays Classic 52g",
    "brand": "ITC",
    "barcode": "894570668681",
    "stockLocation": "VM-3010",
    "stockInHand": 223,
    "uom": "Box",
    "productPrice": 113.58,
    "warehousePrice": 81.78
  },
  {
    "id": "ITM1030",
    "productName": "Oreo 50g",
    "brand": "Coca-Cola",
    "barcode": "899639407969",
    "stockLocation": "Gurgaon Warehouse",
    "stockInHand": 133,
    "uom": "Pcs",
    "productPrice": 34.33,
    "warehousePrice": 24.72
  },
  {
    "id": "ITM1031",
    "productName": "Britannia Good Day",
    "brand": "Coca-Cola",
    "barcode": "895744316799",
    "stockLocation": "VM-3125",
    "stockInHand": 86,
    "uom": "Pcs",
    "productPrice": 25.67,
    "warehousePrice": 18.48
  }
];

export const STOCK_ITEM_BRAND: string[] = ["Bisleri","Britannia","Coca-Cola","ITC","Nestle","PepsiCo"];
export const STOCK_ITEM_STOCKLOCATION: string[] = ["Bangalore East Warehouse","Gurgaon Warehouse","North Delhi Warehouse","Pune Hinjewadi Warehouse","VM-1021","VM-1042","VM-2007","VM-2088","VM-3010","VM-3125"];
