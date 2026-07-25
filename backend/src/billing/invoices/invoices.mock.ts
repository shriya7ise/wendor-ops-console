import { Invoice } from './interfaces/invoices.interface';

// Deterministic mock dataset for PRD 3.1.1 — Invoices.
export const MOCK_INVOICE: Invoice[] = [
  {
    "id": "INV-2026-1000",
    "invoiceDate": "2026-07-16",
    "amount": 1326.13,
    "subscriptionPlan": "Pro",
    "paymentStatus": "Overdue"
  },
  {
    "id": "INV-2026-1001",
    "invoiceDate": "2025-08-30",
    "amount": 29859.41,
    "subscriptionPlan": "Growth",
    "paymentStatus": "Pending"
  },
  {
    "id": "INV-2026-1002",
    "invoiceDate": "2025-10-21",
    "amount": 43851.19,
    "subscriptionPlan": "Enterprise",
    "paymentStatus": "Paid"
  },
  {
    "id": "INV-2026-1003",
    "invoiceDate": "2025-10-23",
    "amount": 17847.06,
    "subscriptionPlan": "Enterprise",
    "paymentStatus": "Pending"
  },
  {
    "id": "INV-2026-1004",
    "invoiceDate": "2026-04-14",
    "amount": 1331.66,
    "subscriptionPlan": "Enterprise",
    "paymentStatus": "Paid"
  },
  {
    "id": "INV-2026-1005",
    "invoiceDate": "2026-04-16",
    "amount": 34450.87,
    "subscriptionPlan": "Starter",
    "paymentStatus": "Pending"
  },
  {
    "id": "INV-2026-1006",
    "invoiceDate": "2026-06-26",
    "amount": 7679.34,
    "subscriptionPlan": "Pro",
    "paymentStatus": "Pending"
  },
  {
    "id": "INV-2026-1007",
    "invoiceDate": "2026-06-30",
    "amount": 48501.73,
    "subscriptionPlan": "Enterprise",
    "paymentStatus": "Paid"
  },
  {
    "id": "INV-2026-1008",
    "invoiceDate": "2026-05-16",
    "amount": 18880.52,
    "subscriptionPlan": "Enterprise",
    "paymentStatus": "Paid"
  },
  {
    "id": "INV-2026-1009",
    "invoiceDate": "2025-10-26",
    "amount": 40427.5,
    "subscriptionPlan": "Growth",
    "paymentStatus": "Paid"
  },
  {
    "id": "INV-2026-1010",
    "invoiceDate": "2026-07-02",
    "amount": 29960.47,
    "subscriptionPlan": "Growth",
    "paymentStatus": "Overdue"
  },
  {
    "id": "INV-2026-1011",
    "invoiceDate": "2025-12-01",
    "amount": 14666.17,
    "subscriptionPlan": "Growth",
    "paymentStatus": "Pending"
  },
  {
    "id": "INV-2026-1012",
    "invoiceDate": "2026-04-23",
    "amount": 31962.12,
    "subscriptionPlan": "Growth",
    "paymentStatus": "Paid"
  },
  {
    "id": "INV-2026-1013",
    "invoiceDate": "2025-09-27",
    "amount": 12127.5,
    "subscriptionPlan": "Growth",
    "paymentStatus": "Paid"
  },
  {
    "id": "INV-2026-1014",
    "invoiceDate": "2026-01-23",
    "amount": 30728.15,
    "subscriptionPlan": "Enterprise",
    "paymentStatus": "Overdue"
  },
  {
    "id": "INV-2026-1015",
    "invoiceDate": "2026-03-29",
    "amount": 46163.84,
    "subscriptionPlan": "Pro",
    "paymentStatus": "Paid"
  },
  {
    "id": "INV-2026-1016",
    "invoiceDate": "2025-09-29",
    "amount": 20344.59,
    "subscriptionPlan": "Enterprise",
    "paymentStatus": "Paid"
  },
  {
    "id": "INV-2026-1017",
    "invoiceDate": "2026-01-17",
    "amount": 4820,
    "subscriptionPlan": "Enterprise",
    "paymentStatus": "Paid"
  },
  {
    "id": "INV-2026-1018",
    "invoiceDate": "2026-05-15",
    "amount": 2550.81,
    "subscriptionPlan": "Growth",
    "paymentStatus": "Paid"
  },
  {
    "id": "INV-2026-1019",
    "invoiceDate": "2025-09-12",
    "amount": 21497.82,
    "subscriptionPlan": "Enterprise",
    "paymentStatus": "Paid"
  },
  {
    "id": "INV-2026-1020",
    "invoiceDate": "2025-12-16",
    "amount": 35273.66,
    "subscriptionPlan": "Enterprise",
    "paymentStatus": "Pending"
  },
  {
    "id": "INV-2026-1021",
    "invoiceDate": "2025-11-09",
    "amount": 3425.45,
    "subscriptionPlan": "Starter",
    "paymentStatus": "Overdue"
  },
  {
    "id": "INV-2026-1022",
    "invoiceDate": "2026-03-03",
    "amount": 6882.93,
    "subscriptionPlan": "Growth",
    "paymentStatus": "Pending"
  },
  {
    "id": "INV-2026-1023",
    "invoiceDate": "2025-08-24",
    "amount": 22130.54,
    "subscriptionPlan": "Enterprise",
    "paymentStatus": "Paid"
  },
  {
    "id": "INV-2026-1024",
    "invoiceDate": "2026-02-05",
    "amount": 28933.54,
    "subscriptionPlan": "Growth",
    "paymentStatus": "Paid"
  },
  {
    "id": "INV-2026-1025",
    "invoiceDate": "2025-11-13",
    "amount": 38260.66,
    "subscriptionPlan": "Enterprise",
    "paymentStatus": "Overdue"
  },
  {
    "id": "INV-2026-1026",
    "invoiceDate": "2025-10-04",
    "amount": 23053.09,
    "subscriptionPlan": "Starter",
    "paymentStatus": "Paid"
  },
  {
    "id": "INV-2026-1027",
    "invoiceDate": "2025-08-22",
    "amount": 34334.67,
    "subscriptionPlan": "Enterprise",
    "paymentStatus": "Paid"
  }
];

export const INVOICE_STATUSES: string[] = ["Paid","Pending","Overdue"];
export const INVOICE_SUBSCRIPTIONPLAN: string[] = ["Enterprise","Growth","Pro","Starter"];
