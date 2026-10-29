import type { Field } from './widgetDefs';

/** Which fields an editor may change for each catalogue type. Client-safe (no server imports). */
export type ContentTypeDef = {
  type: 'service' | 'product' | 'area' | 'faq';
  label: string;
  plural: string;
  description: string;
  /** New entries can be created (not only built-in ones edited). */
  canAdd: boolean;
  /** Built-in entries can be hidden from the site. */
  canHide: boolean;
  fields: Field[];
};

const t = (key: string, label: string, hint?: string): Field => ({ key, label, type: 'text', hint });
const ta = (key: string, label: string, hint?: string): Field => ({ key, label, type: 'textarea', hint });
const img = (key: string, label: string): Field => ({ key, label, type: 'image' });

export const CONTENT_TYPES: ContentTypeDef[] = [
  {
    type: 'service',
    label: 'Service',
    plural: 'Services',
    description: 'The twelve service pages and cards. Leave a field blank to keep the built-in wording.',
    canAdd: true,
    canHide: true,
    fields: [
      t('title', 'Name'),
      ta('body', 'Short description (cards)'),
      ta('longBody', 'Long description (service page)'),
      t('seoH1', 'Page H1 (keyword line)', 'The page’s real H1 for search engines.'),
      t('pageHeadline', 'Page headline'),
      ta('contentHook', 'Hook under the headline'),
      t('metaTitle', 'Search-result title (≈60 characters)'),
      { key: 'highlights', label: 'Highlights (one per line)', type: 'lines' },
      img('image', 'Card image'), t('imageAlt', 'Card image description'),
      img('heroImage', 'Hero image'), t('heroImageAlt', 'Hero image description'),
      img('detailImage', 'Side image'), t('detailImageAlt', 'Side image description'),
      t('priceLine', 'Price line (when there is no tariff row)'),
      t('tariffLabel', 'Tariff button text'),
    ],
  },
  {
    type: 'product',
    label: 'Garment page',
    plural: 'Garment pages',
    description: 'One page per garment. Prices always come from the tariff — change them under Pricing.',
    canAdd: true,
    canHide: true,
    fields: [t('title', 'Name'), ta('intro', 'Intro'), img('heroImage', 'Hero image'), t('heroImageAlt', 'Hero image description')],
  },
  {
    type: 'area',
    label: 'Locality page',
    plural: 'Locality pages',
    description: 'Pickup-area pages. Localities can be edited but not removed.',
    canAdd: false,
    canHide: false,
    fields: [t('headline', 'Headline'), ta('intro', 'Intro'), t('metaTitle', 'Search-result title'), ta('metaDescription', 'Search-result description'), { key: 'localNotes', label: 'Local notes (one per line)', type: 'lines' }],
  },
  {
    type: 'faq',
    label: 'FAQ list',
    plural: 'FAQs',
    description: 'The questions shown on the homepage and the contact page (also published as FAQ structured data).',
    canAdd: false,
    canHide: false,
    fields: [{ key: 'items', label: 'Questions', type: 'list', itemLabel: 'Question', max: 40, itemFields: [t('question', 'Question'), ta('answer', 'Answer')] }],
  },
];
export const typeDef = (t: string) => CONTENT_TYPES.find((c) => c.type === t);
