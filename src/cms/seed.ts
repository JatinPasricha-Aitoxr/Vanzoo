import { WIDGET_MAP } from './widgetDefs';
import type { Block, Doc } from './schema';

const mk = (id: string, type: string): Block => ({
  id,
  type,
  props: WIDGET_MAP[type].defaults(),
  style: {},
});

/**
 * The homepage as it is built in code today, expressed as blocks. Used until the
 * first publish from the editor, and as the starting point for editing.
 */
export function defaultHomeDoc(): Doc {
  return {
    version: 1,
    blocks: [
      mk('home-hero', 'hero'),
      mk('home-trust', 'trust-strip'),
      mk('home-why', 'why-choose'),
      mk('home-services', 'services-row'),
      mk('home-store', 'visit-store'),
      mk('home-process', 'process'),
      mk('home-personas', 'personas'),
      mk('home-brand', 'brand-band'),
      mk('home-wecare', 'we-care'),
      mk('home-areas', 'areas'),
      mk('home-blog', 'blog-preview'),
      mk('home-faq', 'faq'),
      mk('home-enquiry', 'enquiry'),
      mk('home-promise', 'guarantee'),
      mk('home-app', 'app-promo'),
    ],
  };
}
