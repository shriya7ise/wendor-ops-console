'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type NavItem = { label: string; href: string };
type NavGroup = { label: string; items: NavItem[] };

// ==================== ANALYTICS & REPORTS ====================
const ANALYTICS_NAV: NavGroup[] = [
  {
    label: 'Analytics & Reports',
    items: [
      // Overview
      { label: 'All Analytics', href: '/analytics' },
      { label: 'Report', href: '/report' },
      { label: 'Exports', href: '/reports' },
      { label: 'Attendance Exports', href: '/exports/attendance-exports' },

      // Business Performance
      { label: 'Sales Analytics', href: '/analytics/business-performance/sales' },
      { label: 'Org Sales', href: '/analytics/business-performance/big-sales' },
      { label: 'Transactions', href: '/analytics/business-performance/transactions' },

      // Operations & Workforce
      { label: 'Refill Operations', href: '/analytics/operations-workforce/refill-operations' },
      { label: 'Attendance', href: '/analytics/operations-workforce/attendance' },
      { label: 'Org Attendance & Discipline', href: '/analytics/operations-workforce/org-attendance' },
      { label: 'Attendance Metrics', href: '/analytics/operations-workforce/attendance-metrics' },
      { label: 'Fleet Dashboard', href: '/analytics/operations-workforce/fleet' },

      // Supply Chain
      { label: 'Org Procurement', href: '/analytics/supply-chain/org-procurement' },
      { label: 'Vendors Dashboard', href: '/analytics/supply-chain/vendors-dashboard' },
      { label: 'Inventory Risk', href: '/analytics/supply-chain/inventory-risk' },
      { label: 'Failure Analytics', href: '/analytics/supply-chain/failure-analytics' },
      { label: 'Shipment Analytics', href: '/analytics/supply-chain/shipment-analytics' },

      // Entity Analysis
      { label: 'Supplier Analysis', href: '/analytics/supplier' },
      { label: 'Item Analysis', href: '/analytics/entity-analysis/item' },
      { label: 'Brand Analysis', href: '/analytics/entity-analysis/brand' },
      { label: 'Machine Analytics', href: '/analytics/machine' },
      { label: 'User Analytics', href: '/analytics/user' },

      // Planning
      { label: 'Profit Optimization', href: '/analytics/profit-optimization' },
      { label: 'Custom Analytics', href: '/analytics/custom' },
    ],
  },
];

// ==================== INVENTORY & TRANSACTIONS ====================
const WENDOR_NAV: NavGroup[] = [
  {
    label: 'Inventory & Transactions',
    items: [
      // Sales Ledger
      { label: 'Orders', href: '/transactions/orders' },
      { label: 'Refunds', href: '/transactions/refunds' },
      { label: 'Ongoing & Requests', href: '/transactions/ongoing' },
      { label: 'Cancelled Carts', href: '/transactions/cancelled-cart' },

      // Claims Desk
      { label: 'Expenses', href: '/transactions/claims/expenses' },
      { label: 'Reimbursements', href: '/transactions/claims/reimbursements' },

      // Fleet & Stock
      { label: 'Product Catalogue', href: '/commerce/products' },
      { label: 'Stock Management', href: '/commerce/stock-management' },
      { label: 'Settlements', href: '/commerce/settlements' },
      { label: 'Wallet Users', href: '/commerce/wallet-users' },

      // Accounts
      { label: 'Invoices', href: '/billing/invoices' },
      { label: 'Payment History', href: '/billing/payment-history' },
      { label: 'Credit History', href: '/billing/credit-history' },

      // Help Desk
      { label: 'Service Tickets', href: '/support/service-tickets' },
      { label: 'Feature Requests', href: '/support/feature-requests' },
      { label: 'Ask the Console (AI)', href: '/support/ai-assistant' },
      { label: 'Consumer Help Center', href: '/support/consumer-help-center' },
      { label: 'Vendor Academy', href: '/support/vendor-academy' },
    ],
  },
];

