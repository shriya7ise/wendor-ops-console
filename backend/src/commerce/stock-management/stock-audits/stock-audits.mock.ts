import { StockAudit } from './interfaces/stock-audits.interface';

// Deterministic mock dataset for PRD 2.2.2.8 — Stock Audits.
export const MOCK_STOCK_AUDIT: StockAudit[] = [
  {
    "id": "AUD200",
    "date": "2026-05-28",
    "stockLocation": "Bangalore East Warehouse",
    "reason": "Discrepancy Investigation",
    "totalAmount": 24758.88,
    "stockChange": 66
  },
  {
    "id": "AUD201",
    "date": "2026-06-01",
    "stockLocation": "Gurgaon Warehouse",
    "reason": "Scheduled Audit",
    "totalAmount": 5119.38,
    "stockChange": -78
  },
  {
    "id": "AUD202",
    "date": "2026-04-12",
    "stockLocation": "North Delhi Warehouse",
    "reason": "Discrepancy Investigation",
    "totalAmount": 19107.23,
    "stockChange": -20
  },
  {
    "id": "AUD203",
    "date": "2026-05-21",
    "stockLocation": "North Delhi Warehouse",
    "reason": "Scheduled Audit",
    "totalAmount": 18654.36,
    "stockChange": -67
  },
  {
    "id": "AUD204",
    "date": "2026-04-06",
    "stockLocation": "North Delhi Warehouse",
    "reason": "Year-End Audit",
    "totalAmount": 24807.69,
    "stockChange": -34
  },
  {
    "id": "AUD205",
    "date": "2026-05-04",
    "stockLocation": "Gurgaon Warehouse",
    "reason": "Scheduled Audit",
    "totalAmount": 19250.38,
    "stockChange": -50
  },
  {
    "id": "AUD206",
    "date": "2026-02-15",
    "stockLocation": "Bangalore East Warehouse",
    "reason": "Scheduled Audit",
    "totalAmount": 3295.26,
    "stockChange": -4
  },
  {
    "id": "AUD207",
    "date": "2026-05-08",
    "stockLocation": "Pune Hinjewadi Warehouse",
    "reason": "Scheduled Audit",
    "totalAmount": 14209.53,
    "stockChange": 16
  },
  {
    "id": "AUD208",
    "date": "2026-03-18",
    "stockLocation": "Pune Hinjewadi Warehouse",
    "reason": "Scheduled Audit",
    "totalAmount": 10805.77,
    "stockChange": -66
  },
  {
    "id": "AUD209",
    "date": "2026-06-20",
    "stockLocation": "Gurgaon Warehouse",
    "reason": "Damage Report",
    "totalAmount": 19447.92,
    "stockChange": -65
  },
  {
    "id": "AUD210",
    "date": "2026-02-18",
    "stockLocation": "Pune Hinjewadi Warehouse",
    "reason": "Discrepancy Investigation",
    "totalAmount": 17697.22,
    "stockChange": -2
  },
  {
    "id": "AUD211",
    "date": "2026-02-14",
    "stockLocation": "Bangalore East Warehouse",
    "reason": "Damage Report",
    "totalAmount": 13756.84,
    "stockChange": -52
  },
  {
    "id": "AUD212",
    "date": "2026-02-17",
    "stockLocation": "Bangalore East Warehouse",
    "reason": "Year-End Audit",
    "totalAmount": 5889.5,
    "stockChange": -51
  },
  {
    "id": "AUD213",
    "date": "2026-05-08",
    "stockLocation": "Bangalore East Warehouse",
    "reason": "Year-End Audit",
    "totalAmount": 24555.73,
    "stockChange": -16
  },
  {
    "id": "AUD214",
    "date": "2026-03-07",
    "stockLocation": "Gurgaon Warehouse",
    "reason": "Damage Report",
    "totalAmount": 3147.92,
    "stockChange": 11
  },
  {
    "id": "AUD215",
    "date": "2026-03-22",
    "stockLocation": "North Delhi Warehouse",
    "reason": "Year-End Audit",
    "totalAmount": 19610.49,
    "stockChange": 30
  }
];

export const STOCK_AUDIT_STOCKLOCATION: string[] = ["Bangalore East Warehouse","Gurgaon Warehouse","North Delhi Warehouse","Pune Hinjewadi Warehouse"];
