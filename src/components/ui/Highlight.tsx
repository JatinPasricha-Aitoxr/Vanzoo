import { cn } from '@/lib/cn';

/**
 * Brand keywords picked out in headings across the site with a gold
 * highlighter-pen swipe. One list, so every page is formatted the
 * same way and a new keyword is a one-line edit.
 */
const KEYWORDS =
  /(Best & Premium|Vanzoo|Dry ?clean(?:ing|ers?)?|Gurgaon|Premium|Luxury|Hydrocarbon|Fabric Care|Couture|Sustainability|Free Pickup)/gi;

export function Highlight({
  text,
  dark = false,
  className,
}: {
  text: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <>
      {text.split(KEYWORDS).map((part, i) =>
        i % 2 === 1 ? (
          <span
            key={i}
            className={cn(
              // Marker-pen look: a gold swipe behind the word. On light
              // backgrounds it covers the lower ~60% of the line (text stays
              // dark); on dark ones it is a solid gold block with dark text.
              'rounded-[0.15em] px-[0.12em] [-webkit-box-decoration-break:clone] [box-decoration-break:clone]',
              dark
                ? 'bg-accent-gold text-brand-ink'
                : 'bg-[linear-gradient(transparent_42%,rgb(255_176_0/0.55)_42%,rgb(255_176_0/0.55)_92%,transparent_92%)] text-inherit',
              className,
            )}
          >
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

/** Highlight only when the heading is a plain string. */
export function highlightNode(node: React.ReactNode, dark: boolean): React.ReactNode {
  return typeof node === 'string' ? <Highlight text={node} dark={dark} /> : node;
}