const NAV: NavGroup[] = [...ANALYTICS_NAV, ...WENDOR_NAV];
const WENDOR_GROUP_LABELS = new Set(WENDOR_NAV.map((g) => g.label));

function CoilMark() {
  // Signature mark: a 3x3 dot grid, a nod to a vending machine's coil layout.
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((col) => (
          <circle
            key={`${row}-${col}`}
            cx={3 + col * 6}
            cy={3 + row * 6}
            r={1.4}
            fill={row === 0 && col === 2 ? '#C77D22' : '#4A5361'}
          />
        )),
      )}
    </svg>
  );
}

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const groupIsActive = (group: NavGroup) => group.items.some((i) => pathname === i.href || pathname.startsWith(`${i.href}/`));

  // Every group starts open on first render if it contains the active
  // route, otherwise open by default too (11 groups is a lot, but this
  // matches "combined sidebar" over "hide everything" — collapse what
  // you don't need).
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(NAV.map((g) => [g.label, true])),
  );

  const toggleGroup = (label: string) =>
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));

  return (
    <>
      <div className="flex items-center gap-2.5 px-5 pb-6 pt-5">
        <CoilMark />
        <div>
          <p className="font-display text-[13px] font-semibold tracking-wide text-shell-text">WENDOR</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-shell-muted">Ops Console</p>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 pb-6">
        {NAV.map((group) => {
          const open = openGroups[group.label];
          const active = groupIsActive(group);
          return (
            <div key={group.label} className="mb-2">
              <button
                type="button"
                onClick={() => toggleGroup(group.label)}
                className={`mb-1 flex w-full items-center justify-between rounded-md px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.12em] transition-colors ${
                  active ? 'text-shell-text' : 'text-shell-muted hover:text-shell-text'
                }`}
                aria-expanded={open}
              >
                <span>{group.label}</span>
                {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
              {open && (
                <ul className="space-y-0.5 pb-3">
                  {group.items.map((item) => {
                    const itemActive = pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={onNavigate}
                          className={`flex items-center gap-2 rounded-md px-2.5 py-1.5 font-body text-[13px] transition-colors ${
                            itemActive
                              ? 'bg-shell-raised text-amber-400'
                              : 'text-shell-text/80 hover:bg-shell-raised hover:text-shell-text'
                          }`}
                        >
                          <span
                            className={`h-1 w-1 rounded-full ${itemActive ? 'bg-amber-400' : 'bg-shell-muted/60'}`}
                            aria-hidden="true"
                          />
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>
      <div className="border-t border-shell-line px-5 py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-shell-muted">Demo Org · WH-1</p>
      </div>
    </>
  );
}

function pageTitleFromPath(pathname: string): string {
  const all = NAV.flatMap((g) => g.items);
  const match = all.find((i) => pathname === i.href || pathname.startsWith(`${i.href}/`));
  if (match) return match.label;
  if (pathname.startsWith('/reports')) return 'Exports';
  if (pathname.startsWith('/report')) return 'Report';
  return 'Analytics';
}

function sectionLabelFromPath(pathname: string): string {
  const group = NAV.find((g) => g.items.some((i) => pathname === i.href || pathname.startsWith(`${i.href}/`)));
  if (group && WENDOR_GROUP_LABELS.has(group.label)) return 'Ops Console /';
  return 'Analytics /';
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';
  const [mobileOpen, setMobileOpen] = useState(false);
  const title = pageTitleFromPath(pathname);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-shell-line bg-shell lg:flex">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-shell">
            <SidebarContent pathname={pathname} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-neutral-200 bg-neutral-50/90 px-4 backdrop-blur sm:px-6">
          <button
            className="rounded-md border border-neutral-200 bg-white p-1.5 text-neutral-600 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M1.5 4h13M1.5 8h13M1.5 12h13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-400">
              {sectionLabelFromPath(pathname)}
            </span>
            <h2 className="font-display text-sm font-semibold text-neutral-900">{title}</h2>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
