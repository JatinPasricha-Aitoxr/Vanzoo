// Dependency-free route lists shared by the page store, the renderer and the admin UI.

/**
 * Built-in pages that can be taken over by a page built in the editor: publish a
 * CMS page at the same address and it replaces the code version; unpublish it and
 * the built-in page comes back.
 */
export const OVERRIDABLE_PAGES = [
  '/about-us/', '/pricing/', '/membership/', '/hydrocarbon-tech/', '/contact-us/', '/locate-us/', '/reviews/', '/customer-stories/',
  '/privacy-policy/', '/terms-conditions/', '/delivery-refund-policy/', '/site-map/', '/best-dry-cleaners-near-me/',
  '/best-dry-cleaning-in-gurgaon/', '/services/', '/products/', '/areas-we-serve/', '/blogs/',
] as const;

// ----------------------------------------------------------- detail templates

export const TEMPLATE_SLOTS = [
  { slot: 'service', label: 'Service pages', vars: ['title', 'url'], where: 'End of every /services/<service>/ page' },
  { slot: 'product', label: 'Garment pages', vars: ['title', 'url'], where: 'End of every /products/<garment>/ page' },
  { slot: 'area', label: 'Locality pages', vars: ['name', 'url'], where: 'End of every /areas-we-serve/<locality>/ page' },
  { slot: 'post', label: 'Blog posts', vars: ['title', 'category', 'url'], where: 'After every blog article' },
] as const;
export type TemplateSlot = (typeof TEMPLATE_SLOTS)[number]['slot'];
export const templateSlug = (slot: string) => `/_t/${slot}/`;

