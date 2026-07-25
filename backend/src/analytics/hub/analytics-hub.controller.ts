import { Controller, Get } from '@nestjs/common';

// Analytics > All Analytics — the category picker landing page.
// Static manifest is enough here; each entry's route is a real, working
// endpoint elsewhere in this module.
//
// Step 4 (1.9.1): every card now also carries `bestFor` (one-line "who
// should use this" copy) and `keywords` (extra search terms beyond the
// label itself) so the frontend can run a client-side search/filter over
// name + keywords + bestFor without another round trip.
@Controller('analytics')
export class AnalyticsHubController {
  @Get('menu')
  getMenu() {
    return {
      categories: [
        {
          name: 'Business Performance',
          items: [
            {
              label: 'Sales Analytics',
              route: '/analytics/business-performance/sales',
              bestFor: 'Tracking day-to-day and hour-to-hour sales trends across the org.',
              keywords: ['revenue', 'sales', 'day-wise', 'hour-wise', 'trend'],
            },
            {
              label: 'Big Sales',
              route: '/analytics/business-performance/big-sales',
              bestFor: 'A single org-wide sales rollup — the same view as the top-level Report page.',
              keywords: ['org sales', 'report', 'revenue', 'rollup'],
            },
            {
              label: 'Transaction Analytics',
              route: '/analytics/business-performance/transactions',
              bestFor: 'Diagnosing transaction volume and failure patterns by day or hour.',
              keywords: ['transactions', 'payments', 'failures', 'day-wise', 'hour-wise'],
            },
          ],
        },
        {
          name: 'Operations & Workforce',
          items: [
            {
              label: 'Refill Operations',
              route: '/analytics/operations-workforce/refill-operations',
              bestFor: 'Warehouse managers checking who is refilling machines, and how regularly.',
              keywords: ['refill', 'refiller', 'warehouse', 'regularity', 'leaderboard'],
            },
            {
              label: 'Attendance Analytics',
              route: '/analytics/operations-workforce/attendance',
              bestFor: "A month-at-a-glance grid of every employee's daily check-in status.",
              keywords: ['attendance', 'grid', 'check-in', 'check-out', 'late'],
            },
            {
              label: 'Org Attendance & Discipline',
              route: '/analytics/operations-workforce/org-attendance',
              bestFor: 'HR reviewing org-wide punctuality and overtime trends by cluster.',
              keywords: ['discipline', 'overtime', 'late', 'cluster', 'compliance'],
            },
            {
              label: 'Attendance Metrics',
              route: '/analytics/operations-workforce/attendance-metrics',
              bestFor: 'Per-employee monthly attendance detail — missed days, late hours, in/out times.',
              keywords: ['attendance', 'metrics', 'member', 'monthly'],
            },
            {
              label: 'Fleet Dashboard',
              route: '/analytics/operations-workforce/fleet',
              bestFor: 'Field ops checking machine uptime and ranking clusters/warehouses by sales.',
              keywords: ['fleet', 'machines', 'uptime', 'status', 'state'],
            },
          ],
        },
        {
          name: 'Supply Chain',
          items: [
            {
              label: 'Org Procurement',
              route: '/analytics/supply-chain/org-procurement',
              bestFor: 'Procurement teams tracking fill rate, lead time, and PO approval delay.',
              keywords: ['procurement', 'purchase order', 'fill rate', 'approval', 'lead time'],
            },
            {
              label: 'US Vendors Dashboard',
              route: '/analytics/supply-chain/vendors-dashboard',
              bestFor: 'Ranking vendors by delivery reliability and pricing.',
              keywords: ['vendors', 'suppliers', 'ranking'],
            },
            {
              label: 'Org Inventory Risk',
              route: '/analytics/supply-chain/inventory-risk',
              bestFor: 'Spotting products and warehouses about to run out of stock.',
              keywords: ['inventory', 'risk', 'stockout', 'stock-on-hand'],
            },
            {
              label: 'Failure Analytics',
              route: '/analytics/supply-chain/failure-analytics',
              bestFor: 'Maintenance teams triaging machine failures by rate and lost revenue.',
              keywords: ['failure', 'downtime', 'slots', 'lost revenue'],
            },
            {
              label: 'Shipment Analytics',
              route: '/analytics/supply-chain/shipment-analytics',
              bestFor: 'Tracking inbound shipments and delivery timelines.',
              keywords: ['shipment', 'delivery', 'logistics'],
            },
          ],
        },
        {
          name: 'Entity Analysis',
          items: [
            {
              label: 'Supplier Analysis',
              route: '/analytics/supplier',
              bestFor: 'A deep-dive health score and insights for one supplier at a time.',
              keywords: ['supplier', 'health score', 'search'],
            },
            {
              label: 'Single Item Analysis',
              route: '/analytics/entity-analysis/item',
              bestFor: "A deep-dive into one SKU's sales and refill performance.",
              keywords: ['item', 'sku', 'product', 'search'],
            },
            {
              label: 'Brand Analysis',
              route: '/analytics/entity-analysis/brand',
              bestFor: "Category managers comparing a brand's sales, refills, and supply pipeline.",
              keywords: ['brand', 'category', 'supply', 'stockout'],
            },
          ],
        },
        {
          name: 'Machine Analytics',
          items: [{
            label: 'Machine Analytics',
            route: '/analytics/machine',
            bestFor: "A single machine's sales, slot, and temperature performance.",
            keywords: ['machine', 'vending', 'slot', 'temperature', 'search'],
          }],
        },
        {
          name: 'User Analytics',
          items: [{
            label: 'User Analytics',
            route: '/analytics/user',
            bestFor: "Looking up one employee's refill trips, attendance, and activity history.",
            keywords: ['user', 'employee', 'activity', 'search'],
          }],
        },
        {
          name: 'Profit Optimization',
          items: [{
            label: 'Profit Optimization',
            route: '/analytics/profit-optimization',
            bestFor: 'Getting per-SKU recommendations to improve margin, week by week or month by month.',
            keywords: ['profit', 'optimization', 'recommendations', 'sku'],
          }],
        },
        {
          name: 'Custom Analytics',
          items: [{
            label: 'Custom Analytics',
            route: '/analytics/custom',
            bestFor: 'Building an ad-hoc view when none of the standard pages fit.',
            keywords: ['custom', 'ad-hoc', 'builder'],
          }],
        },
        {
          name: 'Reports & Exports',
          items: [
            {
              label: 'All Exports',
              route: '/reports',
              bestFor: 'Generating and downloading any export type, plus scheduling recurring ones.',
              keywords: ['exports', 'downloads', 'scheduled reports', 'csv'],
            },
            {
              label: 'Attendance Exports',
              route: '/exports/attendance-exports',
              bestFor: 'Payroll/HR pulling attendance and register sheets for a cluster and date range.',
              keywords: ['attendance', 'export', 'register', 'payroll'],
            },
          ],
        },
      ],
    };
  }
}
