import { cn } from '@/lib/cn';

/**
 * Inline SVG icon set.
 *
 * One registry rather than SVGs scattered through components: the same arrow
 * was previously redrawn in four files, and each copy had drifted. Icons are
 * inlined rather than sprited or fetched — they ship as part of the HTML, so
 * there is no request, no flash of missing icon, and they inherit `currentColor`
 * and font size from their context.
 *
 * All paths are drawn on a 24×24 grid with a 1.6 stroke, round caps and joins,
 * so they sit together at any size. Brand marks are the exception: those are
 * filled and drawn to their own official geometry.
 *
 * Accessibility: icons are decorative by default (`aria-hidden`), because in
 * every use here the adjacent text already says what they mean. Pass a `title`
 * only when an icon is genuinely the sole label for a control.
 */

export type IconName = keyof typeof PATHS;

const STROKE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

/** Icons drawn as filled shapes — brand marks and the star glyph. */
const FILLED = new Set<IconName>([
  'facebook',
  'instagram',
  'youtube',
  'whatsapp',
  'linkedin',
  'x',
  'googlePlay',
  'apple',
  'star',
]);

/**
 * Only icons that are actually used are kept here. This is one object literal,
 * so every entry ships whether or not it is referenced — an unused glyph is
 * dead weight in the bundle, not a free option.
 */
