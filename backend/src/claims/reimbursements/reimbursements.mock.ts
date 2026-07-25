import { Reimbursement } from './interfaces/reimbursements.interface';

// Deterministic mock dataset for PRD 2.1.2.2 — Reimbursements.
export const MOCK_REIMBURSEMENT: Reimbursement[] = [
  {
    "id": "RMB7000",
    "employee": "Priya Nair",
    "amount": 1057.88,
    "status": "Paid",
    "date": "2026-06-17",
    "paymentMethod": "Card",
    "remarks": "Verified against receipt"
  },
  {
    "id": "RMB7001",
    "employee": "Neha Kulkarni",
    "amount": 6667.03,
    "status": "Paid",
    "date": "2026-05-30",
    "paymentMethod": "Net Banking",
    "remarks": "Verified against receipt"
  },
  {
    "id": "RMB7002",
    "employee": "Sana Iyer",
    "amount": 3662.22,
    "status": "Pending",
    "date": "2026-07-22",
    "paymentMethod": "—",
    "remarks": "Awaiting finance batch"
  },
  {
    "id": "RMB7003",
    "employee": "Sana Iyer",
    "amount": 4118.03,
    "status": "Paid",
    "date": "2026-06-02",
    "paymentMethod": "Net Banking",
    "remarks": "Awaiting finance batch"
  },
  {
    "id": "RMB7004",
    "employee": "Anita Rao",
    "amount": 2056.4,
    "status": "Paid",
    "date": "2026-07-04",
    "paymentMethod": "Net Banking",
    "remarks": "Approved as per policy"
  },
  {
    "id": "RMB7005",
    "employee": "Rohit Mehta",
    "amount": 6668.03,
    "status": "Approved",
    "date": "2026-05-31",
    "paymentMethod": "—",
    "remarks": "Awaiting finance batch"
  },
  {
    "id": "RMB7006",
    "employee": "Anita Rao",
    "amount": 2442.72,
    "status": "Paid",
    "date": "2026-05-25",
    "paymentMethod": "Wallet",
    "remarks": "Verified against receipt"
  },
  {
    "id": "RMB7007",
    "employee": "Sana Iyer",
    "amount": 11100.24,
    "status": "Paid",
    "date": "2026-06-28",
    "paymentMethod": "UPI",
    "remarks": "Approved as per policy"
  },
  {
    "id": "RMB7008",
    "employee": "Farhan Sheikh",
    "amount": 11781.81,
    "status": "Approved",
    "date": "2026-06-22",
    "paymentMethod": "—",
    "remarks": "Awaiting finance batch"
  },
  {
    "id": "RMB7009",
    "employee": "Rohit Mehta",
    "amount": 13466.62,
    "status": "Paid",
    "date": "2026-06-12",
    "paymentMethod": "Cheque",
    "remarks": "Awaiting finance batch"
  },
  {
    "id": "RMB7010",
    "employee": "Arjun Verma",
    "amount": 9406.28,
    "status": "Approved",
    "date": "2026-07-12",
    "paymentMethod": "—",
    "remarks": "Awaiting finance batch"
  },
  {
    "id": "RMB7011",
    "employee": "Farhan Sheikh",
    "amount": 6875.59,
    "status": "Paid",
    "date": "2026-07-01",
    "paymentMethod": "UPI",
    "remarks": "Awaiting finance batch"
  },
  {
    "id": "RMB7012",
    "employee": "Vikram Shah",
    "amount": 13883.15,
    "status": "Approved",
    "date": "2026-06-06",
    "paymentMethod": "—",
    "remarks": "Awaiting finance batch"
  },
  {
    "id": "RMB7013",
    "employee": "Anita Rao",
    "amount": 8889.01,
    "status": "Paid",
    "date": "2026-07-21",
    "paymentMethod": "Cheque",
    "remarks": "Verified against receipt"
  },
  {
    "id": "RMB7014",
    "employee": "Vikram Shah",
    "amount": 10396.58,
    "status": "Paid",
    "date": "2026-06-21",
    "paymentMethod": "Cheque",
    "remarks": "—"
  },
  {
    "id": "RMB7015",
    "employee": "Anita Rao",
    "amount": 1098.87,
    "status": "Paid",
    "date": "2026-07-17",
    "paymentMethod": "Wallet",
    "remarks": "—"
  },
  {
    "id": "RMB7016",
    "employee": "Rohit Mehta",
    "amount": 2398.81,
    "status": "Paid",
    "date": "2026-07-22",
    "paymentMethod": "UPI",
    "remarks": "—"
  },
  {
    "id": "RMB7017",
    "employee": "Anita Rao",
    "amount": 5762.37,
    "status": "Approved",
    "date": "2026-06-20",
    "paymentMethod": "—",
    "remarks": "Awaiting finance batch"
  },
  {
    "id": "RMB7018",
    "employee": "Priya Nair",
    "amount": 5306.41,
    "status": "Approved",
    "date": "2026-06-22",
    "paymentMethod": "—",
    "remarks": "Verified against receipt"
  },
  {
    "id": "RMB7019",
    "employee": "Neha Kulkarni",
    "amount": 6632.26,
    "status": "Approved",
    "date": "2026-07-23",
    "paymentMethod": "—",
    "remarks": "Approved as per policy"
  }
];

export const REIMBURSEMENT_STATUSES: string[] = ["Pending","Approved","Paid"];
export const REIMBURSEMENT_EMPLOYEE: string[] = ["Anita Rao","Arjun Verma","Farhan Sheikh","Neha Kulkarni","Priya Nair","Rohit Mehta","Sana Iyer","Vikram Shah"];
