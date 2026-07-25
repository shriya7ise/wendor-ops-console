interface Meta {
  page: number;
  totalPages: number;
  total: number;
}

export function Pagination({
  meta,
  onPageChange,
}: {
  meta: Meta;
  onPageChange: (page: number) => void;
}) {
  if (meta.totalPages === 0) return null;

  return (
    <div className="flex items-center justify-between border-t border-line px-4 py-3 text-sm text-slate-400">
      <span>
        Page {meta.page} of {meta.totalPages} &middot; {meta.total} results
      </span>
      <div className="flex gap-2">
        <button
          disabled={meta.page <= 1}
          onClick={() => onPageChange(meta.page - 1)}
          className="rounded-console border border-line px-3 py-1 disabled:opacity-30"
        >
          Prev
        </button>
        <button
          disabled={meta.page >= meta.totalPages}
          onClick={() => onPageChange(meta.page + 1)}
          className="rounded-console border border-line px-3 py-1 disabled:opacity-30"
        >
          Next
        </button>
      </div>
    </div>
  );
}
