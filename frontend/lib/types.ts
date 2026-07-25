export type Granularity = 'day' | 'week' | 'month';

export interface SupplierOption {
  id: string;
  name: string;
  code: string | null;
}

export interface SupplierKpis {
  poCount: number;
  orderedQty: number;
  receivedQty: number;
  orderedValue: number;
  receivedValue: number;
  fillRate: number;
  qtyVariance: number;
  valueVariance: number;
  cancelledPOs: number;
  partialPOs: number;
  fullyReceivedPOs: number;
  avgLeadTimeDays: number;
  leadTimeStdDevDays: number;
}

export interface Insight {
  level: 'info' | 'warning' | 'critical';
  message: string;
}

export interface SupplierAnalysis {
  supplier: { id: string; name: string; code: string | null };
  range: { from: string; to: string; granularity: Granularity };
  kpis: SupplierKpis;
  trend: {
    orderedValueDeltaPct: number | null;
    fillRateDeltaPts: number;
    leadTimeDeltaDays: number;
  };
  healthScore: { score: number; tier: 'A' | 'B' | 'C' | 'D' };
  insights: Insight[];
  procurementTrend: { label: string; qty: number; value: number }[];
  fillRateTrend: { label: string; fillRate: number | null }[];
  leadTimeDistribution: { label: string; count: number }[];
  refillsByMachine: { name: string; refillQty: number; refillEvents: number; activeDays: number }[];
  refillsByItem: { name: string; refillQty: number; refillEvents: number; activeDays: number }[];
  refillRegularity: {
    machine: string;
    events: number;
    weeksActive: number;
    weeksWithRefill: number;
    regularityScorePct: number;
  }[];
}

export type ExportType =
  | 'EMPLOYEE_REPORT'
  | 'SCHEDULED_REPORT'
  | 'TRANSACTION_DOWNLOAD'
  | 'WALLET_USER_DOWNLOAD'
  | 'ATTENDANCE_EXPORT'
  | 'MACHINE_LOCATIONS'
  | 'SUPPLIER_ANALYSIS';

export type ExportStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface ExportJob {
  id: string;
  type: ExportType;
  status: ExportStatus;
  requestedBy: string;
  rowCount: number | null;
  createdAt: string;
  completedAt: string | null;
  errorMessage: string | null;
}
