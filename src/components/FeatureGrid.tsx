import { RevealGroup } from './ui/Reveal';
import { cn } from '@/lib/cn';

export type FeatureGridItem = { title: string; body: string };

/**
 * Plain title + body card grid — the icon-less sibling of `IconFeatureGrid`,
 * for sections where the content is best carried by short, direct copy rather
 * than a repeated icon (collar/cuff/fabric detail lists, fabric-care notes,
 * audience blocks). Reuses the same card surface (`card-lift`, `rounded-card`)
 * so it reads as part of the same family wherever it sits next to icon cards.
 */
export function FeatureGrid({
  items,
  columns = 4,
  numbered = false,
  className,
}: {
  items: readonly FeatureGridItem[];
  columns?: 2 | 3 | 4 | 5;
  /** Shows a `01`-style index instead of a bullet — a lighter touch than an icon. */
  numbered?: boolean;
  className?: string;
}) {
  const columnClass = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
    5: 'sm:grid-cols-2 lg:grid-cols-5',
  }[columns];

  return (
    <RevealGroup as="ul" step={70} className={cn('grid grid-cols-1 gap-5', columnClass, className)}>
      {items.map((item, index) => (
        <li
          key={item.title}
          className="card-lift rounded-card border border-neutral-line bg-white p-6 hover:border-brand/35"
        >
          {numbered ? (
            <span className="font-display text-sm font-semibold tabular-nums text-accent-gold-ink">
              {String(index + 1).padStart(2, '0')}
            </span>
          ) : null}
          <h3 className={cn('font-display text-lg font-semibold text-neutral-ink', numbered && 'mt-2')}>
            {item.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-pretty text-neutral-body">{item.body}</p>
        </li>
      ))}
    </RevealGroup>
  );
}
