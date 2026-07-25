# Analytics + Report + All Exports

Complete build of the three areas requested: the full **Analytics** tree (17
pages across 8 categories), the top-level **Report** page (Org Sales), and
**All Exports** with all 6 export types wired to real queries + a Scheduled
Reports (recurring export) system.

Every page follows the same shape as the source app (filters → KPIs → trend
chart(s) → tables) but adds a layer the original didn't have: Supplier
Analysis gets a health score + auto-generated insights, Profit Optimization
gets real per-SKU recommendations, Inventory Risk gets an at-risk supplier
flag — not just numbers, actual "so what" logic.

## Layout

```
backend/    NestJS API
frontend/   Next.js pages
```

## Backend setup

```bash
cd backend
npm install
cp .env.example .env      # set DATABASE_URL
npx prisma migrate dev --name init
npm run prisma:seed       # gives every page real demo data
npm run start:dev         # http://localhost:4000/api
```

Every controller reads `req.orgId` — wire that to your auth guard (one line
per controller, ~20 controllers total).

## Route map (backend endpoint → frontend page)

### Analytics
| Page | Backend | Frontend |
|---|---|---|
| All Analytics (hub) | `GET /analytics/menu` | `/analytics` |
| Sales Analytics | `GET /analytics/business-performance/sales-analytics` | `/analytics/business-performance/sales` |
| Big Sales (Org Sales) | `GET /analytics/business-performance/big-sales` | `/analytics/business-performance/big-sales` |
| Transaction Analytics | `GET /analytics/business-performance/transaction-analytics` | `/analytics/business-performance/transactions` |
| Refill Operations | `GET /analytics/operations-workforce/refill-operations` | `/analytics/operations-workforce/refill-operations` |
| Attendance Analytics | `GET /analytics/operations-workforce/attendance-analytics` | `/analytics/operations-workforce/attendance` |
| Org Attendance & Discipline | `GET /analytics/operations-workforce/org-attendance` | `/analytics/operations-workforce/org-attendance` |
| Attendance Metrics | `GET /analytics/operations-workforce/attendance-metrics` | `/analytics/operations-workforce/attendance-metrics` |
| Fleet Dashboard | `GET /analytics/operations-workforce/fleet-dashboard` | `/analytics/operations-workforce/fleet` |
| Org Procurement | `GET /analytics/supply-chain/org-procurement` | `/analytics/supply-chain/org-procurement` |
| US Vendors Dashboard | `GET /analytics/supply-chain/vendors-dashboard` | `/analytics/supply-chain/vendors-dashboard` |
| Org Inventory Risk | `GET /analytics/supply-chain/inventory-risk` | `/analytics/supply-chain/inventory-risk` |
| Failure Analytics | `GET /analytics/supply-chain/failure-analytics` | `/analytics/supply-chain/failure-analytics` |
| Shipment Analytics | `GET /analytics/supply-chain/shipment-analytics` | `/analytics/supply-chain/shipment-analytics` |
| Supplier Analysis | `GET /analytics/supplier` (+`/search`) | `/analytics/supplier` |
| Single Item Analysis | `GET /analytics/entity-analysis/item` (+`/search`) | `/analytics/entity-analysis/item` |
| Brand Analysis | `GET /analytics/entity-analysis/brand` (+`/search`) | `/analytics/entity-analysis/brand` |
| Machine Analytics | `GET /analytics/machine` (+`/search`) | `/analytics/machine` |
| User Analytics | `GET /analytics/user` (+`/search`) | `/analytics/user` |
| Profit Optimization | `GET /analytics/profit-optimization` | `/analytics/profit-optimization` |
| Custom Analytics | `GET /analytics/custom` | `/analytics/custom` |

### Report (top-level, not under Analytics)
| Page | Backend | Frontend |
|---|---|---|
| Report | `GET /report` | `/report` |

This reuses `BusinessPerformanceService.getOrgSales()` — the recordings
showed the same filter/table shape on both the standalone "Report" nav item
and Analytics > Business Performance > Big Sales, so it's one implementation
exposed on two routes rather than duplicated logic. Split it if your product
actually wants divergent metrics later.

### All Exports
| Type | Backend | Notes |
|---|---|---|
| Employee Reports | `POST /reports/exports {type: EMPLOYEE_REPORT}` | real query (Transaction × Employee) |
| Transaction Downloads | `{type: TRANSACTION_DOWNLOAD}` | real query |
| Wallet User Downloads | `{type: WALLET_USER_DOWNLOAD}` | real query |
| Attendance Exports | `{type: ATTENDANCE_EXPORT, filters: {clusterId?, from?, to?, variant?}}` | real query — `variant: 'sheet' \| 'register'` selects between the two dedicated-page outputs |
| Machine Locations Map | `{type: MACHINE_LOCATIONS}` | real query |
| Scheduled Reports | `{type: SCHEDULED_REPORT}` export, plus full CRUD at `/reports/schedules` | recurring config, separate from one-off jobs |

List/download: `GET /reports/exports`, `GET /reports/exports/:id/download`.
Frontend: `/reports` (tabbed by type, live status polling).

