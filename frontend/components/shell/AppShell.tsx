'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type NavItem = { label: string; href: string };
type NavGroup = { label: string; items: NavItem[] };
type NavSection = { label: string; groups: NavGroup[] };

// ---- your groups (analytics-report-exports) --------------------------
const ANALYTICS_NAV: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { label: 'All Analytics', href: '/analytics' },
      { label: 'Report', href: '/report' },
      { label: 'Exports', href: '/reports' },
      { label: 'Attendance Exports', href: '/exports/attendance-exports' },
    ],
  },
  {
    label: 'Business Performance',
    items: [
      { label: 'Sales Analytics', href: '/analytics/business-performance/sales' },
      { label: 'Org Sales', href: '/analytics/business-performance/big-sales' },
      { label: 'Transactions', href: '/analytics/business-performance/transactions' },
    ],
  },
  {
    label: 'Operations & Workforce',
    items: [
      { label: 'Refill Operations', href: '/analytics/operations-workforce/refill-operations' },
      { label: 'Attendance', href: '/analytics/operations-workforce/attendance' },
      { label: 'Org Attendance & Discipline', href: '/analytics/operations-workforce/org-attendance' },
      { label: 'Attendance Metrics', href: '/analytics/operations-workforce/attendance-metrics' },
      { label: 'Fleet Dashboard', href: '/analytics/operations-workforce/fleet' },
    ],
  },
  {
    label: 'Supply Chain',
    items: [
      { label: 'Org Procurement', href: '/analytics/supply-chain/org-procurement' },
      { label: 'Vendors Dashboard', href: '/analytics/supply-chain/vendors-dashboard' },
      { label: 'Inventory Risk', href: '/analytics/supply-chain/inventory-risk' },
      { label: 'Failure Analytics', href: '/analytics/supply-chain/failure-analytics' },
      { label: 'Shipment Analytics', href: '/analytics/supply-chain/shipment-analytics' },
    ],
  },
  {
    label: 'Entity Analysis',
    items: [
      { label: 'Supplier Analysis', href: '/analytics/supplier' },
      { label: 'Item Analysis', href: '/analytics/entity-analysis/item' },
      { label: 'Brand Analysis', href: '/analytics/entity-analysis/brand' },
      { label: 'Machine Analytics', href: '/analytics/machine' },
      { label: 'User Analytics', href: '/analytics/user' },
    ],
  },
  {
    label: 'Planning',
    items: [
      { label: 'Profit Optimization', href: '/analytics/profit-optimization' },
      { label: 'Custom Analytics', href: '/analytics/custom' },
    ],
  },
];

// ---- her groups (sarathi-labs-main / wendor-frontend) -----------------
const WENDOR_NAV: NavGroup[] = [
  {
    label: 'Sales Ledger',
    items: [
      { label: 'Orders', href: '/transactions/orders' },
      { label: 'Refunds', href: '/transactions/refunds' },
      { label: 'Ongoing & Requests', href: '/transactions/ongoing' },
      { label: 'Cancelled Carts', href: '/transactions/cancelled-cart' },
    ],
  },
  {
    label: 'Claims Desk',
    items: [
      { label: 'Expenses', href: '/transactions/claims/expenses' },
      { label: 'Reimbursements', href: '/transactions/claims/reimbursements' },
    ],
  },
  {
    label: 'Fleet & Stock',
    items: [
      { label: 'Product Catalogue', href: '/commerce/products' },
      { label: 'Stock Management', href: '/commerce/stock-management' },
      { label: 'Settlements', href: '/commerce/settlements' },
      { label: 'Wallet Users', href: '/commerce/wallet-users' },
    ],
  },
  {
    label: 'Accounts',
    items: [
      { label: 'Invoices', href: '/billing/invoices' },
      { label: 'Payment History', href: '/billing/payment-history' },
      { label: 'Credit History', href: '/billing/credit-history' },
    ],
  },
  {
    label: 'Help Desk',
    items: [
      { label: 'Service Tickets', href: '/support/service-tickets' },
      { label: 'Feature Requests', href: '/support/feature-requests' },
      { label: 'Ask the Console (AI)', href: '/support/ai-assistant' },
      { label: 'Consumer Help Center', href: '/support/consumer-help-center' },
      { label: 'Vendor Academy', href: '/support/vendor-academy' },
    ],
  },
];

