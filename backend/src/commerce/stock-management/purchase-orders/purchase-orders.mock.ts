import { PurchaseOrder } from './interfaces/purchase-orders.interface';

// Deterministic mock dataset for PRD 2.2.2.5 — Purchase Orders.
export const MOCK_PURCHASE_ORDER: PurchaseOrder[] = [
  {
    "id": "PO5000",
    "vendor": "City Wholesale Mart",
    "stockLocation": "Pune Hinjewadi Warehouse",
    "totalCost": 139525.22,
    "generationType": "Auto (Reorder Point)",
    "createdBy": "Farhan Sheikh",
    "approvedBy": "Rohit Mehta",
    "receivedBy": "Vikram Shah",
    "status": "Received"
  },
  {
    "id": "PO5001",
    "vendor": "Balaji Distributors",
    "stockLocation": "Pune Hinjewadi Warehouse",
    "totalCost": 128455.17,
    "generationType": "Auto (Reorder Point)",
    "createdBy": "Sana Iyer",
    "approvedBy": "Arjun Verma",
    "receivedBy": "Farhan Sheikh",
    "status": "Received"
  },
  {
    "id": "PO5002",
    "vendor": "Sunrise Snacks Co.",
    "stockLocation": "North Delhi Warehouse",
    "totalCost": 85595.3,
    "generationType": "Manual",
    "createdBy": "Farhan Sheikh",
    "approvedBy": "—",
    "receivedBy": "—",
    "status": "Pending Approval"
  },
  {
    "id": "PO5003",
    "vendor": "Shree Foods Pvt Ltd",
    "stockLocation": "Bangalore East Warehouse",
    "totalCost": 148284.09,
    "generationType": "Auto (Reorder Point)",
    "createdBy": "Sana Iyer",
    "approvedBy": "Vikram Shah",
    "receivedBy": "—",
    "status": "Approved"
  },
  {
    "id": "PO5004",
    "vendor": "City Wholesale Mart",
    "stockLocation": "North Delhi Warehouse",
    "totalCost": 132943.2,
    "generationType": "Auto (Reorder Point)",
    "createdBy": "Neha Kulkarni",
    "approvedBy": "Anita Rao",
    "receivedBy": "Arjun Verma",
    "status": "Received"
  },
  {
    "id": "PO5005",
    "vendor": "Golden Harvest Traders",
    "stockLocation": "Pune Hinjewadi Warehouse",
    "totalCost": 14121.36,
    "generationType": "Auto (Reorder Point)",
    "createdBy": "Sana Iyer",
    "approvedBy": "Rohit Mehta",
    "receivedBy": "—",
    "status": "Approved"
  },
  {
    "id": "PO5006",
    "vendor": "Golden Harvest Traders",
    "stockLocation": "Pune Hinjewadi Warehouse",
    "totalCost": 114811.76,
    "generationType": "Auto (Reorder Point)",
    "createdBy": "Farhan Sheikh",
    "approvedBy": "Anita Rao",
    "receivedBy": "Neha Kulkarni",
    "status": "Received"
  },
  {
    "id": "PO5007",
    "vendor": "City Wholesale Mart",
    "stockLocation": "North Delhi Warehouse",
    "totalCost": 32995.04,
    "generationType": "Auto (Reorder Point)",
    "createdBy": "Vikram Shah",
    "approvedBy": "Sana Iyer",
    "receivedBy": "—",
    "status": "Ordered"
  },
  {
    "id": "PO5008",
    "vendor": "Sunrise Snacks Co.",
    "stockLocation": "Pune Hinjewadi Warehouse",
    "totalCost": 75116.62,
    "generationType": "Manual",
    "createdBy": "Sana Iyer",
    "approvedBy": "Farhan Sheikh",
    "receivedBy": "Farhan Sheikh",
    "status": "Received"
  },
  {
    "id": "PO5009",
    "vendor": "Shree Foods Pvt Ltd",
    "stockLocation": "Bangalore East Warehouse",
    "totalCost": 64255.03,
    "generationType": "Manual",
    "createdBy": "Farhan Sheikh",
    "approvedBy": "Anita Rao",
    "receivedBy": "—",
    "status": "Ordered"
  },
  {
    "id": "PO5010",
    "vendor": "Sunrise Snacks Co.",
    "stockLocation": "North Delhi Warehouse",
    "totalCost": 33827.45,
    "generationType": "Manual",
    "createdBy": "Arjun Verma",
    "approvedBy": "Anita Rao",
    "receivedBy": "Farhan Sheikh",
    "status": "Received"
  },
  {
    "id": "PO5011",
    "vendor": "Sunrise Snacks Co.",
    "stockLocation": "North Delhi Warehouse",
    "totalCost": 49499.19,
    "generationType": "Manual",
    "createdBy": "Vikram Shah",
    "approvedBy": "Vikram Shah",
    "receivedBy": "Rohit Mehta",
    "status": "Received"
  },
  {
    "id": "PO5012",
    "vendor": "City Wholesale Mart",
    "stockLocation": "Pune Hinjewadi Warehouse",
    "totalCost": 72048.75,
    "generationType": "Auto (Reorder Point)",
    "createdBy": "Sana Iyer",
    "approvedBy": "Arjun Verma",
    "receivedBy": "Priya Nair",
    "status": "Received"
  },
  {
    "id": "PO5013",
    "vendor": "City Wholesale Mart",
    "stockLocation": "Bangalore East Warehouse",
    "totalCost": 103150.83,
    "generationType": "Manual",
    "createdBy": "Farhan Sheikh",
    "approvedBy": "—",
    "receivedBy": "—",
    "status": "Rejected"
  },
  {
    "id": "PO5014",
    "vendor": "City Wholesale Mart",
    "stockLocation": "Gurgaon Warehouse",
    "totalCost": 95615.66,
    "generationType": "Auto (Reorder Point)",
    "createdBy": "Sana Iyer",
    "approvedBy": "—",
    "receivedBy": "—",
    "status": "Rejected"
  },
  {
    "id": "PO5015",
    "vendor": "Sunrise Snacks Co.",
    "stockLocation": "Bangalore East Warehouse",
    "totalCost": 129382.35,
    "generationType": "Manual",
    "createdBy": "Anita Rao",
    "approvedBy": "—",
    "receivedBy": "—",
    "status": "Pending Approval"
  },
  {
    "id": "PO5016",
    "vendor": "Sunrise Snacks Co.",
    "stockLocation": "Pune Hinjewadi Warehouse",
    "totalCost": 55002.91,
    "generationType": "Manual",
    "createdBy": "Vikram Shah",
    "approvedBy": "Anita Rao",
    "receivedBy": "Priya Nair",
    "status": "Received"
  },
  {
    "id": "PO5017",
    "vendor": "Golden Harvest Traders",
    "stockLocation": "North Delhi Warehouse",
    "totalCost": 45849.36,
    "generationType": "Manual",
    "createdBy": "Rohit Mehta",
    "approvedBy": "Farhan Sheikh",
    "receivedBy": "Vikram Shah",
    "status": "Received"
  },
  {
    "id": "PO5018",
    "vendor": "Shree Foods Pvt Ltd",
    "stockLocation": "Gurgaon Warehouse",
    "totalCost": 8018.09,
    "generationType": "Auto (Reorder Point)",
    "createdBy": "Sana Iyer",
    "approvedBy": "—",
    "receivedBy": "—",
    "status": "Rejected"
  },
  {
    "id": "PO5019",
    "vendor": "Balaji Distributors",
    "stockLocation": "North Delhi Warehouse",
    "totalCost": 22805.89,
    "generationType": "Auto (Reorder Point)",
    "createdBy": "Priya Nair",
    "approvedBy": "Sana Iyer",
    "receivedBy": "—",
    "status": "Ordered"
  },
  {
    "id": "PO5020",
    "vendor": "Shree Foods Pvt Ltd",
    "stockLocation": "Bangalore East Warehouse",
    "totalCost": 140160.52,
    "generationType": "Auto (Reorder Point)",
    "createdBy": "Priya Nair",
    "approvedBy": "—",
    "receivedBy": "—",
    "status": "Rejected"
  },
  {
    "id": "PO5021",
    "vendor": "Balaji Distributors",
    "stockLocation": "North Delhi Warehouse",
    "totalCost": 147203.6,
    "generationType": "Auto (Reorder Point)",
    "createdBy": "Neha Kulkarni",
    "approvedBy": "Arjun Verma",
    "receivedBy": "—",
    "status": "Approved"
  },
  {
    "id": "PO5022",
    "vendor": "Sunrise Snacks Co.",
    "stockLocation": "Pune Hinjewadi Warehouse",
    "totalCost": 63450.46,
    "generationType": "Auto (Reorder Point)",
    "createdBy": "Arjun Verma",
    "approvedBy": "—",
    "receivedBy": "—",
    "status": "Pending Approval"
  },
  {
    "id": "PO5023",
    "vendor": "Sunrise Snacks Co.",
    "stockLocation": "Gurgaon Warehouse",
    "totalCost": 104800.17,
    "generationType": "Auto (Reorder Point)",
    "createdBy": "Rohit Mehta",
    "approvedBy": "Arjun Verma",
    "receivedBy": "—",
    "status": "Approved"
  },
  {
    "id": "PO5024",
    "vendor": "Balaji Distributors",
    "stockLocation": "Gurgaon Warehouse",
    "totalCost": 19989.5,
    "generationType": "Manual",
    "createdBy": "Sana Iyer",
    "approvedBy": "Rohit Mehta",
    "receivedBy": "Neha Kulkarni",
    "status": "Received"
  },
  {
    "id": "PO5025",
    "vendor": "Golden Harvest Traders",
    "stockLocation": "Bangalore East Warehouse",
    "totalCost": 16443.42,
    "generationType": "Auto (Reorder Point)",
    "createdBy": "Sana Iyer",
    "approvedBy": "Sana Iyer",
    "receivedBy": "—",
    "status": "Approved"
  }
];

export const PURCHASE_ORDER_STATUSES: string[] = ["Draft","Pending Approval","Approved","Ordered","Received","Rejected"];
export const PURCHASE_ORDER_VENDOR: string[] = ["Balaji Distributors","City Wholesale Mart","Golden Harvest Traders","Shree Foods Pvt Ltd","Sunrise Snacks Co."];
export const PURCHASE_ORDER_STOCKLOCATION: string[] = ["Bangalore East Warehouse","Gurgaon Warehouse","North Delhi Warehouse","Pune Hinjewadi Warehouse"];
