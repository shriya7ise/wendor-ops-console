'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { api } from '@/lib/api';

type MenuItem = { label: string; route: string; bestFor?: string; keywords?: string[] };
type MenuCategory = { name: string; items: MenuItem[] };
type Menu = { categories: MenuCategory[] };

// Step 4 (1.9.1): client-side search/filter over card name + keywords +
// "best for" copy. Backend already returns bestFor/keywords per item
// (see AnalyticsHubController.getMenu) — this page just filters on them,
// no extra round trip needed.
function matches(item: MenuItem, query: string) {
  if (!query) return true;
  const q = query.trim().toLowerCase();
  const haystack = [item.label, item.bestFor ?? '', ...(item.keywords ?? [])]
    .join(' ')
    .toLowerCase();
  return haystack.includes(q);
}

export default function AllAnalyticsPage() {
  const [menu, setMenu] = useState<Menu | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => { api.getAnalyticsMenu().then((res: any) => setMenu(res)); }, []);

  const filteredCategories = useMemo(() => {
    if (!menu) return [];
    return menu.categories
      .map((cat) => ({ ...cat, items: cat.items.filter((item) => matches(item, query)) }))
      .filter((cat) => cat.items.length > 0);
  }, [menu, query]);

  const totalMatches = filteredCategories.reduce((sum, c) => sum + c.items.length, 0);

  return (
    <div className="page-shell">
      <div>
        <h1 className="page-title">All Analytics</h1>
        <p className="text-sm text-neutral-500">Choose the right analytics page.</p>
      </div>

      <div className="max-w-md">
        <label htmlFor="analytics-search" className="sr-only">Search dashboards</label>
        <input
          id="analytics-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search dashboards by name or what they're for…"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
        />
        {query && (
          <p className="mt-1 text-xs text-neutral-500">
            {totalMatches} {totalMatches === 1 ? 'match' : 'matches'}
          </p>
        )}
      </div>

      {menu && filteredCategories.length === 0 && (
        <p className="text-sm text-neutral-500">No dashboards match "{query}".</p>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {filteredCategories.map((cat) => (
          <Card key={cat.name} title={cat.name}>
            <ul className="space-y-3">
              {cat.items.map((item) => (
                <li key={item.route}>
                  <Link href={item.route} className="text-sm font-medium text-amber-700 hover:text-amber-800 hover:underline">
                    {item.label}
                  </Link>
                  {item.bestFor && (
                    <p className="mt-0.5 text-xs text-neutral-500">{item.bestFor}</p>
                  )}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