const PATHS = {
  /* --- navigation & control ------------------------------------------- */
  arrowRight: <path d="M4 12h15m0 0-5.5-5.5M19 12l-5.5 5.5" />,
  chevronRight: <path d="m9.5 5 7 7-7 7" />,
  chevronDown: <path d="m5 9.5 7 7 7-7" />,
  check: <path d="m4.5 12.5 5 5 10-11" />,
  externalLink: (
    <>
      <path d="M14 4h6v6" />
      <path d="M20 4 11 13" />
      <path d="M18 14.5V19a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 19V8a1.5 1.5 0 0 1 1.5-1.5H10" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),

  /* --- contact & location --------------------------------------------- */
  phone: (
    <path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z" />
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="m3.8 7 7.1 5.4a2 2 0 0 0 2.2 0L20.2 7" />
    </>
  ),
  mapPin: (
    <>
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  navigation: <path d="M20.5 3.5 3.9 10.2c-.9.4-.8 1.7.1 2l6.4 2 2 6.4c.3.9 1.6 1 2-.1Z" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5.2l3.2 2" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5.5" width="17" height="15" rx="2" />
      <path d="M3.5 10h17M8 3.5v4M16 3.5v4" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5.5M12 7.8v.4" />
    </>
  ),

  /* --- proposition ----------------------------------------------------- */
  shieldCheck: (
    <>
      <path d="M12 3 5 6v5.5c0 4.4 3 8.1 7 9.5 4-1.4 7-5.1 7-9.5V6Z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </>
  ),
  flaskOff: (
    <>
      <path d="M9.5 3.5h5M10.5 3.5V10L5.6 18a2 2 0 0 0 1.7 3h9.4a2 2 0 0 0 1.7-3l-4.9-8V3.5" />
      <path d="m4 4 16 16" />
    </>
  ),
  cpu: (
    <>
      <rect x="8" y="8" width="8" height="8" rx="1.5" />
      <rect x="4.5" y="4.5" width="15" height="15" rx="2.5" />
      <path d="M9.5 4.5v-2M14.5 4.5v-2M9.5 21.5v-2M14.5 21.5v-2M4.5 9.5h-2M4.5 14.5h-2M21.5 9.5h-2M21.5 14.5h-2" />
    </>
  ),
  truck: (
    <>
      <path d="M3 6.5h10.5v10H3zM13.5 9.5H17l3 3v4h-6.5z" />
      <circle cx="7" cy="18" r="1.9" />
      <circle cx="17" cy="18" r="1.9" />
    </>
  ),
  bolt: <path d="M13.5 3 5 13.5h5.5L10 21l8.5-10.5H13Z" />,
  leaf: (
    <>
      <path d="M20 4c0 9-5.2 13-10 13a5.4 5.4 0 0 1-5.4-5.4C4.6 7.5 10.5 4 20 4Z" />
      <path d="M4.5 20c2-4.5 5-7.6 9.5-10" />
    </>
  ),
  /* Rosette: medal disc over two ribbon tails. */
  award: (
    <>
      <circle cx="12" cy="9" r="5.4" />
      <path d="m8.7 13.7-1.4 7 4.7-2.7 4.7 2.7-1.4-7" />
    </>
  ),
  sparkles: (
    <>
      <path d="m12 3 1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8Z" />
      <path d="m18.6 15.4.9 2.3 2.3.9-2.3.9-.9 2.3-.9-2.3-2.3-.9 2.3-.9Z" />
    </>
  ),
  star: (
    <path d="M12 2.2 15 8.6l6.7.9-4.9 4.7 1.3 6.8L12 17.4 5.9 21l1.3-6.8L2.3 9.5l6.7-.9Z" />
  ),

  /* --- garment categories ----------------------------------------------
   * These carry the most meaning at the smallest sizes (16px in the tariff
   * chips), so each is drawn with one silhouette and at most two interior
   * strokes. Anything finer disappears and the glyph turns into a blob.
   */
  shirt: (
    <path d="M8.5 3 12 6.2 15.5 3l4 2.1L21 9.3l-3 1V21H6V10.3l-3-1 1.5-4.2Z" />
  ),
  /* Sleeveless A-line: shoulder points, a V neckline, a marked waist and a
     flared skirt. The earlier version was too narrow and read as a flask. */
  dress: (
    <>
      <path d="M9 3.5 12 5.9l3-2.4.3 6.6 3.2 10.4H5.5L8.7 10.1Z" />
      <path d="M8.7 10.1h6.6" />
    </>
  ),
  /* Blazer: squared shoulders, a V lapel and a centre opening. Drawn as one
     block rather than two tapering panels — those read as a pair of legs. */
  jacket: (
    <>
      <path d="M7.2 3.5 3.6 5.7v14.8h16.8V5.7L16.8 3.5Z" />
      <path d="M7.2 3.5 12 9.1l4.8-5.6" />
      <path d="M12 9.1v11.4" />
    </>
  ),
  bed: (
    <>
      <path d="M3 18.5v-5.2a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5.2M3 18.5h18M3 18.5v2.2M21 18.5v2.2" />
      <path d="M7 11.3V8.2a1.5 1.5 0 0 1 1.5-1.5h7A1.5 1.5 0 0 1 17 8.2v3.1" />
    </>
  ),
  /* Side profile with a rising toe and two lace strokes — the flat wedge it
     replaced read as a ramp. */
  shoe: (
    <>
      <path d="M3 18.8h16.4a1.7 1.7 0 0 0 1.6-2.2c-.7-2-2.5-3.1-5-3.5l-4.2-.7-3.4-2.9H3Z" />
      <path d="m9.6 12.4-1.4 1.5M12.4 12.9l-1.4 1.5" />
    </>
  ),
  bag: (
    <>
      <path d="M4.2 7.8h15.6L18.3 20.5H5.7Z" />
      <path d="M8.8 7.8V6a3.2 3.2 0 1 1 6.4 0v1.8" />
    </>
  ),

  /* --- brand marks (filled) -------------------------------------------- */
  facebook: (
    <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6c-.29-.04-1.27-.12-2.4-.12-2.38 0-4 1.45-4 4.11v2.3H7.6V13h2.7v8h3.2Z" />
  ),
  instagram: (
    <path d="M12 2.9c2.96 0 3.31.01 4.48.06 1.08.05 1.67.23 2.06.38.52.2.89.44 1.28.83.39.39.63.76.83 1.28.15.39.33.98.38 2.06.05 1.17.06 1.52.06 4.48s-.01 3.31-.06 4.48c-.05 1.08-.23 1.67-.38 2.06-.2.52-.44.89-.83 1.28-.39.39-.76.63-1.28.83-.39.15-.98.33-2.06.38-1.17.05-1.52.06-4.48.06s-3.31-.01-4.48-.06c-1.08-.05-1.67-.23-2.06-.38-.52-.2-.89-.44-1.28-.83-.39-.39-.63-.76-.83-1.28-.15-.39-.33-.98-.38-2.06C2.91 15.31 2.9 14.96 2.9 12s.01-3.31.06-4.48c.05-1.08.23-1.67.38-2.06.2-.52.44-.89.83-1.28.39-.39.76-.63 1.28-.83.39-.15.98-.33 2.06-.38C8.69 2.91 9.04 2.9 12 2.9Zm0 5.02a4.08 4.08 0 1 0 0 8.16 4.08 4.08 0 0 0 0-8.16Zm0 6.73a2.65 2.65 0 1 1 0-5.3 2.65 2.65 0 0 1 0 5.3Zm5.19-6.89a.95.95 0 1 1-1.9 0 .95.95 0 0 1 1.9 0Z" />
  ),
  youtube: (
    <path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77C22 15.2 22 12 22 12s0-3.2-.4-4.8ZM10 15.06V8.94L15.2 12 10 15.06Z" />
  ),
  whatsapp: (
    <path d="M12.04 2.5a9.4 9.4 0 0 0-8 14.34L2.5 21.5l4.79-1.5A9.4 9.4 0 1 0 12.04 2.5Zm0 1.7a7.7 7.7 0 1 1-4.03 14.26l-.3-.18-2.83.89.9-2.76-.19-.31A7.7 7.7 0 0 1 12.04 4.2Zm-3.2 3.6c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.44 1.03 2.6c.13.17 1.76 2.8 4.34 3.81 2.14.84 2.58.68 3.05.63.46-.04 1.5-.6 1.71-1.2.21-.58.21-1.08.15-1.19-.06-.1-.23-.16-.48-.28-.25-.13-1.5-.74-1.73-.82-.23-.09-.4-.13-.57.12-.17.25-.65.82-.8.99-.14.16-.29.19-.54.06-.25-.12-1.07-.4-2.03-1.25-.75-.67-1.26-1.5-1.4-1.75-.15-.25-.02-.38.11-.5.11-.12.25-.3.37-.44.13-.15.17-.25.25-.42.09-.17.05-.31-.02-.44-.06-.12-.56-1.37-.77-1.87-.2-.49-.4-.42-.56-.43h-.47Z" />
  ),
  linkedin: (
    <path d="M6.94 8.5V20H3.5V8.5h3.44Zm.22-3.3c0 1-.75 1.8-1.94 1.8h-.02C4.05 7 3.3 6.2 3.3 5.2c0-1.02.77-1.8 1.98-1.8s1.86.78 1.88 1.8ZM20.5 20h-3.44v-6.15c0-1.55-.55-2.6-1.94-2.6-1.06 0-1.69.71-1.97 1.4-.1.25-.13.59-.13.94V20H9.58s.05-10.44 0-11.5h3.44v1.63c.46-.7 1.28-1.71 3.1-1.71 2.27 0 3.98 1.48 3.98 4.66V20Z" />
  ),
  x: (
    <path d="M17.53 3h3.2l-6.99 7.98L22 21h-6.44l-5.04-6.6L4.75 21h-3.2l7.48-8.54L1.7 3h6.6l4.56 6.03L17.53 3Zm-1.12 16.08h1.77L7.67 4.83H5.77l10.64 14.25Z" />
  ),
  googlePlay: (
    <path d="M3.6 2.6c-.3.3-.5.8-.5 1.4v16c0 .6.2 1.1.5 1.4l.1.1 9-9v-.2l-9-9-.1.1Zm12.2 5.9L5.4 2.4l8.8 8.8 1.6-1.6v-1.1Zm2.9 2.1-2.2-1.3-1.8 1.8 1.8 1.8 2.2-1.3c.7-.4.7-1.2 0-1.6ZM5.4 21.6l10.4-6.1-1.6-1.6-8.8 7.7Z" />
  ),
  apple: (
    <path d="M16.4 12.6c0-2.2 1.8-3.3 1.9-3.3-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.7.8-3.3.8-.7 0-1.7-.8-2.8-.8-1.5 0-2.8.8-3.5 2.1-1.5 2.6-.4 6.5 1.1 8.6.7 1 1.6 2.2 2.7 2.2 1.1 0 1.5-.7 2.8-.7s1.6.7 2.8.7c1.1 0 1.9-1 2.6-2.1.8-1.2 1.2-2.4 1.2-2.5-.1 0-2.3-.9-2.3-3.3ZM14.3 6.2c.6-.7 1-1.7.9-2.7-.9 0-2 .6-2.6 1.3-.6.6-1.1 1.7-.9 2.6 1 .1 2-.5 2.6-1.2Z" />
  ),
} as const;