**Attendance Exports now also has its own dedicated page** (1.11 in the
gap-closure doc — previously it only existed as one entry in the generic
list above): `GET /reports/attendance-exports/summary` (status color-key +
preview, shares `classifyAttendance` with the CSV generator so the on-screen
key always matches the download) and `GET /reports/attendance-exports/clusters`,
frontend at `/exports/attendance-exports`. Still creates/lists jobs through
the same `/reports/exports` endpoints above — this page just adds the
spec's filter bar, color key, and the second "Register Sheet" output.

Job lifecycle (PENDING → PROCESSING → COMPLETED/FAILED) runs in-process;
swap `ReportsService.process()` for a BullMQ/SQS consumer when volume needs
it — the `ExportJob` row is already shaped for a queue.

`ReportSchedule` rows are CRUD-only in this pass (create/list/toggle) — the
actual cron trigger that turns a due schedule into an `ExportJob` is a
5-minute add (`@nestjs/schedule` cron reading `nextRunAt <= now`) once you
want it running for real; left out since it needs a decision on your job
runner infra.

## Frontend setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev   # http://localhost:3000/analytics
```

## What's approximated, on purpose

- **Machine Analytics temperature** — no IoT/sensor model in scope; shows
  the same "no data" empty state the source app itself showed in the
  recording, rather than fabricating readings.

## Step 1 schema fixes (`20260718180000_step1_schema_fixes`)

The gaps below were previously "approximated, on purpose" — they're now
fixed at the schema level. Run `npx prisma migrate dev` to apply.

- **`Refill.employeeId`** — refills now carry who performed them. Unblocks
  Refill Operations' Unique Refillers / Top Warehouses / Regularity
  Leaderboard / Time-of-Day & Day-of-Week charts, and fixes User Analytics'
  Refill Trips, Refill Quantity, and Machines Serviced, which previously
  always read 0. Nullable — backfill historical rows where you can, but new
  refills should always set it going forward.
- **`PurchaseOrder.approvedAt` / `approvedBy`** — Org Procurement's Approval
  Delay chart, avg approval delay, and pending-approval count are now real
  queries instead of a missing widget.
- **`FailureEvent.slot`** — backs the Slots tab and Slot vs. Failures chart
  on Failure Analytics. Failure Rate and Lost Revenue still need to be
  computed against expected per-machine revenue (see the Analytics &
  Reports gap-closure doc) — that's a service-layer pass, not a schema one.
- **`WarehouseLedgerEntry` / `WarehouseStock`** (new tables) — a real
  inbound/outbound/adjustment movement ledger plus a current on-hand
  snapshot per warehouse+product. This is what **Org Inventory Risk** needs
  to move off its old fill-rate approximation onto real
  Products-at-Risk/Warehouse-Risk numbers, and what **Org Warehouses
  Analytics** (currently missing entirely) will be built on. Neither
  service has been rewired to the new tables yet in this pass — only the
  schema, migration, and seed data are in place; wiring the services and
  building the Org Warehouses page is the next step.

`prisma/seed.ts` populates all of the above with realistic demo data,
including one intentionally OUT-of-stock product, one LOW-stock product,
and one flagged ledger anomaly, so the eventual UI has something to show
immediately after `npm run prisma:seed`.

## Step 2: the 3 missing pages

These had no route and no service at all before this pass:

- **Org Attendance & Discipline** (1.9.7) — org-wide compliance rollup:
  Present/Missed Days, Late Check-ins, Missed Check-outs, Overtime Hours,
  Avg Hours/Day, plus Worst-by-{missed days, late check-ins, missed
  check-out, lowest hours} and Best-by-{attendance, punctuality} leaderboards.
  `OperationsWorkforceService.getOrgAttendanceDiscipline()`.
  **Approximation flagged in code:** "expected working days" per employee
  is calendar days in range (no shift-roster model), same pattern as Org
  Inventory Risk's old approximation — swap in a real roster if/when one
  exists.
- **Attendance Metrics** (1.9.8) — per-employee monthly table (Missed
  Attendance Days, Avg Late Hours, Avg In/Out Time, Avg Working Hours,
  Missing In/Out, Earliest In, Latest Out), filterable by month + a
  multi-select member search (reuses the existing `/analytics/user/search`
  endpoint). `OperationsWorkforceService.getAttendanceMetrics()`.
- **Attendance Exports** (1.11) — previously only one entry on the generic
  exports list; now its own page at `/exports/attendance-exports` with a
  Cluster + Start/End Date filter bar, a live status color-key (On Time /
  Late Check-In / Early-Missed Check-Out / Overtime / Pending — see
  `classifyAttendance()` in `common/analytics.util.ts`, shared by both the
  on-screen preview and the actual CSV), two distinct export buttons
  (Attendance Sheet vs. Register Sheet), and its own history table.

All three attendance-family pages (this section, Attendance Analytics from
before, and Attendance Exports) now share the same `classifyAttendance`
late/overtime/missed-checkout thresholds from `common/analytics.util.ts` —
change the definition once, it's consistent everywhere.

**Not done in this pass:** these three pages read Attendance/Employee data
that already existed — no schema changes were needed for Step 2. Fleet
Dashboard, Failure Analytics, Brand Analysis, and Org Warehouses Analytics
are still open from the earlier gap-closure doc (Step 3 territory).

## Type-checking note

`tsc --noEmit` passes clean on both repos in this sandbox except for
Prisma-client-derived types, which only exist after `prisma generate`
downloads its query engine — blocked here by network egress rules, not a
code issue. Run `npx prisma generate` locally after `npm install` and those
resolve.
