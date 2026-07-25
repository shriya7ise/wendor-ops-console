export function DataTable({ columns, rows, emptyLabel = 'No rows available for this table.' }: {
  columns: { key: string; label: string; align?: 'left' | 'right' }[];
  rows: Record<string, React.ReactNode>[];
  emptyLabel?: string;
}) {
  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-10 text-center">
        <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
        <p className="font-body text-sm text-neutral-400">{emptyLabel}</p>
      </div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-left">
            {columns.map((c) => (
              <th
                key={c.key}
                className={`whitespace-nowrap py-2 font-mono text-[10px] font-medium uppercase tracking-[0.06em] text-neutral-400 ${c.align === 'right' ? 'text-right' : 'text-left'}`}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
              {columns.map((c) => (
                <td key={c.key} className={`py-2.5 font-body text-neutral-800 ${c.align === 'right' ? 'text-right font-mono tabular-nums' : 'text-left'}`}>
                  {row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
