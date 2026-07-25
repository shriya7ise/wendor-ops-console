# Merge notes — analytics-report-exports + sarathi-labs-main

This project merges two repos that were already two halves of the same
product ("Wendor Ops Console"):

- **Yours** (`analytics-report-exports`) → Analytics, Report, Reports/Exports,
  Attendance Exports. Prisma + Postgres backed.
- **Hers** (`sarathi-labs-main`, `wendor-frontend`/`wendor-backend`) →
  Transactions, Claims, Commerce (Products/Stock/Settlements/Wallet Users),
  Billing, Support. In-memory mock-data backed (no DB yet).

Their route paths never collided, which made this far cleaner than a
typical merge. Verified with a full `next build` (all 55 routes present)
and a strict `tsc --noEmit` pass (her modules: 0 errors).

## What changed and why

### 1. Frontend routing
Her four top-level sections now live under `app/(wendor)/...` — a Next.js
**route group**. Route groups don't add a URL segment, so
`app/(wendor)/transactions/orders/page.tsx` is still served at
`/transactions/orders`, exactly as before. All her subpages (e.g.
Stock Management's 7 sub-sections) came across untouched.

### 2. One combined sidebar, collapsible groups
`components/shell/AppShell.tsx` now merges both nav lists (11 groups
total: your 6 + her 5) into one sidebar, per your call. Every group is
now collapsible with an up/down chevron (`lucide-react`'s
`ChevronUp`/`ChevronDown`) — the group containing the active page opens
by default. The header breadcrumb reads "Ops Console /" on her pages and
"Analytics /" on yours.

Her own `Sidebar.tsx` is **not** used in the merged app — it's still
sitting in the original zip if you ever want to reference it, but nothing
in the merged project renders it.

### 3. Her CSS/design — preserved via `.wendor-scope`
This was the trickiest part: your `globals.css` and hers both set
root-level styles (`body` background, `::selection`, `:focus-visible`),
and both `tailwind.config.ts` files define color tokens. A Next.js app
can only have one compiled stylesheet, so both configs had to become one.

**What was safe to merge directly:** her color tokens (`ink`, `panel`,
`line`, `accent`, `accent2`, `success`, `warn`, `danger`, `slate`) don't
share any key names with yours (`neutral`, `red`, `emerald`, `sky`,
`amber`, `shell`) — I added them into `theme.extend.colors` untouched, so
every class like `text-accent`, `bg-ink`, `border-line`, `text-slate-400`
works exactly as it did in her repo.

**The one real collision:** both configs override `borderRadius.xl`
(yours: 10px, hers: 5px). Since Tailwind config is global, both couldn't
win. Fix: her `rounded-lg`/`rounded-xl` usages (125 occurrences, only in
her files) were renamed to a new dedicated token, `rounded-console`
(5px), which doesn't touch the shared `xl` key at all. Nothing of yours
changed.

**Body-level styles (background, selection, focus ring, `.console-label`
typography, `.scrollbar-thin`):** these can't be scoped to a route group
via Tailwind config, so they were moved from the document root into a
`.wendor-scope` class in `app/globals.css`, applied only inside
`app/(wendor)/layout.tsx`. Net effect: her pages look pixel-identical to
her original repo; your pages are completely unaffected. The only
intentional, requested exception is the top header bar, which is now
shared unified chrome (light, with the combined sidebar) rather than her
original edge-to-edge dark layout — that's a consequence of "one combined
sidebar" rather than two.

### 4. `lib/api.ts`
Both files got concatenated. The only collision was the `API_BASE`
constant (same purpose, different env var name) — hers was dropped and
her ~90 fetch functions (`fetchOrders`, `fetchInvoicesList`, etc.) now
share your `API_BASE` (`NEXT_PUBLIC_API_BASE_URL`, set in
`frontend/.env.local`). No other function or type names collided.

### 5. Backend
Her 8 modules (`orders`, `refunds`, `ongoing`, `cancelled-cart`, `claims`,
`commerce/*`, `billing`, `support`) were copied into `backend/src/` and
registered in `app.module.ts` alongside your `AnalyticsModule`,
`ReportsModule`, `ReportModule`, `PrismaModule`. Verified: zero controller
route-prefix collisions with yours.

**Per your call, her modules stay on mock data for now** (their
`*.mock.ts` files, using the same deterministic-seed pattern as before —
copied over as `backend/src/common/mock.util.ts`, which several of her
services import). When you're ready to wire them to Prisma, that's a
separate, larger task (designing/migrating schemas for orders, refunds,
claims, products, settlements, wallet users, invoices, etc.) — happy to
help with that whenever you want to start.

**One real bug this merge surfaced:** her repo's `tsconfig.json` had
`noImplicitAny: false` and no full `strict` mode; yours has `strict:
true`. Under your stricter config, 15 of her DTO class properties failed
`strictPropertyInitialization` (e.g. `status: 'Active' | 'Inactive';` with
no initializer). Fixed with standard NestJS definite-assignment
assertions (`status!: 'Active' | 'Inactive';`) — same runtime behavior,
just satisfies the stricter compiler. Confirmed: her entire module set
now compiles with 0 errors under `strict: true`.

### 6. Dependencies
Only one new dependency was needed: `lucide-react` (her icon library,
used for the sidebar's icons and the new collapse chevrons). Backend
needed nothing new — her deps were a strict subset of yours. The
frontend's `package-lock.json` was removed since it's now stale; run
`npm install` to regenerate it.

## Known gaps / follow-ups

- **Prisma client**: this sandbox couldn't reach `binaries.prisma.sh` to
  run `npx prisma generate`, so I couldn't fully build-verify the
  Prisma-touching parts of your existing analytics backend (this is a
  pre-existing characteristic of your repo, not something the merge
  caused — confirmed by running the same type-check against your
  original, unmerged backend and getting an identical error set). Run
  `npm install && npx prisma generate` locally once you have normal
  network access, before `npm run start:dev`.
- **`backend/.env`** in this project contains a live Postgres connection
  string. Make sure it's in `.gitignore` (it already is) before pushing
  anywhere.
- A handful of her pages (`commerce/products`, `commerce/settlements`,
  `commerce/wallet-users`, `commerce/stock-management/stock-locations`)
  use bespoke components instead of the shared `GenericListPage` pattern
  her other pages use — that's inherited from her original repo as-is,
  not something this merge touched.

## Running it

```bash
# backend
cd backend
npm install
npx prisma generate   # needs real network access
npm run start:dev     # http://localhost:4000/api

# frontend (separate terminal)
cd frontend
npm install
npm run dev            # http://localhost:3000
```
