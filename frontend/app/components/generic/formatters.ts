import { FieldDef } from './types';

export function formatValue(field: FieldDef, value: unknown): string {
  if (value === undefined || value === null || value === '') return '—';

  switch (field.kind) {
    case 'currency':
      return `₹${Number(value).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
    case 'signed': {
      const n = Number(value);
      const sign = n > 0 ? '+' : '';
      return `${sign}${n.toLocaleString('en-IN')}`;
    }
    case 'number':
      return Number(value).toLocaleString('en-IN');
    case 'datetime':
      return String(value).replace('T', ' ');
    default:
      return String(value);
  }
}