export function Icon({
  name,
  className,
  title,
  strokeWidth,
}: {
  name: IconName;
  className?: string;
  /** Supply only when the icon is the sole label for a control. */
  title?: string;
  strokeWidth?: number;
}) {
  const filled = FILLED.has(name);
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('h-[1em] w-[1em] shrink-0', className)}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      {...(filled
        ? { fill: 'currentColor' }
        : { ...STROKE, ...(strokeWidth ? { strokeWidth } : {}) })}
    >
      {PATHS[name]}
    </svg>
  );
}

/**
 * Icon in a tinted round badge — the treatment used beside contact details,
 * store addresses and result messages.
 */
export function IconBadge({
  name,
  className,
  tone = 'brand',
  size = 'md',
}: {
  name: IconName;
  className?: string;
  tone?: 'brand' | 'onDark' | 'success' | 'muted';
  size?: 'sm' | 'md' | 'lg';
}) {
  const tones = {
    brand: 'bg-brand-light text-brand',
    onDark: 'bg-white/10 text-accent-gold-soft',
    success: 'bg-success/10 text-success',
    muted: 'bg-neutral-muted text-neutral-body',
  } as const;

  const sizes = {
    sm: 'h-8 w-8 text-[0.875rem]',
    md: 'h-10 w-10 text-[1.125rem]',
    lg: 'h-12 w-12 text-[1.375rem]',
  } as const;

  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-pill',
        tones[tone],
        sizes[size],
        className,
      )}
    >
      <Icon name={name} />
    </span>
  );
}
