import { ReturnOrder } from './interfaces/return-orders.interface';

// Deterministic mock dataset for PRD 2.2.2.6 — Return Orders.
export const MOCK_RETURN_ORDER: ReturnOrder[] = [
  {
    "id": "RTN3000",
    "machine": "VM-1021",
    "stockLocation": "Gurgaon Warehouse",
    "assignedTo": "Rohit Mehta",
    "executedBy": "—",
    "createdAt": "2026-06-27",
    "status": "In Transit"
  },
  {
    "id": "RTN3001",
    "machine": "VM-1042",
    "stockLocation": "Bangalore East Warehouse",
    "assignedTo": "Rohit Mehta",
    "executedBy": "—",
    "createdAt": "2026-07-15",
    "status": "Pending"
  },
  {
    "id": "RTN3002",
    "machine": "VM-3010",
    "stockLocation": "Gurgaon Warehouse",
    "assignedTo": "Rohit Mehta",
    "executedBy": "—",
    "createdAt": "2026-06-22",
    "status": "In Transit"
  },
  {
    "id": "RTN3003",
    "machine": "VM-1021",
    "stockLocation": "Bangalore East Warehouse",
    "assignedTo": "Anita Rao",
    "executedBy": "—",
    "createdAt": "2026-07-06",
    "status": "Rejected"
  },
  {
    "id": "RTN3004",
    "machine": "VM-2007",
    "stockLocation": "Pune Hinjewadi Warehouse",
    "assignedTo": "Neha Kulkarni",
    "executedBy": "—",
    "createdAt": "2026-05-31",
    "status": "Rejected"
  },
  {
    "id": "RTN3005",
    "machine": "VM-2007",
    "stockLocation": "North Delhi Warehouse",
    "assignedTo": "Rohit Mehta",
    "executedBy": "—",
    "createdAt": "2026-05-24",
    "status": "Rejected"
  },
  {
    "id": "RTN3006",
    "machine": "VM-1042",
    "stockLocation": "Bangalore East Warehouse",
    "assignedTo": "Rohit Mehta",
    "executedBy": "Sana Iyer",
    "createdAt": "2026-07-04",
    "status": "Completed"
  },
  {
    "id": "RTN3007",
    "machine": "VM-3125",
    "stockLocation": "Bangalore East Warehouse",
    "assignedTo": "Farhan Sheikh",
    "executedBy": "—",
    "createdAt": "2026-05-31",
    "status": "Rejected"
  },
  {
    "id": "RTN3008",
    "machine": "VM-1042",
    "stockLocation": "Gurgaon Warehouse",
    "assignedTo": "Rohit Mehta",
    "executedBy": "—",
    "createdAt": "2026-06-07",
    "status": "Pending"
  },
  {
    "id": "RTN3009",
    "machine": "VM-2007",
    "stockLocation": "Gurgaon Warehouse",
    "assignedTo": "Rohit Mehta",
    "executedBy": "—",
    "createdAt": "2026-07-22",
    "status": "In Transit"
  },
  {
    "id": "RTN3010",
    "machine": "VM-2088",
    "stockLocation": "Bangalore East Warehouse",
    "assignedTo": "Anita Rao",
    "executedBy": "—",
    "createdAt": "2026-06-25",
    "status": "Pending"
  },
  {
    "id": "RTN3011",
    "machine": "VM-2088",
    "stockLocation": "Gurgaon Warehouse",
    "assignedTo": "Rohit Mehta",
    "executedBy": "—",
    "createdAt": "2026-07-11",
    "status": "Pending"
  },
  {
    "id": "RTN3012",
    "machine": "VM-1021",
    "stockLocation": "Gurgaon Warehouse",
    "assignedTo": "Arjun Verma",
    "executedBy": "—",
    "createdAt": "2026-06-27",
    "status": "Rejected"
  },
  {
    "id": "RTN3013",
    "machine": "VM-2007",
    "stockLocation": "Bangalore East Warehouse",
    "assignedTo": "Sana Iyer",
    "executedBy": "—",
    "createdAt": "2026-07-04",
    "status": "Pending"
  },
  {
    "id": "RTN3014",
    "machine": "VM-3010",
    "stockLocation": "North Delhi Warehouse",
    "assignedTo": "Farhan Sheikh",
    "executedBy": "Neha Kulkarni",
    "createdAt": "2026-07-02",
    "status": "Completed"
  },
  {
    "id": "RTN3015",
    "machine": "VM-1021",
    "stockLocation": "Bangalore East Warehouse",
    "assignedTo": "Sana Iyer",
    "executedBy": "Anita Rao",
    "createdAt": "2026-07-02",
    "status": "Completed"
  },
  {
    "id": "RTN3016",
    "machine": "VM-3010",
    "stockLocation": "North Delhi Warehouse",
    "assignedTo": "Neha Kulkarni",
    "executedBy": "—",
    "createdAt": "2026-07-16",
    "status": "Rejected"
  },
  {
    "id": "RTN3017",
    "machine": "VM-3010",
    "stockLocation": "Pune Hinjewadi Warehouse",
    "assignedTo": "Vikram Shah",
    "executedBy": "—",
    "createdAt": "2026-05-30",
    "status": "Pending"
  },
  {
    "id": "RTN3018",
    "machine": "VM-3125",
    "stockLocation": "Pune Hinjewadi Warehouse",
    "assignedTo": "Farhan Sheikh",
    "executedBy": "Arjun Verma",
    "createdAt": "2026-07-01",
    "status": "Completed"
  },
  {
    "id": "RTN3019",
    "machine": "VM-3125",
    "stockLocation": "North Delhi Warehouse",
    "assignedTo": "Rohit Mehta",
    "executedBy": "—",
    "createdAt": "2026-06-23",
    "status": "In Transit"
  },
  {
    "id": "RTN3020",
    "machine": "VM-2007",
    "stockLocation": "Bangalore East Warehouse",
    "assignedTo": "Farhan Sheikh",
    "executedBy": "—",
    "createdAt": "2026-06-01",
    "status": "In Transit"
  },
  {
    "id": "RTN3021",
    "machine": "VM-2007",
    "stockLocation": "Gurgaon Warehouse",
    "assignedTo": "Sana Iyer",
    "executedBy": "Vikram Shah",
    "createdAt": "2026-06-24",
    "status": "Completed"
  }
];

export const RETURN_ORDER_STATUSES: string[] = ["Pending","In Transit","Completed","Rejected"];
export const RETURN_ORDER_MACHINE: string[] = ["VM-1021","VM-1042","VM-2007","VM-2088","VM-3010","VM-3125"];
export const RETURN_ORDER_STOCKLOCATION: string[] = ["Bangalore East Warehouse","Gurgaon Warehouse","North Delhi Warehouse","Pune Hinjewadi Warehouse"];
