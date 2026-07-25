const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface AnalyticsMenuItem {
  label: string;
  route: string;
}

export interface AnalyticsCategory {
  name: string;
  items: AnalyticsMenuItem[];
}

export interface AnalyticsMenuResponse {
  categories: AnalyticsCategory[];
}

export interface Cluster {
  id: string;
  name: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `Request failed: ${res.status}`);
  }

  return res.json();
}

function qs(params: Record<string, string | number | undefined> = {}) {
  const q = new URLSearchParams();

  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') {
      q.set(k, String(v));
    }
  });

  return q.toString();
}

export const api = {
  // Entity Analysis — Supplier
  searchSuppliers: (q: string) =>
    request(`/analytics/supplier/search?q=${encodeURIComponent(q)}`),

  getSupplierAnalysis: (params: Record<string, any>) =>
    request(`/analytics/supplier?${qs(params)}`),

  // Entity Analysis — Item / Brand
  searchItems: (q: string) =>
    request(`/analytics/entity-analysis/item/search?q=${encodeURIComponent(q)}`),

  getItemAnalysis: (params: Record<string, any>) =>
    request(`/analytics/entity-analysis/item?${qs(params)}`),

  searchBrands: (q: string) =>
    request(`/analytics/entity-analysis/brand/search?q=${encodeURIComponent(q)}`),

  getBrandAnalysis: (params: Record<string, any>) =>
    request(`/analytics/entity-analysis/brand?${qs(params)}`),

  listBrandWarehouses: () =>
    request(`/analytics/entity-analysis/brand/warehouses`),

  // Business Performance
  getSalesAnalytics: (params: Record<string, any> = {}) =>
    request(`/analytics/business-performance/sales-analytics?${qs(params)}`),

  getBigSales: (params: Record<string, any> = {}) =>
    request(`/analytics/business-performance/big-sales?${qs(params)}`),

  getTransactionAnalytics: (params: Record<string, any> = {}) =>
    request(`/analytics/business-performance/transaction-analytics?${qs(params)}`),

  // Operations & Workforce
  getRefillOperations: (params: Record<string, any> = {}) =>
    request(`/analytics/operations-workforce/refill-operations?${qs(params)}`),

  getAttendanceAnalytics: (params: Record<string, any> = {}) =>
    request(`/analytics/operations-workforce/attendance-analytics?${qs(params)}`),

  getOrgAttendance: (params: Record<string, any> = {}) =>
    request(`/analytics/operations-workforce/org-attendance?${qs(params)}`),

  getAttendanceMetrics: (params: Record<string, any> = {}) =>
    request(`/analytics/operations-workforce/attendance-metrics?${qs(params)}`),

  // ✅ FIXED
  getClusters: () =>
    request<Cluster[]>(`/analytics/operations-workforce/clusters`),

  getFleetDashboard: (params: Record<string, any> = {}) =>
    request(`/analytics/operations-workforce/fleet-dashboard?${qs(params)}`),

  // Supply Chain
  getOrgProcurement: (params: Record<string, any> = {}) =>
    request(`/analytics/supply-chain/org-procurement?${qs(params)}`),

  getVendorsDashboard: (params: Record<string, any> = {}) =>
    request(`/analytics/supply-chain/vendors-dashboard?${qs(params)}`),

  getInventoryRisk: (params: Record<string, any> = {}) =>
    request(`/analytics/supply-chain/inventory-risk?${qs(params)}`),

  getFailureAnalytics: (params: Record<string, any> = {}) =>
    request(`/analytics/supply-chain/failure-analytics?${qs(params)}`),

  getShipmentAnalytics: (params: Record<string, any> = {}) =>
    request(`/analytics/supply-chain/shipment-analytics?${qs(params)}`),

  // Machine / User / Profit / Custom
  searchMachines: (q: string) =>
    request(`/analytics/machine/search?q=${encodeURIComponent(q)}`),

  getMachineAnalytics: (params: Record<string, any>) =>
    request(`/analytics/machine?${qs(params)}`),

  searchUsers: (q: string) =>
    request(`/analytics/user/search?q=${encodeURIComponent(q)}`),

  getUserAnalytics: (params: Record<string, any>) =>
    request(`/analytics/user?${qs(params)}`),

  getProfitOptimization: (params: Record<string, any>) =>
    request(`/analytics/profit-optimization?${qs(params)}`),

  getCustomAnalytics: () =>
    request(`/analytics/custom`),

  getAnalyticsMenu: () =>
    request<AnalyticsMenuResponse>(`/analytics/menu`),

  // Reports
  getReport: (params: Record<string, any> = {}) =>
    request(`/report?${qs(params)}`),

  // Exports
  listExports: (params: Record<string, any> = {}) =>
    request(`/reports/exports?${qs(params)}`),

  createExport: (type: string, filters: Record<string, unknown> = {}) =>
    request(`/reports/exports`, {
      method: 'POST',
      body: JSON.stringify({ type, filters }),
    }),

  downloadExportUrl: (id: string) =>
    `${API_BASE}/reports/exports/${id}/download`,

  listSchedules: () =>
    request(`/reports/schedules`),

  createSchedule: (body: Record<string, unknown>) =>
    request(`/reports/schedules`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  // Attendance Exports
  getAttendanceExportClusters: () =>
    request(`/reports/attendance-exports/clusters`),

  getAttendanceExportSummary: (params: Record<string, any> = {}) =>
    request(`/reports/attendance-exports/summary?${qs(params)}`),
};
// ===========================================================================
// Her (sarathi-labs-main / wendor-frontend) API client — orders, refunds,
// claims, commerce, billing, support. Uses the same API_BASE declared above.
// Talks to the mock-data modules merged into backend/src/{orders,billing,...}.
// ===========================================================================

import { BaseQuery } from '@/types/common';
import { GenericFilterOptions, GenericListResponse, GenericQuery } from '@/app/components/generic/types';
import { AiConversation, AiPersona } from '@/types/ai-assistant';
import { AcademySummary, Course } from '@/types/vendor-academy';
import {
  Order,
  OrderFilterOptions,
  OrderListResponse,
  OrderQuery,
} from '@/types/order';
import {
  Refund,
  RefundFilterOptions,
  RefundListResponse,
  RefundQuery,
} from '@/types/refund';
import {
  OngoingFilterOptions,
  OngoingListResponse,
  OngoingQuery,
  OngoingTransaction,
} from '@/types/ongoing';
import {
  CancelledCartFilterOptions,
  CancelledCartItem,
  CancelledCartListResponse,
  CancelledCartQuery,
} from '@/types/cancelled-cart';
import {
  Product,
  ProductFilterOptions,
  ProductListResponse,
  ProductQuery,
  ProductStatus,
} from '@/types/product';
import { StockOverview } from '@/types/stock-overview';
import {
  StockLocation,
  StockLocationFilterOptions,
  StockLocationListResponse,
  StockLocationQuery,
} from '@/types/stock-location';
import {
  BulkAssignInput,
  CreateSettlementInput,
  Settlement,
  SettlementFilterOptions,
  SettlementListResponse,
  SettlementQuery,
} from '@/types/settlement';
import {
  BulkAddWalletUsersInput,
  CreateWalletUserInput,
  TopupInput,
  WalletUser,
  WalletUserFilterOptions,
  WalletUserListResponse,
  WalletUserQuery,
} from '@/types/wallet-user';

type Row = { id: string; [key: string]: unknown };

function buildQuery(query: BaseQuery): string {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== null) {
      params.set(key, String(value));
    }
  });
  return params.toString();
}

