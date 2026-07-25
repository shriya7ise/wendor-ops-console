import { PaymentRecord } from './interfaces/payment-history.interface';

// Deterministic mock dataset for PRD 3.1.2 — Payment History.
export const MOCK_PAYMENT_RECORD: PaymentRecord[] = [
  {
    "id": "PAY8000",
    "createdDate": "2025-10-09",
    "paymentMethod": "Card",
    "amount": 10187.15,
    "invoiceNumber": "INV-2026-1000",
    "paymentStatus": "Refunded",
    "paidBy": "Neha Kulkarni"
  },
  {
    "id": "PAY8001",
    "createdDate": "2026-02-02",
    "paymentMethod": "Wallet",
    "amount": 27256.88,
    "invoiceNumber": "INV-2026-1001",
    "paymentStatus": "Failed",
    "paidBy": "Arjun Verma"
  },
  {
    "id": "PAY8002",
    "createdDate": "2025-11-22",
    "paymentMethod": "Card",
    "amount": 2005.23,
    "invoiceNumber": "INV-2026-1002",
    "paymentStatus": "Refunded",
    "paidBy": "Farhan Sheikh"
  },
  {
    "id": "PAY8003",
    "createdDate": "2025-11-19",
    "paymentMethod": "UPI",
    "amount": 26131.79,
    "invoiceNumber": "INV-2026-1003",
    "paymentStatus": "Success",
    "paidBy": "Rohit Mehta"
  },
  {
    "id": "PAY8004",
    "createdDate": "2025-11-18",
    "paymentMethod": "UPI",
    "amount": 39826.38,
    "invoiceNumber": "INV-2026-1004",
    "paymentStatus": "Success",
    "paidBy": "Rohit Mehta"
  },
  {
    "id": "PAY8005",
    "createdDate": "2026-04-10",
    "paymentMethod": "Cheque",
    "amount": 21418.4,
    "invoiceNumber": "INV-2026-1005",
    "paymentStatus": "Success",
    "paidBy": "Arjun Verma"
  },
  {
    "id": "PAY8006",
    "createdDate": "2026-02-18",
    "paymentMethod": "Cheque",
    "amount": 16251.03,
    "invoiceNumber": "INV-2026-1006",
    "paymentStatus": "Success",
    "paidBy": "Farhan Sheikh"
  },
  {
    "id": "PAY8007",
    "createdDate": "2025-08-27",
    "paymentMethod": "Cheque",
    "amount": 1880.61,
    "invoiceNumber": "INV-2026-1007",
    "paymentStatus": "Success",
    "paidBy": "Sana Iyer"
  },
  {
    "id": "PAY8008",
    "createdDate": "2025-12-29",
    "paymentMethod": "Net Banking",
    "amount": 17938.83,
    "invoiceNumber": "INV-2026-1008",
    "paymentStatus": "Failed",
    "paidBy": "Vikram Shah"
  },
  {
    "id": "PAY8009",
    "createdDate": "2026-06-29",
    "paymentMethod": "Wallet",
    "amount": 44916.81,
    "invoiceNumber": "INV-2026-1009",
    "paymentStatus": "Success",
    "paidBy": "Rohit Mehta"
  },
  {
    "id": "PAY8010",
    "createdDate": "2025-10-28",
    "paymentMethod": "Cheque",
    "amount": 9495.9,
    "invoiceNumber": "INV-2026-1010",
    "paymentStatus": "Failed",
    "paidBy": "Priya Nair"
  },
  {
    "id": "PAY8011",
    "createdDate": "2025-11-18",
    "paymentMethod": "Wallet",
    "amount": 13425.32,
    "invoiceNumber": "INV-2026-1011",
    "paymentStatus": "Refunded",
    "paidBy": "Arjun Verma"
  },
  {
    "id": "PAY8012",
    "createdDate": "2026-04-03",
    "paymentMethod": "UPI",
    "amount": 35858.04,
    "invoiceNumber": "INV-2026-1012",
    "paymentStatus": "Success",
    "paidBy": "Arjun Verma"
  },
  {
    "id": "PAY8013",
    "createdDate": "2026-07-01",
    "paymentMethod": "UPI",
    "amount": 32686.82,
    "invoiceNumber": "INV-2026-1013",
    "paymentStatus": "Success",
    "paidBy": "Arjun Verma"
  },
  {
    "id": "PAY8014",
    "createdDate": "2025-07-23",
    "paymentMethod": "Net Banking",
    "amount": 36224.14,
    "invoiceNumber": "INV-2026-1014",
    "paymentStatus": "Success",
    "paidBy": "Arjun Verma"
  },
  {
    "id": "PAY8015",
    "createdDate": "2025-12-11",
    "paymentMethod": "Net Banking",
    "amount": 2690.43,
    "invoiceNumber": "INV-2026-1015",
    "paymentStatus": "Success",
    "paidBy": "Sana Iyer"
  },
  {
    "id": "PAY8016",
    "createdDate": "2026-03-12",
    "paymentMethod": "Net Banking",
    "amount": 3950.09,
    "invoiceNumber": "INV-2026-1016",
    "paymentStatus": "Success",
    "paidBy": "Arjun Verma"
  },
  {
    "id": "PAY8017",
    "createdDate": "2025-11-15",
    "paymentMethod": "UPI",
    "amount": 30802.69,
    "invoiceNumber": "INV-2026-1017",
    "paymentStatus": "Success",
    "paidBy": "Arjun Verma"
  },
  {
    "id": "PAY8018",
    "createdDate": "2025-08-22",
    "paymentMethod": "Cheque",
    "amount": 5362.74,
    "invoiceNumber": "INV-2026-1018",
    "paymentStatus": "Success",
    "paidBy": "Rohit Mehta"
  },
  {
    "id": "PAY8019",
    "createdDate": "2026-04-18",
    "paymentMethod": "Cheque",
    "amount": 29035.76,
    "invoiceNumber": "INV-2026-1019",
    "paymentStatus": "Success",
    "paidBy": "Neha Kulkarni"
  },
  {
    "id": "PAY8020",
    "createdDate": "2025-09-06",
    "paymentMethod": "Cheque",
    "amount": 23205.02,
    "invoiceNumber": "INV-2026-1020",
    "paymentStatus": "Failed",
    "paidBy": "Neha Kulkarni"
  },
  {
    "id": "PAY8021",
    "createdDate": "2025-09-12",
    "paymentMethod": "Card",
    "amount": 12122.43,
    "invoiceNumber": "INV-2026-1021",
    "paymentStatus": "Success",
    "paidBy": "Farhan Sheikh"
  },
  {
    "id": "PAY8022",
    "createdDate": "2026-07-06",
    "paymentMethod": "Card",
    "amount": 25391.87,
    "invoiceNumber": "INV-2026-1022",
    "paymentStatus": "Success",
    "paidBy": "Priya Nair"
  },
  {
    "id": "PAY8023",
    "createdDate": "2026-06-29",
    "paymentMethod": "UPI",
    "amount": 13521.16,
    "invoiceNumber": "INV-2026-1023",
    "paymentStatus": "Refunded",
    "paidBy": "Rohit Mehta"
  },
  {
    "id": "PAY8024",
    "createdDate": "2025-11-02",
    "paymentMethod": "Wallet",
    "amount": 29734.94,
    "invoiceNumber": "INV-2026-1024",
    "paymentStatus": "Success",
    "paidBy": "Rohit Mehta"
  },
  {
    "id": "PAY8025",
    "createdDate": "2025-09-14",
    "paymentMethod": "Cheque",
    "amount": 1119.63,
    "invoiceNumber": "INV-2026-1025",
    "paymentStatus": "Success",
    "paidBy": "Priya Nair"
  },
  {
    "id": "PAY8026",
    "createdDate": "2025-08-29",
    "paymentMethod": "Card",
    "amount": 49902.76,
    "invoiceNumber": "INV-2026-1026",
    "paymentStatus": "Success",
    "paidBy": "Anita Rao"
  },
  {
    "id": "PAY8027",
    "createdDate": "2026-06-30",
    "paymentMethod": "UPI",
    "amount": 22304.98,
    "invoiceNumber": "INV-2026-1027",
    "paymentStatus": "Refunded",
    "paidBy": "Priya Nair"
  },
  {
    "id": "PAY8028",
    "createdDate": "2025-10-04",
    "paymentMethod": "Net Banking",
    "amount": 46830.9,
    "invoiceNumber": "INV-2026-1000",
    "paymentStatus": "Success",
    "paidBy": "Sana Iyer"
  },
  {
    "id": "PAY8029",
    "createdDate": "2025-09-03",
    "paymentMethod": "Cheque",
    "amount": 31269.48,
    "invoiceNumber": "INV-2026-1001",
    "paymentStatus": "Success",
    "paidBy": "Farhan Sheikh"
  }
];

export const PAYMENT_RECORD_STATUSES: string[] = ["Success","Failed","Refunded"];
export const PAYMENT_RECORD_PAYMENTMETHOD: string[] = ["Card","Cheque","Net Banking","UPI","Wallet"];
