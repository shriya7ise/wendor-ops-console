import { CreditTransaction } from './interfaces/credit-history.interface';

// Deterministic mock dataset for PRD 3.1.3 — Credit History.
export const MOCK_CREDIT_TRANSACTION: CreditTransaction[] = [
  {
    "id": "CRD9000",
    "createdDate": "2026-07-18",
    "credits": 484,
    "transactionType": "Top-up",
    "machineName": "VM-3010"
  },
  {
    "id": "CRD9001",
    "createdDate": "2026-05-31",
    "credits": -391,
    "transactionType": "Machine Debit",
    "machineName": "VM-2007"
  },
  {
    "id": "CRD9002",
    "createdDate": "2026-03-31",
    "credits": 441,
    "transactionType": "Refund Credit",
    "machineName": "VM-1042"
  },
  {
    "id": "CRD9003",
    "createdDate": "2026-02-07",
    "credits": 167,
    "transactionType": "Refund Credit",
    "machineName": "VM-3125"
  },
  {
    "id": "CRD9004",
    "createdDate": "2026-07-15",
    "credits": 250,
    "transactionType": "Top-up",
    "machineName": "VM-2007"
  },
  {
    "id": "CRD9005",
    "createdDate": "2026-02-06",
    "credits": -355,
    "transactionType": "Machine Debit",
    "machineName": "VM-3125"
  },
  {
    "id": "CRD9006",
    "createdDate": "2026-05-04",
    "credits": 92,
    "transactionType": "Refund Credit",
    "machineName": "VM-2088"
  },
  {
    "id": "CRD9007",
    "createdDate": "2026-06-06",
    "credits": 189,
    "transactionType": "Adjustment",
    "machineName": "VM-3010"
  },
  {
    "id": "CRD9008",
    "createdDate": "2026-06-19",
    "credits": -363,
    "transactionType": "Machine Debit",
    "machineName": "VM-3125"
  },
  {
    "id": "CRD9009",
    "createdDate": "2026-07-02",
    "credits": 145,
    "transactionType": "Adjustment",
    "machineName": "VM-1042"
  },
  {
    "id": "CRD9010",
    "createdDate": "2026-04-25",
    "credits": 93,
    "transactionType": "Adjustment",
    "machineName": "VM-1042"
  },
  {
    "id": "CRD9011",
    "createdDate": "2026-03-09",
    "credits": 127,
    "transactionType": "Adjustment",
    "machineName": "VM-3125"
  },
  {
    "id": "CRD9012",
    "createdDate": "2026-06-28",
    "credits": 47,
    "transactionType": "Adjustment",
    "machineName": "VM-1042"
  },
  {
    "id": "CRD9013",
    "createdDate": "2026-02-10",
    "credits": 305,
    "transactionType": "Adjustment",
    "machineName": "VM-2088"
  },
  {
    "id": "CRD9014",
    "createdDate": "2026-06-30",
    "credits": 426,
    "transactionType": "Refund Credit",
    "machineName": "VM-3010"
  },
  {
    "id": "CRD9015",
    "createdDate": "2026-07-23",
    "credits": 208,
    "transactionType": "Refund Credit",
    "machineName": "VM-2007"
  },
  {
    "id": "CRD9016",
    "createdDate": "2026-06-03",
    "credits": 172,
    "transactionType": "Adjustment",
    "machineName": "VM-2088"
  },
  {
    "id": "CRD9017",
    "createdDate": "2026-07-18",
    "credits": 288,
    "transactionType": "Top-up",
    "machineName": "VM-3125"
  },
  {
    "id": "CRD9018",
    "createdDate": "2026-04-29",
    "credits": 395,
    "transactionType": "Top-up",
    "machineName": "VM-2007"
  },
  {
    "id": "CRD9019",
    "createdDate": "2026-06-27",
    "credits": 499,
    "transactionType": "Adjustment",
    "machineName": "VM-1042"
  },
  {
    "id": "CRD9020",
    "createdDate": "2026-03-24",
    "credits": 67,
    "transactionType": "Refund Credit",
    "machineName": "VM-3010"
  },
  {
    "id": "CRD9021",
    "createdDate": "2026-02-10",
    "credits": -250,
    "transactionType": "Machine Debit",
    "machineName": "VM-3010"
  },
  {
    "id": "CRD9022",
    "createdDate": "2026-02-14",
    "credits": -224,
    "transactionType": "Machine Debit",
    "machineName": "VM-2088"
  },
  {
    "id": "CRD9023",
    "createdDate": "2026-04-26",
    "credits": -239,
    "transactionType": "Machine Debit",
    "machineName": "VM-3010"
  },
  {
    "id": "CRD9024",
    "createdDate": "2026-07-15",
    "credits": -123,
    "transactionType": "Machine Debit",
    "machineName": "VM-3125"
  },
  {
    "id": "CRD9025",
    "createdDate": "2026-04-27",
    "credits": 465,
    "transactionType": "Adjustment",
    "machineName": "VM-3010"
  },
  {
    "id": "CRD9026",
    "createdDate": "2026-03-15",
    "credits": 456,
    "transactionType": "Top-up",
    "machineName": "VM-2088"
  },
  {
    "id": "CRD9027",
    "createdDate": "2026-05-10",
    "credits": -223,
    "transactionType": "Machine Debit",
    "machineName": "VM-2088"
  }
];

export const CREDIT_TRANSACTION_TRANSACTIONTYPE: string[] = ["Adjustment","Machine Debit","Refund Credit","Top-up"];
export const CREDIT_TRANSACTION_MACHINENAME: string[] = ["VM-1042","VM-2007","VM-2088","VM-3010","VM-3125"];
