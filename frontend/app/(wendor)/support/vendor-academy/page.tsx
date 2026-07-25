'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchAcademySummary, fetchCourses } from '@/lib/api';
import { AcademySummary, Course } from '@/types/vendor-academy';
import { SummaryCards } from '@/app/components/ui/SummaryCards';
import { StatusPill, PillTone } from '@/app/components/ui/StatusPill';

const STATUS_TONE: Record<Course['status'], PillTone> = {
  'Not Started': 'neutral',
  'In Progress': 'warn',
  Completed: 'success',
};

// PRD 3.2.5 — Vendor Academy
export default function VendorAcademyPage() {
  const [summary, setSummary] = useState<AcademySummary | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchAcademySummary(), fetchCourses()])
      .then(([s, c]) => {
        setSummary(s);
        setCourses(c);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6">
          <p className="console-label text-xs text-accent">
            <Link href="/support/service-tickets" className="hover:underline">
              Support
            </Link>{' '}
            / PRD 3.2.5
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-100">Vendor Academy</h1>
          <p className="mt-1 text-sm text-slate-400">
            Structured onboarding and training resources for vendors and operational teams.
          </p>
        </header>

        {summary && (
          <div className="mb-6">
            <SummaryCards
              cards={[
                { label: 'Total Courses', value: summary.totalCourses },
                { label: 'Courses in Progress', value: summary.coursesInProgress },
                { label: 'Completed Courses', value: summary.completedCourses },
                { label: 'Completed Lessons', value: summary.completedLessons },
              ]}
            />
          </div>
        )}

        {loading && <p className="text-sm text-slate-500">Loading courses...</p>}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => {
            const pct = c.lessonsTotal ? Math.round((c.lessonsCompleted / c.lessonsTotal) * 100) : 0;
            return (
              <div key={c.id} className="flex flex-col gap-3 rounded-console border border-line bg-panel p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs uppercase tracking-wide text-slate-500">{c.category}</p>
                  <StatusPill label={c.status} tone={STATUS_TONE[c.status]} />
                </div>
                <h3 className="text-sm font-medium text-slate-100">{c.title}</h3>
                <p className="text-xs text-slate-500">
                  {c.lessonsTotal} lessons &middot; {c.durationMinutes} min
                </p>

                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-ink">
                  <div
                    className="h-full rounded-full bg-accent transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500">
                  {c.lessonsCompleted}/{c.lessonsTotal} lessons complete ({pct}%)
                </p>

                <button className="mt-1 rounded-console border border-line px-3 py-2 text-xs text-accent hover:border-accent">
                  {c.status === 'Not Started' ? 'Start Learning' : c.status === 'Completed' ? 'Review Course' : 'Continue Learning'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
