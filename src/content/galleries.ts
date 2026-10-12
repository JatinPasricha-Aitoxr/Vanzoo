/**
 * Photo galleries shown at the foot of selected pages (PageGallery). Photos are
 * Vanzoo's own — stores, facility, packaging and delivery — keyed by route.
 */
export type GalleryPhoto = { src: string; w: number; h: number; alt: string };

const P: Record<string, GalleryPhoto> = Object.fromEntries(
  [
  { src: '/images/vanzoo/store-front-day.jpg', w: 1800, h: 1684, alt: 'Vanzoo store front in Gurgaon with the green VANZOO Premium Organic Dryclean signboard' },
  { src: '/images/vanzoo/store-front-night.jpg', w: 1200, h: 1600, alt: 'Vanzoo store illuminated at night, with garments on display behind the glass front' },
  { src: '/images/vanzoo/store-interior-wide.jpg', w: 1536, h: 1024, alt: 'Inside a Vanzoo store: shelves of garments, shoes and bags, with the Vanzoo tiger mascot at the counter' },
  { src: '/images/vanzoo/store-interior-tall.jpg', w: 1024, h: 1536, alt: 'Vanzoo store interior with a wardrobe wall of suits, shirts, bags and shoes' },
  { src: '/images/vanzoo/store-interior-tall-2.jpg', w: 1024, h: 1536, alt: 'Vanzoo store interior with a wardrobe wall of suits, shirts, bags and shoes' },
  { src: '/images/vanzoo/facility-machine.jpg', w: 1536, h: 1024, alt: 'Vanzoo team member operating a closed-loop hydrocarbon dry cleaning machine' },
  { src: '/images/vanzoo/facility-machine-2.jpg', w: 1536, h: 1024, alt: 'Vanzoo team member at the hydrocarbon dry cleaning machine control panel' },
  { src: '/images/vanzoo/facility-ironing.jpg', w: 1014, h: 1800, alt: 'Vanzoo team member steam pressing a garment by hand' },
  { src: '/images/vanzoo/pack-saree.jpg', w: 1350, h: 1800, alt: 'Embroidered saree in Vanzoo protective garment packaging' },
  { src: '/images/vanzoo/pack-cover.jpg', w: 1350, h: 1800, alt: 'Vanzoo green garment cover with a clear window' },
  { src: '/images/vanzoo/pack-blankets.jpg', w: 1350, h: 1800, alt: 'Cleaned blankets sealed in Vanzoo protective packaging' },
  { src: '/images/vanzoo/rider-street.jpg', w: 847, h: 1077, alt: 'Vanzoo rider with a green delivery bag on a motorbike' },
  { src: '/images/vanzoo/rider-door.jpg', w: 885, h: 1574, alt: 'Vanzoo valet with a green delivery bag delivering at a doorstep' },
  { src: '/images/vanzoo/display-suit.jpg', w: 1800, h: 1005, alt: 'Shirt, trousers, shoes and a leather bag displayed in a glass case after Vanzoo care' },
  { src: '/images/vanzoo/promo-25.jpg', w: 1536, h: 1024, alt: 'A cared-for overcoat displayed in a glass case, with the Vanzoo first-order offer' },
  { src: '/images/vanzoo/express-banner.jpg', w: 1774, h: 887, alt: 'Vanzoo Express Services banner: clean shirts, sneakers and bedding ready in 24 to 48 hours' },
  { src: '/images/vanzoo/carpet-hero.jpg', w: 1800, h: 1005, alt: 'Handknotted carpet rolled and laid out after Vanzoo carpet care' },
  { src: '/images/vanzoo/ironing-skyline.jpg', w: 1800, h: 1005, alt: 'Vanzoo team member checking a freshly pressed white shirt by a window' },
  { src: '/images/vanzoo/bag-before-after.jpg', w: 851, h: 1280, alt: 'Before and after: a leather handbag cleaned and revived by Vanzoo' },
  { src: '/images/vanzoo/blankets-wide.jpg', w: 1800, h: 606, alt: 'Blankets and bedding in Vanzoo green packaging beside a folded throw' },
  { src: '/images/vanzoo/gown-backdrop.jpg', w: 1024, h: 1536, alt: 'A pale blue gown on display against the Vanzoo branded backdrop' },
  ].map((photo) => [photo.src.split('/').pop()!.replace('.jpg', ''), photo]),
);

export type Gallery = { eyebrow: string; heading: string; intro?: string; photos: readonly GalleryPhoto[] };

export const galleries: Record<string, Gallery> = {
  '/': {
    eyebrow: 'Inside Vanzoo',
    heading: 'Our stores, our facility, our care',
    photos: [P['store-front-day'], P['facility-machine'], P['store-interior-wide'], P['pack-saree'], P['rider-street'], P['facility-ironing']],
  },
  '/about-us/': {
    eyebrow: 'Inside Vanzoo',
    heading: 'Our stores, facility and packaging',
    intro: 'The Vanzoo premium organic dryclean experience — from the machine floor to the doorstep.',
    photos: [P['facility-machine'], P['facility-machine-2'], P['facility-ironing'], P['store-front-day'], P['store-front-night'], P['store-interior-wide'], P['pack-cover'], P['pack-saree'], P['rider-street']],
  },
  '/locate-us/': {
    eyebrow: 'Our stores',
    heading: 'Step inside Vanzoo',
    intro: 'A look at our Gurgaon stores.',
    photos: [P['store-front-day'], P['store-front-night'], P['store-interior-wide'], P['store-interior-tall'], P['store-interior-tall-2']],
  },
  '/membership/': {
    eyebrow: 'Inside Vanzoo',
    heading: 'Where your membership goes to work',
    photos: [P['store-interior-wide'], P['store-interior-tall'], P['pack-cover']],
  },
  '/hydrocarbon-tech/': {
    eyebrow: 'On the machine floor',
    heading: 'Hydrocarbon dry cleaning at Vanzoo',
    photos: [P['facility-machine'], P['facility-machine-2'], P['facility-ironing'], P['ironing-skyline']],
  },
  '/services/pickup-delivery/': {
    eyebrow: 'Doorstep care',
    heading: 'Collected, cared for and delivered',
    photos: [P['rider-street'], P['rider-door'], P['pack-saree'], P['pack-cover'], P['pack-blankets']],
  },
  '/services/bags-leather-care/': {
    eyebrow: 'Results',
    heading: 'Before and after',
    photos: [P['bag-before-after'], P['display-suit']],
  },
  '/services/couture-care/': {
    eyebrow: 'Gallery',
    heading: 'Cared for, finished and presented',
    photos: [P['display-suit'], P['gown-backdrop'], P['promo-25'], P['pack-cover']],
  },
  '/services/express-service/': {
    eyebrow: 'Gallery',
    heading: 'Express care, done right',
    photos: [P['express-banner'], P['ironing-skyline'], P['facility-ironing']],
  },
  '/services/home-textiles/': {
    eyebrow: 'Gallery',
    heading: 'Fresh blankets and bedding',
    photos: [P['blankets-wide'], P['pack-blankets']],
  },
  '/services/carpet-cleaning/': {
    eyebrow: 'Gallery',
    heading: 'Carpets, cared for',
    photos: [P['carpet-hero']],
  },
  '/services/steam-iron/': {
    eyebrow: 'Gallery',
    heading: 'Pressed by hand',
    photos: [P['facility-ironing'], P['ironing-skyline']],
  },
};
