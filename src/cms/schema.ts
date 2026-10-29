import { z } from 'zod';

/**
 * Page document model. A page is a versioned tree of blocks; each block has a
 * widget type, validated props, a style map and responsive overrides.
 * Desktop is the base; `tablet` applies at <= BREAKPOINTS.tablet and `mobile` at
 * <= BREAKPOINTS.mobile, so a mobile tweak never rewrites the desktop layout.
 */
const liveDesign = () => (globalThis as { __vzDesign?: Record<string, string> }).__vzDesign;
const inRange = (v: unknown, lo: number, hi: number, fallback: number) => {
  const n = Number(v);
  return Number.isInteger(n) && n >= lo && n <= hi ? n : fallback;
};
/** Responsive breakpoints; editable in Design (defaults 1023 / 639). Read at call time from the live design settings. */
export const BREAKPOINTS = {
  get tablet(): number {
    return inRange(liveDesign()?.['bp-tablet'], 768, 1279, 1023);
  },
  get mobile(): number {
    return inRange(liveDesign()?.['bp-mobile'], 480, 767, 639);
  },
};
export type Device = 'desktop' | 'tablet' | 'mobile';

/** CSS properties the editor may set. Anything else is dropped on save. */
export const STYLE_PROPS: Record<string, string> = {
  width: 'width', maxWidth: 'max-width', minWidth: 'min-width', height: 'height', minHeight: 'min-height',
  margin: 'margin', marginTop: 'margin-top', marginRight: 'margin-right', marginBottom: 'margin-bottom', marginLeft: 'margin-left',
  padding: 'padding', paddingTop: 'padding-top', paddingRight: 'padding-right', paddingBottom: 'padding-bottom', paddingLeft: 'padding-left',
  display: 'display', flexDirection: 'flex-direction', flexWrap: 'flex-wrap', alignItems: 'align-items', justifyContent: 'justify-content',
  gap: 'gap', rowGap: 'row-gap', columnGap: 'column-gap', gridTemplateColumns: 'grid-template-columns',
  textAlign: 'text-align', color: 'color', fontFamily: 'font-family', fontSize: 'font-size', fontWeight: 'font-weight',
  lineHeight: 'line-height', letterSpacing: 'letter-spacing', textTransform: 'text-transform', textDecoration: 'text-decoration',
  backgroundColor: 'background-color', backgroundImage: 'background-image', backgroundSize: 'background-size',
  backgroundPosition: 'background-position', backgroundRepeat: 'background-repeat',
  borderWidth: 'border-width', borderStyle: 'border-style', borderColor: 'border-color', borderRadius: 'border-radius',
  boxShadow: 'box-shadow', opacity: 'opacity', overflow: 'overflow', zIndex: 'z-index', position: 'position',
  objectFit: 'object-fit', objectPosition: 'object-position', aspectRatio: 'aspect-ratio',
};

const ENUMS: Record<string, string[]> = {
  display: ['block', 'flex', 'grid', 'inline-block', 'inline-flex', 'none'],
  flexDirection: ['row', 'row-reverse', 'column', 'column-reverse'],
  flexWrap: ['nowrap', 'wrap'],
  alignItems: ['stretch', 'flex-start', 'center', 'flex-end', 'baseline'],
  justifyContent: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'],
  textAlign: ['left', 'center', 'right', 'justify'],
  textTransform: ['none', 'uppercase', 'lowercase', 'capitalize'],
  textDecoration: ['none', 'underline', 'line-through'],
  fontWeight: ['300', '400', '500', '600', '700', '800'],
  backgroundSize: ['auto', 'cover', 'contain'],
  backgroundRepeat: ['no-repeat', 'repeat', 'repeat-x', 'repeat-y'],
  borderStyle: ['none', 'solid', 'dashed', 'dotted'],
  overflow: ['visible', 'hidden', 'auto'],
  position: ['static', 'relative'],
  objectFit: ['fill', 'contain', 'cover', 'none', 'scale-down'],
};

/** Font stacks are chosen from the site's own fonts, never free text. */
export const FONT_FAMILIES: Record<string, string> = {
  'site-display': 'var(--font-display), Georgia, serif',
  'site-sans': 'var(--font-sans), system-ui, sans-serif',
};

