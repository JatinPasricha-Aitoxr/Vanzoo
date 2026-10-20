/**
 * The site-wide "Customer stories / Visit our stores" band above the footer.
 * Store photos below; customer stories link to /customer-stories/.
 *
 * Store photos: day/night shots of the storefronts, assigned in order (first
 * store, second store) — swap `photo` if they are the other way round.
 */

export type StorePhoto = {
  /** `stores[].id` in lib/site.ts. */
  storeId: 'super-mart-1' | 'vanzoo-urbana';
  photo?: { src: string; alt: string };
};

export const storePhotos: readonly StorePhoto[] = [
  {
    storeId: 'super-mart-1',
    photo: { src: '/images/vanzoo/store-front-day.jpg', alt: 'Vanzoo store front with the green VANZOO Premium Organic Dryclean signboard' },
  },
  {
    storeId: 'vanzoo-urbana',
    photo: { src: '/images/vanzoo/store-front-night.jpg', alt: 'Vanzoo store lit up at night with garments displayed behind the glass front' },
  },
];
