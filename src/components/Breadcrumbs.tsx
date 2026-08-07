import Link from 'next/link';
import { Icon } from './ui/Icon';
import { cn } from '@/lib/cn';

export type Crumb = { name: string; href: string };

/**
 * Breadcrumb trail for inner pages. Pairs with `breadcrumbSchema()` — pass the
 * same array to both so the visible trail and the structured data agree, which
 * is what Google requires for the breadcrumb rich result.
 *
 * The final crumb is the current page and is rendered as plain text, per the
 * WAI-ARIA breadcrumb pattern.
 */
export function Breadcrumbs({
  crumbs,
  tone = 'light',
}: {
  crumbs: readonly Crumb[];
  /** `onDark` for the photographic page headers. */
  tone?: 'light' | 'onDark';
}) {
  const trail = [{ name: 'Home', href: '/' }, ...crumbs];
  const dark = tone === 'onDark';

  return (
    <nav aria-label="Breadcrumb">
      <ol
        className={cn(
          'flex flex-wrap items-center gap-x-2 gap-y-1 text-sm',
          dark ? 'text-white/75' : 'text-neutral-body',
        )}
      >
        {trail.map((crumb, index) => {
          const isLast = index === trail.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-2">
              {isLast ? (
                <span
                  aria-current="page"
                  className={cn('font-medium', dark ? 'text-white' : 'text-neutral-ink')}
                >
                  {crumb.name}
                </span>
              ) : (
                <>
                  <Link
                    href={crumb.href}
                    className={cn(
                      'transition-colors duration-200',
                      dark ? 'hover:text-white' : 'hover:text-brand',
                    )}
                  >
                    {crumb.name}
                  </Link>
                  <Icon
                    name="chevronRight"
                    className={cn(
                      'text-[0.75rem]',
                      dark ? 'text-white/40' : 'text-neutral-line',
                    )}
                  />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
