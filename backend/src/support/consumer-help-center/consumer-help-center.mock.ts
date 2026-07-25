import { ConsumerTicket } from './interfaces/consumer-help-center.interface';

// Deterministic mock dataset for PRD 3.2.4 — Consumer Help Center.
export const MOCK_CONSUMER_TICKET: ConsumerTicket[] = [
  {
    "id": "CHC2000",
    "subject": "Unable to log in",
    "machine": "VM-2007",
    "status": "Closed",
    "raisedBy": "Consumer #4770",
    "createdDate": "2026-06-03",
    "updatedDate": "2026-06-03",
    "assignedTo": "Sana Iyer"
  },
  {
    "id": "CHC2001",
    "subject": "Payment deducted, item not dispensed",
    "machine": "VM-3125",
    "status": "Closed",
    "raisedBy": "Consumer #8625",
    "createdDate": "2026-05-01",
    "updatedDate": "2026-05-01",
    "assignedTo": "Priya Nair"
  },
  {
    "id": "CHC2002",
    "subject": "Payment deducted, item not dispensed",
    "machine": "VM-1021",
    "status": "Open",
    "raisedBy": "Consumer #7764",
    "createdDate": "2026-07-05",
    "updatedDate": "2026-07-05",
    "assignedTo": "Anita Rao"
  },
  {
    "id": "CHC2003",
    "subject": "Unable to log in",
    "machine": "N/A",
    "status": "In Progress",
    "raisedBy": "Consumer #9727",
    "createdDate": "2026-05-08",
    "updatedDate": "2026-05-08",
    "assignedTo": "Sana Iyer"
  },
  {
    "id": "CHC2004",
    "subject": "Refund not received",
    "machine": "VM-1042",
    "status": "Resolved",
    "raisedBy": "Consumer #2056",
    "createdDate": "2026-07-18",
    "updatedDate": "2026-07-18",
    "assignedTo": "Farhan Sheikh"
  },
  {
    "id": "CHC2005",
    "subject": "Unable to log in",
    "machine": "VM-3125",
    "status": "Resolved",
    "raisedBy": "Consumer #1276",
    "createdDate": "2026-06-14",
    "updatedDate": "2026-06-14",
    "assignedTo": "Neha Kulkarni"
  },
  {
    "id": "CHC2006",
    "subject": "Refund not received",
    "machine": "VM-3010",
    "status": "Closed",
    "raisedBy": "Consumer #9380",
    "createdDate": "2026-06-22",
    "updatedDate": "2026-06-22",
    "assignedTo": "Sana Iyer"
  },
  {
    "id": "CHC2007",
    "subject": "Payment deducted, item not dispensed",
    "machine": "VM-1021",
    "status": "In Progress",
    "raisedBy": "Consumer #8698",
    "createdDate": "2026-05-03",
    "updatedDate": "2026-05-03",
    "assignedTo": "Rohit Mehta"
  },
  {
    "id": "CHC2008",
    "subject": "Payment deducted, item not dispensed",
    "machine": "VM-2088",
    "status": "Closed",
    "raisedBy": "Consumer #7415",
    "createdDate": "2026-06-11",
    "updatedDate": "2026-06-11",
    "assignedTo": "Anita Rao"
  },
  {
    "id": "CHC2009",
    "subject": "OTP not received",
    "machine": "VM-3010",
    "status": "Resolved",
    "raisedBy": "Consumer #3313",
    "createdDate": "2026-05-06",
    "updatedDate": "2026-05-06",
    "assignedTo": "Anita Rao"
  },
  {
    "id": "CHC2010",
    "subject": "Payment deducted, item not dispensed",
    "machine": "VM-3010",
    "status": "Closed",
    "raisedBy": "Consumer #9559",
    "createdDate": "2026-06-26",
    "updatedDate": "2026-06-26",
    "assignedTo": "Rohit Mehta"
  },
  {
    "id": "CHC2011",
    "subject": "Wallet balance not updated",
    "machine": "VM-1042",
    "status": "Closed",
    "raisedBy": "Consumer #1805",
    "createdDate": "2026-06-09",
    "updatedDate": "2026-06-09",
    "assignedTo": "Anita Rao"
  },
  {
    "id": "CHC2012",
    "subject": "Unable to log in",
    "machine": "VM-1042",
    "status": "Resolved",
    "raisedBy": "Consumer #1185",
    "createdDate": "2026-06-28",
    "updatedDate": "2026-06-28",
    "assignedTo": "Sana Iyer"
  },
  {
    "id": "CHC2013",
    "subject": "Wallet balance not updated",
    "machine": "VM-1021",
    "status": "Open",
    "raisedBy": "Consumer #6274",
    "createdDate": "2026-06-26",
    "updatedDate": "2026-06-26",
    "assignedTo": "Arjun Verma"
  },
  {
    "id": "CHC2014",
    "subject": "Payment deducted, item not dispensed",
    "machine": "VM-2007",
    "status": "In Progress",
    "raisedBy": "Consumer #4766",
    "createdDate": "2026-07-16",
    "updatedDate": "2026-07-16",
    "assignedTo": "Arjun Verma"
  },
  {
    "id": "CHC2015",
    "subject": "Refund not received",
    "machine": "VM-3125",
    "status": "Resolved",
    "raisedBy": "Consumer #4050",
    "createdDate": "2026-05-26",
    "updatedDate": "2026-05-26",
    "assignedTo": "Vikram Shah"
  },
  {
    "id": "CHC2016",
    "subject": "OTP not received",
    "machine": "VM-2007",
    "status": "Closed",
    "raisedBy": "Consumer #6036",
    "createdDate": "2026-05-25",
    "updatedDate": "2026-05-25",
    "assignedTo": "Neha Kulkarni"
  },
  {
    "id": "CHC2017",
    "subject": "OTP not received",
    "machine": "VM-2007",
    "status": "Open",
    "raisedBy": "Consumer #7501",
    "createdDate": "2026-05-27",
    "updatedDate": "2026-05-27",
    "assignedTo": "Arjun Verma"
  },
  {
    "id": "CHC2018",
    "subject": "OTP not received",
    "machine": "VM-2007",
    "status": "Resolved",
    "raisedBy": "Consumer #3524",
    "createdDate": "2026-04-27",
    "updatedDate": "2026-04-27",
    "assignedTo": "Arjun Verma"
  },
  {
    "id": "CHC2019",
    "subject": "Refund not received",
    "machine": "VM-3125",
    "status": "Resolved",
    "raisedBy": "Consumer #6896",
    "createdDate": "2026-07-11",
    "updatedDate": "2026-07-11",
    "assignedTo": "Arjun Verma"
  }
];

export const CONSUMER_TICKET_STATUSES: string[] = ["Open","In Progress","Resolved","Closed"];
export const CONSUMER_TICKET_MACHINE: string[] = ["N/A","VM-1021","VM-1042","VM-2007","VM-2088","VM-3010","VM-3125"];
