import Link from 'next/link';
import { StockSubSection } from '../sub-sections';

export function ComingSoonScreen({ section }: { section: StockSubSection }) {
  return (
    <main className="px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6">
          <p className="text-xs uppercase tracking-widest text-accent">
            <Link href="/commerce/stock-management" className="hover:underline">
              Stock Management
            </Link>{' '}
            / PRD {section.prdRef}
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-100">{section.label}</h1>
          <p className="mt-1 text-sm text-slate-400">{section.description}</p>
        </header>

        <div className="rounded-console border border-dashed border-line bg-panel/60 p-6">
          <p className="mb-4 text-sm text-slate-400">
            This screen is scaffolded and routed, but not wired to real data
            yet — it&apos;s next in line. Planned columns, per the PRD:
          </p>
          <div className="flex flex-wrap gap-2">
            {section.columns.map((col) => (
              <span
                key={col}
                className="rounded-full border border-line bg-ink px-3 py-1 text-xs text-slate-300"
              >
                {col}
              </span>
            ))}
          </div>
        </div>

        <Link
          href="/commerce/stock-management"
          className="mt-4 inline-block text-sm text-accent hover:underline"
        >
          &larr; Back to Stock Management Overview
        </Link>
      </div>
    </main>
  );
}