async function getJson<T>(path: string, query?: BaseQuery): Promise<T> {
  const qs = query ? `?${buildQuery(query)}` : '';
  const res = await fetch(`${API_BASE}${path}${qs}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Request failed: ${path}`);
  return res.json();
}

async function patchJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Request failed: ${path}`);
  return res.json();
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const payload = await res.json().catch(() => null);
    throw new Error(payload?.message ?? `Request failed: ${path}`);
  }
  return res.json();
}

// ---- Orders (PRD 2.1.1.1) ----
export const fetchOrders = (query: OrderQuery) =>
  getJson<OrderListResponse>('/transactions/orders', query);
export const fetchOrderFilters = () =>
  getJson<OrderFilterOptions>('/transactions/orders/filters');
export const fetchOrderDetail = (id: string) =>
  getJson<Order>(`/transactions/orders/${id}`);

// ---- Refunds (PRD 2.1.1.2) ----
export const fetchRefunds = (query: RefundQuery) =>
  getJson<RefundListResponse>('/transactions/refunds', query);
export const fetchRefundFilters = () =>
  getJson<RefundFilterOptions>('/transactions/refunds/filters');
export const fetchRefundDetail = (id: string) =>
  getJson<Refund>(`/transactions/refunds/${id}`);

// ---- Ongoing Transactions & Requests (PRD 2.1.1.3) ----
export const fetchOngoing = (query: OngoingQuery) =>
  getJson<OngoingListResponse>('/transactions/ongoing', query);
export const fetchOngoingFilters = () =>
  getJson<OngoingFilterOptions>('/transactions/ongoing/filters');
export const fetchOngoingDetail = (id: string) =>
  getJson<OngoingTransaction>(`/transactions/ongoing/${id}`);

// ---- Cancelled Cart (PRD 2.1.1.4) ----
export const fetchCancelledCart = (query: CancelledCartQuery) =>
  getJson<CancelledCartListResponse>('/transactions/cancelled-cart', query);
export const fetchCancelledCartFilters = () =>
  getJson<CancelledCartFilterOptions>('/transactions/cancelled-cart/filters');
export const fetchCancelledCartDetail = (id: string) =>
  getJson<CancelledCartItem>(`/transactions/cancelled-cart/${id}`);
export const cancelledCartExportUrl = (query: CancelledCartQuery) =>
  `${API_BASE}/transactions/cancelled-cart/export?${buildQuery(query)}`;

// ---- Products (PRD 2.2.1) ----
export const fetchProducts = (query: ProductQuery) =>
  getJson<ProductListResponse>('/commerce/products', query);
export const fetchProductFilters = () =>
  getJson<ProductFilterOptions>('/commerce/products/filters');
export const fetchProductDetail = (id: string) =>
  getJson<Product>(`/commerce/products/${id}`);
export const updateProductStatus = (id: string, status: ProductStatus) =>
  patchJson<Product>(`/commerce/products/${id}/status`, { status });

// ---- Stock Management: Overview (PRD 2.2.2.1) ----
export const fetchStockOverview = () =>
  getJson<StockOverview>('/commerce/stock-management/overview');

// ---- Stock Management: Stock Locations (PRD 2.2.2.2) ----
export const fetchStockLocations = (query: StockLocationQuery) =>
  getJson<StockLocationListResponse>('/commerce/stock-management/stock-locations', query);
export const fetchStockLocationFilters = () =>
  getJson<StockLocationFilterOptions>('/commerce/stock-management/stock-locations/filters');
export const fetchStockLocationDetail = (id: string) =>
  getJson<StockLocation>(`/commerce/stock-management/stock-locations/${id}`);

// ---- Settlements (PRD 2.2.3) ----
export const fetchSettlements = (query: SettlementQuery) =>
  getJson<SettlementListResponse>('/commerce/settlements', query);
export const fetchSettlementFilters = () =>
  getJson<SettlementFilterOptions>('/commerce/settlements/filters');
export const fetchSettlementDetail = (id: string) =>
  getJson<Settlement>(`/commerce/settlements/${id}`);
export const createSettlement = (input: CreateSettlementInput) =>
  postJson<Settlement>('/commerce/settlements', input);
export const bulkAssignMachines = (input: BulkAssignInput) =>
  postJson<Settlement>('/commerce/settlements/bulk-assign', input);
export const updateSettlementStatus = (id: string, status: 'Active' | 'Inactive') =>
  patchJson<Settlement>(`/commerce/settlements/${id}/status`, { status });

// ---- Wallet Users (PRD 2.2.4) ----
export const fetchWalletUsers = (query: WalletUserQuery) =>
  getJson<WalletUserListResponse>('/commerce/wallet-users', query);
export const fetchWalletUserFilters = () =>
  getJson<WalletUserFilterOptions>('/commerce/wallet-users/filters');
export const fetchWalletUserDetail = (id: string) =>
  getJson<WalletUser>(`/commerce/wallet-users/${id}`);
export const createWalletUser = (input: CreateWalletUserInput) =>
  postJson<WalletUser>('/commerce/wallet-users', input);
export const bulkAddWalletUsers = (input: BulkAddWalletUsersInput) =>
  postJson<{ created: WalletUser[]; skipped: string[] }>(
    '/commerce/wallet-users/bulk-add',
    input,
  );
export const updateWalletUserStatus = (id: string, status: 'Active' | 'Blocked') =>
  patchJson<WalletUser>(`/commerce/wallet-users/${id}/status`, { status });
export const topupWalletUser = (id: string, input: TopupInput) =>
  patchJson<WalletUser>(`/commerce/wallet-users/${id}/topup`, input);

// ---- Items in Stock Locations (PRD 2.2.2.3) ----
export const fetchItemsInStockList = (query: GenericQuery) =>
  getJson<GenericListResponse<Row>>('/commerce/stock-management/items-in-stock', query as BaseQuery);
export const fetchItemsInStockFilters = () =>
  getJson<GenericFilterOptions>('/commerce/stock-management/items-in-stock/filters');
export const fetchItemsInStockDetail = (id: string) =>
  getJson<Row>(`/commerce/stock-management/items-in-stock/${id}`);

// ---- Vendors (PRD 2.2.2.4) ----
export const fetchVendorsList = (query: GenericQuery) =>
  getJson<GenericListResponse<Row>>('/commerce/stock-management/vendors', query as BaseQuery);
export const fetchVendorsFilters = () =>
  getJson<GenericFilterOptions>('/commerce/stock-management/vendors/filters');
export const fetchVendorsDetail = (id: string) =>
  getJson<Row>(`/commerce/stock-management/vendors/${id}`);

// ---- Purchase Orders (PRD 2.2.2.5) ----
export const fetchPurchaseOrdersList = (query: GenericQuery) =>
  getJson<GenericListResponse<Row>>('/commerce/stock-management/purchase-orders', query as BaseQuery);
export const fetchPurchaseOrdersFilters = () =>
  getJson<GenericFilterOptions>('/commerce/stock-management/purchase-orders/filters');
export const fetchPurchaseOrdersDetail = (id: string) =>
  getJson<Row>(`/commerce/stock-management/purchase-orders/${id}`);

// ---- Return Orders (PRD 2.2.2.6) ----
export const fetchReturnOrdersList = (query: GenericQuery) =>
  getJson<GenericListResponse<Row>>('/commerce/stock-management/return-orders', query as BaseQuery);
export const fetchReturnOrdersFilters = () =>
  getJson<GenericFilterOptions>('/commerce/stock-management/return-orders/filters');
export const fetchReturnOrdersDetail = (id: string) =>
  getJson<Row>(`/commerce/stock-management/return-orders/${id}`);

// ---- Stock Transfers (PRD 2.2.2.7) ----
export const fetchStockTransfersList = (query: GenericQuery) =>
  getJson<GenericListResponse<Row>>('/commerce/stock-management/stock-transfers', query as BaseQuery);
export const fetchStockTransfersFilters = () =>
  getJson<GenericFilterOptions>('/commerce/stock-management/stock-transfers/filters');
export const fetchStockTransfersDetail = (id: string) =>
  getJson<Row>(`/commerce/stock-management/stock-transfers/${id}`);

// ---- Stock Audits (PRD 2.2.2.8) ----
export const fetchStockAuditsList = (query: GenericQuery) =>
  getJson<GenericListResponse<Row>>('/commerce/stock-management/stock-audits', query as BaseQuery);
export const fetchStockAuditsFilters = () =>
  getJson<GenericFilterOptions>('/commerce/stock-management/stock-audits/filters');
export const fetchStockAuditsDetail = (id: string) =>
  getJson<Row>(`/commerce/stock-management/stock-audits/${id}`);

// ---- Day End Stock (PRD 2.2.2.9) ----
export const fetchDayEndStockList = (query: GenericQuery) =>
  getJson<GenericListResponse<Row>>('/commerce/stock-management/day-end-stock', query as BaseQuery);
export const fetchDayEndStockFilters = () =>
  getJson<GenericFilterOptions>('/commerce/stock-management/day-end-stock/filters');
export const fetchDayEndStockDetail = (id: string) =>
  getJson<Row>(`/commerce/stock-management/day-end-stock/${id}`);

// ---- Stock Location Ledger (PRD 2.2.2.10) ----
export const fetchStockLocationLedgerList = (query: GenericQuery) =>
  getJson<GenericListResponse<Row>>('/commerce/stock-management/stock-location-ledger', query as BaseQuery);
export const fetchStockLocationLedgerFilters = () =>
  getJson<GenericFilterOptions>('/commerce/stock-management/stock-location-ledger/filters');
export const fetchStockLocationLedgerDetail = (id: string) =>
  getJson<Row>(`/commerce/stock-management/stock-location-ledger/${id}`);

// ---- Expenses (PRD 2.1.2.1) ----
export const fetchExpensesList = (query: GenericQuery) =>
  getJson<GenericListResponse<Row>>('/transactions/claims/expenses', query as BaseQuery);
export const fetchExpensesFilters = () =>
  getJson<GenericFilterOptions>('/transactions/claims/expenses/filters');
export const fetchExpensesDetail = (id: string) =>
  getJson<Row>(`/transactions/claims/expenses/${id}`);

// ---- Reimbursements (PRD 2.1.2.2) ----
export const fetchReimbursementsList = (query: GenericQuery) =>
  getJson<GenericListResponse<Row>>('/transactions/claims/reimbursements', query as BaseQuery);
export const fetchReimbursementsFilters = () =>
  getJson<GenericFilterOptions>('/transactions/claims/reimbursements/filters');
export const fetchReimbursementsDetail = (id: string) =>
  getJson<Row>(`/transactions/claims/reimbursements/${id}`);

// ---- Invoices (PRD 3.1.1) ----
export const fetchInvoicesList = (query: GenericQuery) =>
  getJson<GenericListResponse<Row>>('/billing/invoices', query as BaseQuery);
export const fetchInvoicesFilters = () =>
  getJson<GenericFilterOptions>('/billing/invoices/filters');
export const fetchInvoicesDetail = (id: string) =>
  getJson<Row>(`/billing/invoices/${id}`);

// ---- Payment History (PRD 3.1.2) ----
export const fetchPaymentHistoryList = (query: GenericQuery) =>
  getJson<GenericListResponse<Row>>('/billing/payment-history', query as BaseQuery);
export const fetchPaymentHistoryFilters = () =>
  getJson<GenericFilterOptions>('/billing/payment-history/filters');
export const fetchPaymentHistoryDetail = (id: string) =>
  getJson<Row>(`/billing/payment-history/${id}`);

// ---- Credit History (PRD 3.1.3) ----
export const fetchCreditHistoryList = (query: GenericQuery) =>
  getJson<GenericListResponse<Row>>('/billing/credit-history', query as BaseQuery);
export const fetchCreditHistoryFilters = () =>
  getJson<GenericFilterOptions>('/billing/credit-history/filters');
export const fetchCreditHistoryDetail = (id: string) =>
  getJson<Row>(`/billing/credit-history/${id}`);

// ---- Service Tickets (PRD 3.2.1) ----
export const fetchServiceTicketsList = (query: GenericQuery) =>
  getJson<GenericListResponse<Row>>('/support/service-tickets', query as BaseQuery);
export const fetchServiceTicketsFilters = () =>
  getJson<GenericFilterOptions>('/support/service-tickets/filters');
export const fetchServiceTicketsDetail = (id: string) =>
  getJson<Row>(`/support/service-tickets/${id}`);

// ---- Feature Requests (PRD 3.2.2) ----
export const fetchFeatureRequestsList = (query: GenericQuery) =>
  getJson<GenericListResponse<Row>>('/support/feature-requests', query as BaseQuery);
export const fetchFeatureRequestsFilters = () =>
  getJson<GenericFilterOptions>('/support/feature-requests/filters');
export const fetchFeatureRequestsDetail = (id: string) =>
  getJson<Row>(`/support/feature-requests/${id}`);

// ---- Consumer Help Center (PRD 3.2.4) ----
export const fetchConsumerHelpCenterList = (query: GenericQuery) =>
  getJson<GenericListResponse<Row>>('/support/consumer-help-center', query as BaseQuery);
export const fetchConsumerHelpCenterFilters = () =>
  getJson<GenericFilterOptions>('/support/consumer-help-center/filters');
export const fetchConsumerHelpCenterDetail = (id: string) =>
  getJson<Row>(`/support/consumer-help-center/${id}`);

// ---- AI Assistant (PRD 3.2.3) ----
export const fetchAiPersonas = () => getJson<AiPersona[]>('/support/ai-assistant/personas');
export const fetchAiSuggestedPrompts = () =>
  getJson<string[]>('/support/ai-assistant/suggested-prompts');
export const fetchAiConversations = () =>
  getJson<AiConversation[]>('/support/ai-assistant/conversations');
export const fetchAiConversation = (id: string) =>
  getJson<AiConversation>(`/support/ai-assistant/conversations/${id}`);
export const startAiConversation = (personaId?: string) =>
  postJson<AiConversation>(`/support/ai-assistant/conversations${personaId ? `?personaId=${personaId}` : ''}`, {});
export const askAi = (input: { question: string; conversationId?: string; personaId?: string }) =>
  postJson<AiConversation>('/support/ai-assistant/ask', input);

// ---- Vendor Academy (PRD 3.2.5) ----
export const fetchAcademySummary = () => getJson<AcademySummary>('/support/vendor-academy/summary');
export const fetchCourses = () => getJson<Course[]>('/support/vendor-academy/courses');
export const fetchCourse = (id: string) => getJson<Course>(`/support/vendor-academy/courses/${id}`);
