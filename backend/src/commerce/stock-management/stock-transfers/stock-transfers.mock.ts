import { StockTransfer } from './interfaces/stock-transfers.interface';

// Deterministic mock dataset for PRD 2.2.2.7 — Stock Transfers.
export const MOCK_STOCK_TRANSFER: StockTransfer[] = [
  {
    "id": "TRF4000",
    "sourceLocation": "Pune Hinjewadi Warehouse",
    "destinationLocation": "Bangalore East Warehouse",
    "status": "Sent",
    "amount": 14083.48,
    "requestedDate": "2026-07-19",
    "sentDate": "2026-07-19",
    "receivedDate": "—"
  },
  {
    "id": "TRF4001",
    "sourceLocation": "Gurgaon Warehouse",
    "destinationLocation": "Gurgaon Warehouse",
    "status": "Requested",
    "amount": 23139.87,
    "requestedDate": "2026-06-08",
    "sentDate": "—",
    "receivedDate": "—"
  },
  {
    "id": "TRF4002",
    "sourceLocation": "Pune Hinjewadi Warehouse",
    "destinationLocation": "Gurgaon Warehouse",
    "status": "Received",
    "amount": 7986.2,
    "requestedDate": "2026-07-21",
    "sentDate": "2026-07-21",
    "receivedDate": "2026-07-21"
  },
  {
    "id": "TRF4003",
    "sourceLocation": "Bangalore East Warehouse",
    "destinationLocation": "Bangalore East Warehouse",
    "status": "Cancelled",
    "amount": 55031.07,
    "requestedDate": "2026-07-07",
    "sentDate": "—",
    "receivedDate": "—"
  },
  {
    "id": "TRF4004",
    "sourceLocation": "Gurgaon Warehouse",
    "destinationLocation": "Gurgaon Warehouse",
    "status": "Received",
    "amount": 25017.29,
    "requestedDate": "2026-06-16",
    "sentDate": "2026-06-16",
    "receivedDate": "2026-06-16"
  },
  {
    "id": "TRF4005",
    "sourceLocation": "Pune Hinjewadi Warehouse",
    "destinationLocation": "Gurgaon Warehouse",
    "status": "Sent",
    "amount": 16161.78,
    "requestedDate": "2026-06-11",
    "sentDate": "2026-06-11",
    "receivedDate": "—"
  },
  {
    "id": "TRF4006",
    "sourceLocation": "Pune Hinjewadi Warehouse",
    "destinationLocation": "Gurgaon Warehouse",
    "status": "Sent",
    "amount": 40246.16,
    "requestedDate": "2026-06-09",
    "sentDate": "2026-06-09",
    "receivedDate": "—"
  },
  {
    "id": "TRF4007",
    "sourceLocation": "Pune Hinjewadi Warehouse",
    "destinationLocation": "Bangalore East Warehouse",
    "status": "Received",
    "amount": 35476.96,
    "requestedDate": "2026-07-12",
    "sentDate": "2026-07-12",
    "receivedDate": "2026-07-12"
  },
  {
    "id": "TRF4008",
    "sourceLocation": "Gurgaon Warehouse",
    "destinationLocation": "North Delhi Warehouse",
    "status": "Cancelled",
    "amount": 57779,
    "requestedDate": "2026-07-03",
    "sentDate": "—",
    "receivedDate": "—"
  },
  {
    "id": "TRF4009",
    "sourceLocation": "North Delhi Warehouse",
    "destinationLocation": "Pune Hinjewadi Warehouse",
    "status": "Sent",
    "amount": 7452.42,
    "requestedDate": "2026-06-23",
    "sentDate": "2026-06-23",
    "receivedDate": "—"
  },
  {
    "id": "TRF4010",
    "sourceLocation": "Pune Hinjewadi Warehouse",
    "destinationLocation": "North Delhi Warehouse",
    "status": "Requested",
    "amount": 46894.13,
    "requestedDate": "2026-06-27",
    "sentDate": "—",
    "receivedDate": "—"
  },
  {
    "id": "TRF4011",
    "sourceLocation": "Pune Hinjewadi Warehouse",
    "destinationLocation": "Bangalore East Warehouse",
    "status": "Received",
    "amount": 59013.45,
    "requestedDate": "2026-07-14",
    "sentDate": "2026-07-14",
    "receivedDate": "2026-07-14"
  },
  {
    "id": "TRF4012",
    "sourceLocation": "North Delhi Warehouse",
    "destinationLocation": "Pune Hinjewadi Warehouse",
    "status": "Sent",
    "amount": 16289.01,
    "requestedDate": "2026-07-09",
    "sentDate": "2026-07-09",
    "receivedDate": "—"
  },
  {
    "id": "TRF4013",
    "sourceLocation": "Pune Hinjewadi Warehouse",
    "destinationLocation": "Gurgaon Warehouse",
    "status": "Sent",
    "amount": 38695.56,
    "requestedDate": "2026-06-20",
    "sentDate": "2026-06-20",
    "receivedDate": "—"
  },
  {
    "id": "TRF4014",
    "sourceLocation": "Bangalore East Warehouse",
    "destinationLocation": "Bangalore East Warehouse",
    "status": "Cancelled",
    "amount": 19365.81,
    "requestedDate": "2026-07-09",
    "sentDate": "—",
    "receivedDate": "—"
  },
  {
    "id": "TRF4015",
    "sourceLocation": "Gurgaon Warehouse",
    "destinationLocation": "Gurgaon Warehouse",
    "status": "Received",
    "amount": 4134.48,
    "requestedDate": "2026-07-11",
    "sentDate": "2026-07-11",
    "receivedDate": "2026-07-11"
  },
  {
    "id": "TRF4016",
    "sourceLocation": "Bangalore East Warehouse",
    "destinationLocation": "Pune Hinjewadi Warehouse",
    "status": "Cancelled",
    "amount": 18149.93,
    "requestedDate": "2026-06-26",
    "sentDate": "—",
    "receivedDate": "—"
  },
  {
    "id": "TRF4017",
    "sourceLocation": "Gurgaon Warehouse",
    "destinationLocation": "Gurgaon Warehouse",
    "status": "Cancelled",
    "amount": 42780.28,
    "requestedDate": "2026-06-28",
    "sentDate": "—",
    "receivedDate": "—"
  },
  {
    "id": "TRF4018",
    "sourceLocation": "North Delhi Warehouse",
    "destinationLocation": "Pune Hinjewadi Warehouse",
    "status": "Received",
    "amount": 31982.27,
    "requestedDate": "2026-07-13",
    "sentDate": "2026-07-13",
    "receivedDate": "2026-07-13"
  },
  {
    "id": "TRF4019",
    "sourceLocation": "Gurgaon Warehouse",
    "destinationLocation": "Gurgaon Warehouse",
    "status": "Received",
    "amount": 51922.83,
    "requestedDate": "2026-07-02",
    "sentDate": "2026-07-02",
    "receivedDate": "2026-07-02"
  }
];

export const STOCK_TRANSFER_STATUSES: string[] = ["Requested","Sent","Received","Cancelled"];
export const STOCK_TRANSFER_SOURCELOCATION: string[] = ["Bangalore East Warehouse","Gurgaon Warehouse","North Delhi Warehouse","Pune Hinjewadi Warehouse"];
export const STOCK_TRANSFER_DESTINATIONLOCATION: string[] = ["Bangalore East Warehouse","Gurgaon Warehouse","North Delhi Warehouse","Pune Hinjewadi Warehouse"];
