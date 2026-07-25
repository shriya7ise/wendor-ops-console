import { ExpenseClaim } from './interfaces/expenses.interface';

// Deterministic mock dataset for PRD 2.1.2.1 — Expenses.
export const MOCK_EXPENSE_CLAIM: ExpenseClaim[] = [
  {
    "id": "EXP6000",
    "category": "Office Supplies",
    "submittedBy": "Vikram Shah",
    "amount": 4522.78,
    "submittedDate": "2026-05-25",
    "progress": "Completed",
    "status": "Paid Out"
  },
  {
    "id": "EXP6001",
    "category": "Machine Maintenance",
    "submittedBy": "Sana Iyer",
    "amount": 13705.56,
    "submittedDate": "2026-07-07",
    "progress": "Awaiting manager approval",
    "status": "In Review"
  },
  {
    "id": "EXP6002",
    "category": "Miscellaneous",
    "submittedBy": "Priya Nair",
    "amount": 2482.05,
    "submittedDate": "2026-07-17",
    "progress": "Awaiting manager approval",
    "status": "In Review"
  },
  {
    "id": "EXP6003",
    "category": "Office Supplies",
    "submittedBy": "Farhan Sheikh",
    "amount": 4560.15,
    "submittedDate": "2026-05-31",
    "progress": "Completed",
    "status": "Paid Out"
  },
  {
    "id": "EXP6004",
    "category": "Machine Maintenance",
    "submittedBy": "Anita Rao",
    "amount": 6558.19,
    "submittedDate": "2026-06-13",
    "progress": "Completed",
    "status": "Paid Out"
  },
  {
    "id": "EXP6005",
    "category": "Travel",
    "submittedBy": "Vikram Shah",
    "amount": 9749.59,
    "submittedDate": "2026-07-12",
    "progress": "Completed",
    "status": "Paid Out"
  },
  {
    "id": "EXP6006",
    "category": "Machine Maintenance",
    "submittedBy": "Farhan Sheikh",
    "amount": 13301.12,
    "submittedDate": "2026-06-30",
    "progress": "Completed",
    "status": "Paid Out"
  },
  {
    "id": "EXP6007",
    "category": "Travel",
    "submittedBy": "Farhan Sheikh",
    "amount": 9686.27,
    "submittedDate": "2026-07-08",
    "progress": "Completed",
    "status": "Paid Out"
  },
  {
    "id": "EXP6008",
    "category": "Fuel",
    "submittedBy": "Priya Nair",
    "amount": 5814.52,
    "submittedDate": "2026-05-24",
    "progress": "Awaiting manager approval",
    "status": "In Review"
  },
  {
    "id": "EXP6009",
    "category": "Travel",
    "submittedBy": "Anita Rao",
    "amount": 2081.38,
    "submittedDate": "2026-07-02",
    "progress": "Awaiting manager approval",
    "status": "In Review"
  },
  {
    "id": "EXP6010",
    "category": "Fuel",
    "submittedBy": "Sana Iyer",
    "amount": 13544.82,
    "submittedDate": "2026-06-25",
    "progress": "Awaiting payout",
    "status": "Approved"
  },
  {
    "id": "EXP6011",
    "category": "Miscellaneous",
    "submittedBy": "Vikram Shah",
    "amount": 10105.92,
    "submittedDate": "2026-06-19",
    "progress": "Awaiting manager approval",
    "status": "In Review"
  },
  {
    "id": "EXP6012",
    "category": "Fuel",
    "submittedBy": "Farhan Sheikh",
    "amount": 13613.74,
    "submittedDate": "2026-07-05",
    "progress": "Completed",
    "status": "Paid Out"
  },
  {
    "id": "EXP6013",
    "category": "Travel",
    "submittedBy": "Rohit Mehta",
    "amount": 11457.73,
    "submittedDate": "2026-06-25",
    "progress": "Awaiting manager approval",
    "status": "In Review"
  },
  {
    "id": "EXP6014",
    "category": "Office Supplies",
    "submittedBy": "Anita Rao",
    "amount": 4849.39,
    "submittedDate": "2026-05-25",
    "progress": "Not submitted",
    "status": "Draft"
  },
  {
    "id": "EXP6015",
    "category": "Machine Maintenance",
    "submittedBy": "Anita Rao",
    "amount": 5437.86,
    "submittedDate": "2026-06-29",
    "progress": "Awaiting manager approval",
    "status": "In Review"
  },
  {
    "id": "EXP6016",
    "category": "Fuel",
    "submittedBy": "Neha Kulkarni",
    "amount": 5084.55,
    "submittedDate": "2026-07-05",
    "progress": "Awaiting payout",
    "status": "Approved"
  },
  {
    "id": "EXP6017",
    "category": "Miscellaneous",
    "submittedBy": "Arjun Verma",
    "amount": 623.96,
    "submittedDate": "2026-06-28",
    "progress": "Completed",
    "status": "Paid Out"
  },
  {
    "id": "EXP6018",
    "category": "Office Supplies",
    "submittedBy": "Vikram Shah",
    "amount": 4037.27,
    "submittedDate": "2026-06-17",
    "progress": "Not submitted",
    "status": "Draft"
  },
  {
    "id": "EXP6019",
    "category": "Travel",
    "submittedBy": "Priya Nair",
    "amount": 14757.01,
    "submittedDate": "2026-07-11",
    "progress": "Not submitted",
    "status": "Draft"
  },
  {
    "id": "EXP6020",
    "category": "Office Supplies",
    "submittedBy": "Anita Rao",
    "amount": 5443.2,
    "submittedDate": "2026-06-10",
    "progress": "Completed",
    "status": "Paid Out"
  },
  {
    "id": "EXP6021",
    "category": "Machine Maintenance",
    "submittedBy": "Arjun Verma",
    "amount": 10754.03,
    "submittedDate": "2026-06-02",
    "progress": "Completed",
    "status": "Paid Out"
  },
  {
    "id": "EXP6022",
    "category": "Meals",
    "submittedBy": "Priya Nair",
    "amount": 13073.96,
    "submittedDate": "2026-06-28",
    "progress": "Not submitted",
    "status": "Draft"
  },
  {
    "id": "EXP6023",
    "category": "Machine Maintenance",
    "submittedBy": "Anita Rao",
    "amount": 1848.97,
    "submittedDate": "2026-06-27",
    "progress": "Completed",
    "status": "Paid Out"
  }
];

export const EXPENSE_CLAIM_STATUSES: string[] = ["Draft","In Review","Approved","Paid Out","Rejected"];
export const EXPENSE_CLAIM_CATEGORY: string[] = ["Fuel","Machine Maintenance","Meals","Miscellaneous","Office Supplies","Travel"];