// ---- top-level sections, switched via the top-right toggle -------------
const NAV_SECTIONS: NavSection[] = [
  { label: 'Analytics & Reports', groups: ANALYTICS_NAV },
  { label: 'Inventory & Transactions', groups: WENDOR_NAV },
];

function CoilMark() {
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

function itemIsActive(pathname: string, item: NavItem) {
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function groupIsActive(pathname: string, group: NavGroup) {
  return group.items.some((i) => itemIsActive(pathname, i));
}

function sectionForPath(pathname: string): NavSection | undefined {
  return NAV_SECTIONS.find((s) => s.groups.some((g) => groupIsActive(pathname, g)));
}

// ---- top-right segmented control: switches which section's sidebar shows
function SectionSwitcher({
  active,
  onChange,
}: {
  active: NavSection;
  onChange: (section: NavSection) => void;
}) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-neutral-200 bg-white p-0.5">
      {NAV_SECTIONS.map((section) => {
        const isActive = section.label === active.label;
        return (
          <button
            key={section.label}
            type="button"
            onClick={() => onChange(section)}
            className={`rounded-md px-3 py-1.5 font-body text-[12px] font-medium transition-colors ${
              isActive
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
          >
            {section.label}
          </button>
        );
      })}
    </div>
  );
}

// ---- sidebar: only renders the groups/items for the currently active section
function SidebarContent({
  section,
  pathname,
  onNavigate,
}: {
  section: NavSection;
  pathname: string;
  onNavigate?: () => void;
}) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(section.groups.map((g) => [g.label, true])),
  );

  // Reset open/closed state whenever the active section changes, so a
  // group left collapsed in one section doesn't carry over to the other.
  useEffect(() => {
    setOpenGroups(Object.fromEntries(section.groups.map((g) => [g.label, true])));
  }, [section]);

  const toggleGroup = (label: string) =>
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));

  return (
    <>
      <div className="flex items-center gap-2.5 px-5 pb-6 pt-5">
        <CoilMark />
        <div>
          <p className="font-display text-[13px] font-semibold tracking-wide text-shell-text">WENDOR</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-shell-muted">{section.label}</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-6">
        {section.groups.map((group) => {
          const open = openGroups[group.label];
          const active = groupIsActive(pathname, group);

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
                    const active = itemIsActive(pathname, item);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={onNavigate}
                          className={`flex items-center gap-2 rounded-md px-2.5 py-1.5 font-body text-[13px] transition-colors ${
                            active
                              ? 'bg-shell-raised text-amber-400'
                              : 'text-shell-text/80 hover:bg-shell-raised hover:text-shell-text'
                          }`}
                        >
                          <span
                            className={`h-1 w-1 rounded-full ${active ? 'bg-amber-400' : 'bg-shell-muted/60'}`}
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
  const all = NAV_SECTIONS.flatMap((s) => s.groups.flatMap((g) => g.items));
  const match = all.find((i) => itemIsActive(pathname, i));
  if (match) return match.label;
  if (pathname.startsWith('/reports')) return 'Exports';
  if (pathname.startsWith('/report')) return 'Report';
  return 'Analytics';
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';
  const [mobileOpen, setMobileOpen] = useState(false);

  // Default section is "Analytics & Reports" (NAV_SECTIONS[0]). If the
  // current route already belongs to a section, open on that one instead
  // so a deep link / refresh doesn't land you on the wrong sidebar.
  const [activeSection, setActiveSection] = useState<NavSection>(
    () => sectionForPath(pathname) ?? NAV_SECTIONS[0],
  );

  // Keep the switcher in sync if navigation happens some other way
  // (e.g. a link from within the page content jumps to the other section).
  useEffect(() => {
    const matched = sectionForPath(pathname);
    if (matched && matched.label !== activeSection.label) {
      setActiveSection(matched);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const title = pageTitleFromPath(pathname);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Desktop sidebar — shows only the active section's groups */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-shell-line bg-shell lg:flex">
        <SidebarContent section={activeSection} pathname={pathname} />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-shell">
            <SidebarContent
              section={activeSection}
              pathname={pathname}
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}

      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-neutral-200 bg-neutral-50/90 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
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
                {activeSection.label} /
              </span>
              <h2 className="font-display text-sm font-semibold text-neutral-900">{title}</h2>
            </div>
          </div>

          {/* Top-right section switcher */}
          <SectionSwitcher active={activeSection} onChange={setActiveSection} />
        </header>
        <main className="px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}