const SAFE_VALUE = /^[#a-zA-Z0-9%.,()\-\s/_+*:'"]*$/;
const SAFE_URL = /^url\((['"]?)(\/(?:uploads|images)\/[A-Za-z0-9_\-./]+)\1\)$/;

/** Returns a safe CSS value for `key`, or null if it must be rejected. */
export function cleanStyleValue(key: string, raw: unknown): string | null {
  if (!(key in STYLE_PROPS)) return null;
  if (typeof raw === 'number') raw = String(raw);
  if (typeof raw !== 'string') return null;
  const v = raw.trim();
  if (!v || v.length > 160) return null;
  if (key === 'backgroundImage') return SAFE_URL.test(v) ? v : null;
  if (key === 'fontFamily') return v in FONT_FAMILIES ? v : null;
  if (key in ENUMS) return ENUMS[key].includes(v) ? v : null;
  if (key === 'zIndex') {
    const n = Number(v);
    return Number.isInteger(n) && n >= -1 && n <= 50 ? String(n) : null;
  }
  if (/url\(|expression|javascript|@import|\\|[{};<>]/i.test(v)) return null;
  return SAFE_VALUE.test(v) ? v : null;
}

export type Style = Record<string, string>;

/** Keeps only whitelisted, safe style entries. */
export function cleanStyle(style: unknown): Style {
  const out: Style = {};
  if (!style || typeof style !== 'object') return out;
  for (const [k, v] of Object.entries(style as Record<string, unknown>)) {
    const c = cleanStyleValue(k, v);
    if (c !== null) out[k] = c;
  }
  return out;
}

export type Block = {
  id: string;
  type: string;
  props: Record<string, unknown>;
  style: Style;
  responsive?: { tablet?: Style; mobile?: Style };
  hidden?: { desktop?: boolean; tablet?: boolean; mobile?: boolean };
  /** Extra CSS classes (letters, numbers, - and _ only). */
  className?: string;
  /** Accessibility: aria-label for the wrapper. */
  ariaLabel?: string;
  /** Editor-only: collapsed state in the navigator. */
  locked?: boolean;
  children?: Block[];
};

export type Doc = { version: 1; blocks: Block[] };

export const emptyDoc = (): Doc => ({ version: 1, blocks: [] });

const ID_RE = /^[a-zA-Z0-9_-]{4,40}$/;

export const BlockSchema: z.ZodType<Block> = z.lazy(() =>
  z.object({
    id: z.string().regex(ID_RE),
    type: z.string().min(1).max(40),
    props: z.record(z.string(), z.unknown()).default({}),
    style: z.record(z.string(), z.unknown()).default({}).transform(cleanStyle),
    responsive: z
      .object({
        tablet: z.record(z.string(), z.unknown()).transform(cleanStyle).optional(),
        mobile: z.record(z.string(), z.unknown()).transform(cleanStyle).optional(),
      })
      .optional(),
    hidden: z.object({ desktop: z.boolean().optional(), tablet: z.boolean().optional(), mobile: z.boolean().optional() }).optional(),
    className: z.string().max(120).regex(/^[A-Za-z0-9 _-]*$/).optional(),
    ariaLabel: z.string().max(160).optional(),
    locked: z.boolean().optional(),
    children: z.array(BlockSchema).max(200).optional(),
  }),
) as z.ZodType<Block>;

export const DocSchema = z.object({ version: z.literal(1), blocks: z.array(BlockSchema).max(300) });

export const PageSeoSchema = z
  .object({
    title: z.string().max(120).optional(),
    description: z.string().max(320).optional(),
    canonical: z.string().max(300).regex(/^(\/|https?:\/\/)[^\s<>"]*$/).optional().or(z.literal('')),
    noindex: z.boolean().optional(),
    nofollow: z.boolean().optional(),
    ogTitle: z.string().max(120).optional(),
    ogDescription: z.string().max(320).optional(),
    ogImage: z.string().max(300).regex(/^(\/|https?:\/\/)[^\s<>"]*$/).optional().or(z.literal('')),
  })
  .default({});
export type PageSeo = z.infer<typeof PageSeoSchema>;

export function newId(): string {
  const a = new Uint8Array(6);
  crypto.getRandomValues(a);
  return 'b' + Array.from(a, (x) => x.toString(36).padStart(2, '0')).join('').slice(0, 10);
}
