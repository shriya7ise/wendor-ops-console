'use client';
import { useState } from 'react';

function toISODate(d: Date) { return d.toISOString().slice(0, 10); }

export function useDateRange(defaultDays = 90) {
  const [from, setFrom] = useState(toISODate(new Date(Date.now() - defaultDays * 86_400_000)));
  const [to, setTo] = useState(toISODate(new Date()));
  const [granularity, setGranularity] = useState<'day' | 'week' | 'month'>('week');
  return { from, setFrom, to, setTo, granularity, setGranularity };
}
