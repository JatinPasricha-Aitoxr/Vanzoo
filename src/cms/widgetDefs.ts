import { z } from 'zod';
import type { Block } from './schema';
import { sanitizeHtml } from './sanitize';

/**
 * Widget catalogue — pure data (no React), shared by the editor UI, the save
 * validator and the renderer. Each widget declares its props schema, defaults
 * and the fields the inspector shows.
 */
export type FieldType = 'text' | 'textarea' | 'select' | 'number' | 'checkbox' | 'image' | 'link' | 'list' | 'lines';
export type Field = {
  key: string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  hint?: string;
  placeholder?: string;
  /** For `list` fields: the fields of each repeated item, and its limits. */
  itemFields?: Field[];
  itemLabel?: string;
  max?: number;
};
export type WidgetDef = {
  type: string;
  label: string;
  category: 'Basic' | 'Layout' | 'Marketing' | 'Vanzoo';
  description: string;
  /** Can hold child blocks. */
  container?: boolean;
  propsSchema: z.ZodTypeAny;
  defaults: () => Record<string, unknown>;
  fields: Field[];
};

/** Only relative paths, anchors, http(s), tel: and mailto: are allowed in links. */
export function safeHref(value: unknown): string {
  const v = typeof value === 'string' ? value.trim() : '';
  if (!v) return '';
  return /^(\/(?!\/)|#|https?:\/\/|tel:|mailto:)[^\s<>"']*$/i.test(v) ? v : '';
}
const href = z.string().max(400).transform(safeHref);
const imgPath = z.string().max(400).transform((v) => (/^(\/|https?:\/\/)[^\s<>"']*$/.test(v) ? v : ''));
const text = (max = 300) => z.string().max(max);

const opts = (...pairs: [string, string][]) => pairs.map(([value, label]) => ({ value, label }));

const HERO_DEFAULTS = {
  headline1: 'Premium and Luxury Dry Clean',
  headline2: 'and garment care.',
  highlight: 'first',
  highlightWord: '',
  subhead:
    'With pickup and delivered to your doorstep — Italian hydrocarbon technology and couture-trained finishing, across Gurgaon.',
  seoH1: 'Best & Premium Dry Cleaning Services in Gurgaon',
  image: '/images/hero-valet-handover.jpg',
  imageAlt:
    'Vanzoo staff member handing freshly dry-cleaned garments in protective wrap to a customer at the Gurgaon store counter',
  showVideo: true,
  showOffer: true,
  secondaryLabel: 'See how it works',
  secondaryHref: '#how-it-works',
};

export const WIDGETS: WidgetDef[] = [
  // ----- Basic -----
  {
    type: 'heading',
    label: 'Heading',
    category: 'Basic',
    description: 'A heading. Semantic level (H1–H6) is separate from how big it looks.',
    propsSchema: z.object({
      text: text(200).default('New heading'),
      level: z.enum(['1', '2', '3', '4', '5', '6']).default('2'),
      size: z.enum(['display-xl', 'display-lg', 'display-md', 'display-sm', 'lead']).default('display-md'),
      highlight: z.boolean().default(true),
    }),
    defaults: () => ({ text: 'New heading', level: '2', size: 'display-md', highlight: true }),
    fields: [
      { key: 'text', label: 'Text', type: 'text' },
      { key: 'level', label: 'HTML level', type: 'select', options: opts(['1', 'H1'], ['2', 'H2'], ['3', 'H3'], ['4', 'H4'], ['5', 'H5'], ['6', 'H6']), hint: 'What search engines see. Use one H1 per page.' },
      { key: 'size', label: 'Visual size', type: 'select', options: opts(['display-xl', 'Extra large'], ['display-lg', 'Large'], ['display-md', 'Medium'], ['display-sm', 'Small'], ['lead', 'Lead text']) },
      { key: 'highlight', label: 'Gold-highlight brand keywords', type: 'checkbox' },
    ],
  },
  {
    type: 'text',
    label: 'Text',
    category: 'Basic',
    description: 'Paragraph text. Blank lines start a new paragraph. No HTML.',
    propsSchema: z.object({ text: text(4000).default('Write something here.'), size: z.enum(['lead', 'body', 'small']).default('body') }),
    defaults: () => ({ text: 'Write something here.', size: 'body' }),
    fields: [
      { key: 'text', label: 'Text', type: 'textarea' },
      { key: 'size', label: 'Size', type: 'select', options: opts(['lead', 'Lead'], ['body', 'Body'], ['small', 'Small']) },
    ],
  },
  {
    type: 'image',
    label: 'Image',
    category: 'Basic',
    description: 'A picture from the media library, with alt text and link.',
    propsSchema: z.object({
      src: imgPath.default('/images/hero-valet-handover.jpg'),
      alt: text(250).default(''),
      width: z.coerce.number().int().min(16).max(4000).default(1200),
      height: z.coerce.number().int().min(16).max(4000).default(800),
      caption: text(250).default(''),
      link: href.default(''),
      priority: z.boolean().default(false),
      rounded: z.boolean().default(true),
    }),
    defaults: () => ({ src: '/images/hero-valet-handover.jpg', alt: '', width: 1200, height: 800, caption: '', link: '', priority: false, rounded: true }),
    fields: [
      { key: 'src', label: 'Image', type: 'image' },
      { key: 'alt', label: 'Alt text', type: 'text', hint: 'Describe the picture for screen readers and search.' },
      { key: 'caption', label: 'Caption', type: 'text' },
      { key: 'width', label: 'Intrinsic width (px)', type: 'number', hint: 'Used to reserve space and avoid layout shift.' },
      { key: 'height', label: 'Intrinsic height (px)', type: 'number' },
      { key: 'link', label: 'Link', type: 'link' },
      { key: 'priority', label: 'Above the fold (load first, no lazy-loading)', type: 'checkbox' },
      { key: 'rounded', label: 'Rounded corners', type: 'checkbox' },
    ],
  },
  {
    type: 'button',
    label: 'Button',
    category: 'Basic',
    description: 'A call-to-action button or link.',
    propsSchema: z.object({
      label: text(80).default('Book Pickup'),
      href: href.default('/'),
      variant: z.enum(['gold', 'primary', 'secondary', 'inverse']).default('gold'),
      size: z.enum(['md', 'lg']).default('lg'),
      newTab: z.boolean().default(false),
    }),
    defaults: () => ({ label: 'Book Pickup', href: 'https://app.vanzoo.in/website/W10795', variant: 'gold', size: 'lg', newTab: true }),
    fields: [
      { key: 'label', label: 'Text', type: 'text' },
      { key: 'href', label: 'Link', type: 'link' },
      { key: 'variant', label: 'Style', type: 'select', options: opts(['gold', 'Gold'], ['primary', 'Green'], ['secondary', 'Outline'], ['inverse', 'White']) },
      { key: 'size', label: 'Size', type: 'select', options: opts(['md', 'Medium'], ['lg', 'Large']) },
      { key: 'newTab', label: 'Open in a new tab', type: 'checkbox' },
    ],
  },
  {
    type: 'spacer',
    label: 'Spacer',
    category: 'Basic',
    description: 'Vertical space.',
    propsSchema: z.object({ height: z.coerce.number().int().min(0).max(400).default(48) }),
    defaults: () => ({ height: 48 }),
    fields: [{ key: 'height', label: 'Height (px)', type: 'number' }],
  },
  {
    type: 'divider',
    label: 'Divider',
    category: 'Basic',
    description: 'A thin gold rule.',
    propsSchema: z.object({}),
    defaults: () => ({}),
    fields: [],
  },
  // ----- Layout -----
  {
    type: 'container',
    label: 'Section / Container',
    category: 'Layout',
    description: 'A full-width band that holds other widgets.',
    container: true,
    propsSchema: z.object({
      tone: z.enum(['light', 'muted', 'surface', 'dark']).default('light'),
      size: z.enum(['default', 'sm']).default('default'),
      contentWidth: z.enum(['site', 'narrow']).default('site'),
      tag: z.enum(['section', 'div', 'aside']).default('section'),
    }),
    defaults: () => ({ tone: 'light', size: 'default', contentWidth: 'site', tag: 'section' }),
    fields: [
      { key: 'tone', label: 'Background', type: 'select', options: opts(['light', 'Light'], ['muted', 'Soft green'], ['surface', 'Surface'], ['dark', 'Dark green']) },
      { key: 'size', label: 'Vertical spacing', type: 'select', options: opts(['default', 'Standard'], ['sm', 'Compact']) },
      { key: 'contentWidth', label: 'Content width', type: 'select', options: opts(['site', 'Site width'], ['narrow', 'Narrow']) },
      { key: 'tag', label: 'HTML tag', type: 'select', options: opts(['section', 'section'], ['div', 'div'], ['aside', 'aside']) },
    ],
  },
  // ----- Vanzoo -----
  {
    type: 'hero',
    label: 'Hero banner',
    category: 'Vanzoo',
    description: 'The full-bleed homepage hero with video, offer chip and call-to-action.',
    propsSchema: z.object({
      headline1: text(120).default(HERO_DEFAULTS.headline1),
      headline2: text(120).default(HERO_DEFAULTS.headline2),
      highlight: z.enum(['first', 'trailing']).default('first'),
      highlightWord: text(40).default(''),
      subhead: text(400).default(HERO_DEFAULTS.subhead),
      seoH1: text(160).default(HERO_DEFAULTS.seoH1),
      image: imgPath.default(HERO_DEFAULTS.image),
      imageAlt: text(250).default(HERO_DEFAULTS.imageAlt),
      showVideo: z.boolean().default(true),
      showOffer: z.boolean().default(true),
      secondaryLabel: text(60).default(HERO_DEFAULTS.secondaryLabel),
      secondaryHref: href.default(HERO_DEFAULTS.secondaryHref),
    }),
    defaults: () => ({ ...HERO_DEFAULTS }),
    fields: [
      { key: 'seoH1', label: 'Page H1 (keyword line)', type: 'text', hint: 'The page’s real H1 for search engines.' },
      { key: 'headline1', label: 'Headline — line 1', type: 'text' },
      { key: 'headline2', label: 'Headline — line 2', type: 'text' },
      { key: 'highlight', label: 'Gold line', type: 'select', options: opts(['first', 'First line'], ['trailing', 'Last line']) },
      { key: 'highlightWord', label: 'Or highlight one word', type: 'text' },
      { key: 'subhead', label: 'Sub-headline', type: 'textarea' },
      { key: 'image', label: 'Background image', type: 'image' },
      { key: 'imageAlt', label: 'Image alt text', type: 'text' },
      { key: 'showVideo', label: 'Play background video', type: 'checkbox' },
      { key: 'showOffer', label: 'Show first-order offer chip', type: 'checkbox' },
      { key: 'secondaryLabel', label: 'Second button text', type: 'text' },
      { key: 'secondaryHref', label: 'Second button link', type: 'link' },
    ],
  },
  { type: 'trust-strip', label: 'Trust strip', category: 'Vanzoo', description: 'The five-point “what every order includes” strip.', propsSchema: z.object({}), defaults: () => ({}), fields: [] },
  { type: 'why-choose', label: 'Why choose Vanzoo', category: 'Vanzoo', description: 'Sticky split-scroll pillars.', propsSchema: z.object({}), defaults: () => ({}), fields: [] },
  {
    type: 'services-row',
    label: 'Services row',
    category: 'Vanzoo',
    description: 'Auto-scrolling cards for every service.',
    propsSchema: z.object({ eyebrow: text(60).default('What we do'), title: text(160).default('Our Premium Fabric Care Services'), intro: text(400).default('Every service, one standard of care — each piece assessed individually before it goes anywhere near a machine.') }),
    defaults: () => ({ eyebrow: 'What we do', title: 'Our Premium Fabric Care Services', intro: 'Every service, one standard of care — each piece assessed individually before it goes anywhere near a machine.' }),
    fields: [
      { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { key: 'title', label: 'Heading', type: 'text' },
      { key: 'intro', label: 'Intro', type: 'textarea' },
    ],
  },
  {
    type: 'visit-store',
    label: 'Visit the store',
    category: 'Vanzoo',
    description: 'Storefront photo with text and buttons.',
    propsSchema: z.object({
      eyebrow: text(60).default('Visit Us'),
      title: text(160).default('Step into the Vanzoo store'),
      body: text(600).default('Drop in to see our premium organic dry cleaning up close — talk to our team about your garments, bags and shoes, or collect your finished order in person.'),
      image: imgPath.default('/images/vanzoo-store-front.jpg'),
      imageAlt: text(250).default('Vanzoo storefront in Gurgaon — Premium Organic Dryclean, with garments and accessories displayed in the window'),
      buttonLabel: text(60).default('Find our stores'),
    }),
    defaults: () => ({
      eyebrow: 'Visit Us',
      title: 'Step into the Vanzoo store',
      body: 'Drop in to see our premium organic dry cleaning up close — talk to our team about your garments, bags and shoes, or collect your finished order in person.',
      image: '/images/vanzoo-store-front.jpg',
      imageAlt: 'Vanzoo storefront in Gurgaon — Premium Organic Dryclean, with garments and accessories displayed in the window',
      buttonLabel: 'Find our stores',
    }),
    fields: [
      { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { key: 'title', label: 'Heading', type: 'text' },
      { key: 'body', label: 'Text', type: 'textarea' },
      { key: 'image', label: 'Photo', type: 'image' },
      { key: 'imageAlt', label: 'Photo alt text', type: 'text' },
      { key: 'buttonLabel', label: 'Button text', type: 'text' },
    ],
  },
  {
    type: 'process',
    label: 'Seven-step process',
    category: 'Vanzoo',
    description: 'The wave diagram of the seven care steps.',
    propsSchema: z.object({ eyebrow: text(60).default('Our Process'), heading: text(160).default('How Vanzoo Does Dry Cleaning For You'), intro: text(400).default('Free pickup and delivery to save you time. Italian hydrocarbon cleaning and hand finishing to keep every piece looking its best.') }),
    defaults: () => ({ eyebrow: 'Our Process', heading: 'How Vanzoo Does Dry Cleaning For You', intro: 'Free pickup and delivery to save you time. Italian hydrocarbon cleaning and hand finishing to keep every piece looking its best.' }),
    fields: [
      { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'intro', label: 'Intro', type: 'textarea' },
    ],
  },
  {
    type: 'personas',
    label: 'Who we look after',
    category: 'Vanzoo',
    description: 'Client personas scroller.',
    propsSchema: z.object({ eyebrow: text(60).default('Preserving Style'), title: text(160).default('Who we look after'), intro: text(400).default('From boardroom power suits to heritage saris, we serve clients who expect more than clean clothes.') }),
    defaults: () => ({ eyebrow: 'Preserving Style', title: 'Who we look after', intro: 'From boardroom power suits to heritage saris, we serve clients who expect more than clean clothes.' }),
    fields: [
      { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { key: 'title', label: 'Heading', type: 'text' },
      { key: 'intro', label: 'Intro', type: 'textarea' },
    ],
  },
  { type: 'brand-band', label: 'Brand band', category: 'Vanzoo', description: 'Logo, mascot and promise.', propsSchema: z.object({}), defaults: () => ({}), fields: [] },
  { type: 'we-care', label: '“We care” banner', category: 'Vanzoo', description: 'Editorial statement band.', propsSchema: z.object({}), defaults: () => ({}), fields: [] },
  { type: 'areas', label: 'Areas we serve', category: 'Vanzoo', description: 'Coverage grid.', propsSchema: z.object({}), defaults: () => ({}), fields: [] },
  {
    type: 'blog-preview',
    label: 'Latest articles',
    category: 'Vanzoo',
    description: 'Newest blog posts.',
    propsSchema: z.object({ eyebrow: text(60).default('From the journal'), title: text(160).default('Fabric care, explained'), count: z.coerce.number().int().min(1).max(6).default(3) }),
    defaults: () => ({ eyebrow: 'From the journal', title: 'Fabric care, explained', count: 3 }),
    fields: [
      { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { key: 'title', label: 'Heading', type: 'text' },
      { key: 'count', label: 'How many posts', type: 'number' },
    ],
  },

  // ----- Marketing -----
  {
    type: 'faq-custom',
    label: 'FAQ (your questions)',
    category: 'Marketing',
    description: 'Accordion with questions you write. Adds FAQ structured data from the visible answers.',
    propsSchema: z.object({ title: text(160).default('Frequently asked questions'), items: z.array(z.object({ question: text(200), answer: text(2000) })).max(30).default([]) }),
    defaults: () => ({ title: 'Frequently asked questions', items: [{ question: 'Your first question?', answer: 'Write the answer here.' }] }),
    fields: [
      { key: 'title', label: 'Heading', type: 'text' },
      { key: 'items', label: 'Questions', type: 'list', itemLabel: 'Question', max: 30, itemFields: [{ key: 'question', label: 'Question', type: 'text' }, { key: 'answer', label: 'Answer', type: 'textarea' }] },
    ],
  },
  {
    type: 'testimonials',
    label: 'Customer quotes',
    category: 'Marketing',
    description: 'Quotes from real customers you have permission to publish. No star ratings are generated.',
    propsSchema: z.object({ title: text(160).default('What customers say'), items: z.array(z.object({ quote: text(600), name: text(80), detail: text(120).default('') })).max(12).default([]) }),
    defaults: () => ({ title: 'What customers say', items: [] }),
    fields: [
      { key: 'title', label: 'Heading', type: 'text' },
      { key: 'items', label: 'Quotes', type: 'list', itemLabel: 'Quote', max: 12, itemFields: [{ key: 'quote', label: 'Quote', type: 'textarea' }, { key: 'name', label: 'Customer name', type: 'text' }, { key: 'detail', label: 'Detail (e.g. area)', type: 'text' }] },
    ],
    // Intentionally empty by default so nothing invented is ever published.
  },
  {
    type: 'cta',
    label: 'Call to action',
    category: 'Marketing',
    description: 'A banner with a heading, a line of text and one button.',
    propsSchema: z.object({ heading: text(160).default('Ready to hand over the fabric care?'), body: text(300).default(''), label: text(40).default('Book Pickup'), href: href.default('/contact-us/'), tone: z.enum(['dark', 'light']).default('dark') }),
    defaults: () => ({ heading: 'Ready to hand over the fabric care?', body: 'Free pickup and delivery across Gurgaon.', label: 'Book Pickup', href: '/contact-us/', tone: 'dark' }),
    fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'body', label: 'Text', type: 'textarea' },
      { key: 'label', label: 'Button text', type: 'text' },
      { key: 'href', label: 'Button link', type: 'link' },
      { key: 'tone', label: 'Look', type: 'select', options: opts(['dark', 'Dark green'], ['light', 'Light']) },
    ],
  },
  {
    type: 'feature-grid',
    label: 'Feature grid',
    category: 'Marketing',
    description: 'Short benefit cards in 2, 3 or 4 columns.',
    propsSchema: z.object({ title: text(160).default(''), columns: z.enum(['2', '3', '4']).default('3'), items: z.array(z.object({ title: text(100), body: text(400) })).max(12).default([]) }),
    defaults: () => ({ title: 'Why Vanzoo', columns: '3', items: [{ title: 'Benefit one', body: 'Say what the customer gets.' }, { title: 'Benefit two', body: 'Keep it concrete and true.' }, { title: 'Benefit three', body: 'One or two sentences.' }] }),
    fields: [
      { key: 'title', label: 'Heading', type: 'text' },
      { key: 'columns', label: 'Columns', type: 'select', options: opts(['2', '2'], ['3', '3'], ['4', '4']) },
      { key: 'items', label: 'Cards', type: 'list', itemLabel: 'Card', max: 12, itemFields: [{ key: 'title', label: 'Title', type: 'text' }, { key: 'body', label: 'Text', type: 'textarea' }] },
    ],
  },
  {
    type: 'price-list',
    label: 'Price list',
    category: 'Marketing',
    description: 'A simple table of items and the prices you enter. Nothing is calculated or invented.',
    propsSchema: z.object({ title: text(160).default(''), note: text(300).default(''), items: z.array(z.object({ name: text(120), price: text(40), detail: text(160).default('') })).max(60).default([]) }),
    defaults: () => ({ title: 'Prices', note: 'Prices start from the amounts shown. GST extra.', items: [] }),
    fields: [
      { key: 'title', label: 'Heading', type: 'text' },
      { key: 'note', label: 'Note under the table', type: 'text' },
      { key: 'items', label: 'Rows', type: 'list', itemLabel: 'Row', max: 60, itemFields: [{ key: 'name', label: 'Item', type: 'text' }, { key: 'price', label: 'Price (e.g. ₹250)', type: 'text' }, { key: 'detail', label: 'Detail', type: 'text' }] },
    ],
  },
  {
    type: 'rich-text',
    label: 'Rich text',
    category: 'Marketing',
    description: 'Formatted text (headings, lists, links). Unsafe HTML is stripped automatically.',
    propsSchema: z.object({ html: z.string().max(60000).transform(sanitizeHtml).default('<p>Write your text here.</p>'), narrow: z.boolean().default(true) }),
    defaults: () => ({ html: '<h2>Heading</h2><p>Write your text here.</p>', narrow: true }),
    fields: [
      { key: 'html', label: 'Content (HTML: h2–h4, p, ul, ol, a, strong, em, img)', type: 'textarea' },
      { key: 'narrow', label: 'Narrow reading width', type: 'checkbox' },
    ],
  },
  {
    type: 'video',
    label: 'YouTube video',
    category: 'Marketing',
    description: 'Privacy-friendly YouTube embed (youtube-nocookie).',
    propsSchema: z.object({ url: text(300).default(''), title: text(160).default('Video') }),
    defaults: () => ({ url: '', title: 'Video' }),
    fields: [
      { key: 'url', label: 'YouTube address', type: 'text', placeholder: 'https://www.youtube.com/watch?v=…' },
      { key: 'title', label: 'Title (for screen readers)', type: 'text' },
    ],
  },
  {
    type: 'contact-info',
    label: 'Contact details',
    category: 'Marketing',
    description: 'Phone, email and store address taken from the site’s verified business details.',
    propsSchema: z.object({ title: text(160).default('Contact us') }),
    defaults: () => ({ title: 'Contact us' }),
    fields: [{ key: 'title', label: 'Heading', type: 'text' }],
  },
  {
    type: 'faq',
    label: 'FAQ',
    category: 'Vanzoo',
    description: 'Frequently asked questions accordion.',
    propsSchema: z.object({ title: text(160).default('Frequently Asked Questions'), showMascot: z.boolean().default(true) }),
    defaults: () => ({ title: 'Frequently Asked Questions', showMascot: true }),
    fields: [
      { key: 'title', label: 'Heading', type: 'text' },
      { key: 'showMascot', label: 'Show mascot', type: 'checkbox' },
    ],
  },
  {
    type: 'enquiry',
    label: 'Enquiry form',
    category: 'Vanzoo',
    description: 'Contact details beside the enquiry form.',
    propsSchema: z.object({ eyebrow: text(60).default('Get in touch'), title: text(160).default('Request an Enquiry') }),
    defaults: () => ({ eyebrow: 'Get in touch', title: 'Request an Enquiry' }),
    fields: [
      { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { key: 'title', label: 'Heading', type: 'text' },
    ],
  },
  { type: 'guarantee', label: 'Our promise', category: 'Vanzoo', description: 'The guarantee block.', propsSchema: z.object({}), defaults: () => ({}), fields: [] },
  { type: 'app-promo', label: 'App download', category: 'Vanzoo', description: 'App promo with QR code.', propsSchema: z.object({}), defaults: () => ({}), fields: [] },
];

export const WIDGET_MAP: Record<string, WidgetDef> = Object.fromEntries(WIDGETS.map((w) => [w.type, w]));

const MAX_DEPTH = 4;

/**
 * Validates every block against its widget schema (dropping unknown props),
 * rejects unknown widget types and invalid nesting. Returns the cleaned tree or
 * throws an Error describing the first problem.
 */
export function validateBlocks(blocks: Block[], depth = 0): Block[] {
  if (depth > MAX_DEPTH) throw new Error('Containers are nested too deeply.');
  const seen = new Set<string>();
  return blocks.map((b) => {
    const def = WIDGET_MAP[b.type];
    if (!def) throw new Error(`Unknown widget type “${b.type}”.`);
    if (seen.has(b.id)) throw new Error(`Duplicate block id “${b.id}”.`);
    seen.add(b.id);
    if (b.children?.length && !def.container) throw new Error(`“${def.label}” cannot contain other widgets.`);
    const props = def.propsSchema.parse(b.props ?? {}) as Record<string, unknown>;
    return { ...b, props, children: b.children ? validateBlocks(b.children, depth + 1) : undefined };
  });
}
