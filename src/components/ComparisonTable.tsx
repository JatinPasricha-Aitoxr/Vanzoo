import { Reveal } from './ui/Reveal';

export type ComparisonRow = { label: string; values: readonly boolean[] };

/**
 * Two-column service comparison (§ Shirt product page "Which Service Should
 * You Choose?"). Renders as a real `<table>` from `sm:` up — the columns need
 * to stay aligned as a grid for the checkmarks to scan at a glance — and as a
 * stacked list of rows below that, where a table would force horizontal
 * scrolling on a 375px screen for no benefit (two columns, one row at a time
 * reads just as fast stacked).
 */
export function ComparisonTable({
  columns,
  rows,
}: {
  columns: readonly [string, string];
  rows: readonly ComparisonRow[];
}) {
  return (
    <Reveal
      variant="up"
      className="overflow-hidden rounded-card border border-neutral-line bg-white"
    >
      {/* Desktop / tablet: table */}
      <table className="hidden w-full border-collapse text-left sm:table">
        <thead>
          <tr className="border-b border-neutral-line bg-neutral-muted">
            <th scope="col" className="px-6 py-4 text-sm font-semibold text-neutral-body">
              &nbsp;
            </th>
            {columns.map((column) => (
              <th
                key={column}
                scope="col"
                className="px-6 py-4 text-center font-display text-base font-semibold text-brand"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row.label}
              className={index < rows.length - 1 ? 'border-b border-neutral-line' : undefined}
            >
              <th scope="row" className="px-6 py-4 text-sm font-medium text-neutral-ink">
                {row.label}
              </th>
              {row.values.map((value, columnIndex) => (
                <td key={columnIndex} className="px-6 py-4 text-center">
                  <Mark value={value} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile: each row as a compact card, columns side by side within it */}
      <ul className="divide-y divide-neutral-line sm:hidden">
        {rows.map((row) => (
          <li key={row.label} className="px-5 py-4">
            <p className="text-sm font-medium text-neutral-ink">{row.label}</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {columns.map((column, columnIndex) => (
                <div
                  key={column}
                  className="flex items-center justify-between gap-2 rounded-card bg-neutral-muted px-3 py-2"
                >
                  <span className="text-xs font-medium text-neutral-body">{column}</span>
                  <Mark value={row.values[columnIndex]} />
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

function Mark({ value }: { value: boolean }) {
  if (!value) {
    return (
      <span aria-label="Not included" className="inline-block text-neutral-line">
        —
      </span>
    );
  }
  return (
    <span
      aria-label="Included"
      className="inline-flex h-6 w-6 items-center justify-center rounded-pill bg-brand-light text-brand"
    >
      <svg viewBox="0 0 14 14" fill="none" className="h-3 w-3">
        <path
          d="M2.5 7.5 5.5 10.5 11.5 4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
