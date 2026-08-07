import type { IconName } from '@/components/ui/Icon';

/**
 * Marketing copy, carried over verbatim from vanzoo.in.
 *
 * This is a redesign, not a rewrite: every string below is the live site's own
 * wording, including its punctuation and capitalisation quirks. The only
 * authored strings are the hero headline/subhead and the guarantee line, which
 * the brief explicitly re-styles — those are marked with an AUTHORED comment.
 */

/* -------------------------------------------------------------------------- */
/* Hero                                                                       */
/* -------------------------------------------------------------------------- */

/** AUTHORED — hero restyle sanctioned by the brief (§3.2, §6). */
export const homeHero = {
  headline: ['Luxury fabric care.', 'Delivered to your door.'],
  subhead:
    'Italian hydrocarbon technology, couture-trained finishing, and free pickup and delivery across Delhi, Gurugram and the NCR.',
  image: '/images/hero-valet-handover.jpg',
  imageAlt:
    'Vanzoo staff member handing freshly dry-cleaned garments in protective wrap to a customer at the Gurgaon store counter',
} as const;

/* -------------------------------------------------------------------------- */
/* Trust strip                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Deliberately factual. The brief forbids inventing press mentions, and Vanzoo
 * publishes no review count or star rating we can verify, so this strip states
 * only capabilities the site itself claims.
 */
export const trustMarkers = [
  {
    label: 'Italian hydrocarbon technology',
    detail: 'Imported, closed-loop systems',
    icon: 'cpu',
  },
  {
    label: '99% chemical-free finish',
    detail: 'Solvent recovered and recycled each cycle',
    icon: 'flaskOff',
  },
  {
    label: 'Free pickup & delivery',
    detail: 'Across Delhi, Gurugram and the NCR',
    icon: 'truck',
  },
  { label: 'Express turnaround', detail: 'Same-day or 2–4 hour options', icon: 'bolt' },
  { label: 'Two Gurugram stores', detail: 'DLF Phase IV and Sector 67', icon: 'mapPin' },
] as const satisfies ReadonlyArray<{ label: string; detail: string; icon: IconName }>;

/* -------------------------------------------------------------------------- */
/* Why Choose VANZOO                                                          */
/* -------------------------------------------------------------------------- */

export const whyChooseBadges = [
  {
    label: 'Western Technology',
    icon: '/images/icons/western-technology.png',
    iconAlt: 'Circuit and gear icon representing imported Western dry cleaning technology',
  },
  {
    label: 'Toxin Free',
    icon: '/images/icons/toxin-free.png',
    iconAlt: 'Crossed-out chemical flask icon representing toxin-free garment cleaning',
  },
  {
    label: 'Skin Friendly',
    icon: '/images/icons/skin-friendly.png',
    iconAlt: 'Skin layer icon representing skin-friendly residue-free fabric care',
  },
  {
    label: 'Sustainable',
    icon: '/images/icons/sustainable.png',
    iconAlt: 'Leaf in a cycle icon representing sustainable eco-friendly dry cleaning',
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Services                                                                   */
/* -------------------------------------------------------------------------- */

export type Service = {
  number: string;
  title: string;
  body: string;
  image: string;
  imageAlt: string;
  /** Internal destination for the "learn more" link — the brief's §5.3 rule
   *  that every service block links to its relevant tariff or tech page. */
  learnMore: { href: string; label: string };
};

export const services: readonly Service[] = [
  {
    number: '01',
    title: 'Bespoke Suit & Couture Care',
    body: 'Tailored for your most refined garments. We preserve the shape, structure, and elegance of custom suits and designer wear.',
    image: '/images/service-bespoke-suit-couture.jpg',
    imageAlt:
      'Bespoke two-piece suit and evening dress hanging after couture dry cleaning at Vanzoo Gurgaon',
    learnMore: { href: '/couture-care-tariffs/', label: 'See couture care tariffs' },
  },
  {
    number: '02',
    title: 'Silks, Wool & Delicate Fabrics',
    body: 'Gentle treatment for silks, woolens, and cashmere. We restore their natural softness and lustre without damage.',
    image: '/images/service-silk-wool-delicates.jpg',
    imageAlt:
      'Folded silk, wool and cashmere garments after gentle hydrocarbon dry cleaning in Gurgaon',
    learnMore: { href: '/hydrocarbon-tech/', label: 'How we clean delicates' },
  },
  {
    number: '03',
    title: 'Shoes, Bags & Accessories',
    body: 'Expert care for luxury leather goods, handbags, and shoes. Cleaned, conditioned, and revived by skilled professionals.',
    image: '/images/service-shoes-bags-accessories.jpg',
    imageAlt:
      'Leather brogues and a tan leather handbag cleaned and conditioned by Vanzoo luxury accessory care',
    learnMore: { href: '/couture-care-tariffs/', label: 'See accessory pricing' },
  },
  {
    number: '04',
    title: 'Free Pickup & Delivery, On Your Time',
    body: 'Enjoy seamless door-to-door service with optional same-day or 2–4 hour express turnaround.',
    image: '/images/service-pickup-delivery.jpg',
    imageAlt:
      'Basket of clothes ready for free Vanzoo doorstep pickup and delivery in Gurgaon',
    learnMore: { href: '/locate-us/', label: 'Check our service areas' },
  },
  {
    number: '05',
    title: 'Eco-Friendly Hydrocarbon Tech',
    body: 'Utilizing hydrocarbon extracts, we remove 99% of chemicals from fabric, ensuring a safer, skin-friendly experience with every wear.',
    image: '/images/service-hydrocarbon-machine.jpg',
    imageAlt:
      'Control panel of the closed-loop hydrocarbon dry cleaning machine used at Vanzoo',
    learnMore: { href: '/hydrocarbon-tech/', label: 'Explore hydrocarbon tech' },
  },
  {
    number: '06',
    title: 'Curtain Cleaning (with Free Deinstallation & Reinstallation)',
    body: 'Professional drapery care that includes free deinstallation and reinstallation, ensuring a flawless finish every time.',
    image: '/images/service-curtain-cleaning.jpg',
    imageAlt:
      'Floor-length living room curtains professionally cleaned, deinstalled and reinstalled by Vanzoo',
    learnMore: { href: '/couture-care-tariffs/', label: 'See curtain pricing' },
  },
];

/* -------------------------------------------------------------------------- */
/* How It Works — tabbed explainer                                            */
/* -------------------------------------------------------------------------- */

export const howItWorksIntro =
  'With VANZOO, premium fabric & accessory care is made simple, sustainable, and seamless.';

export const howItWorksSteps = [
  {
    id: 'schedule',
    tab: 'Schedule',
    title: 'Schedule a pickup in under a minute',
    body: 'Book a pickup from the app or the website, choose a slot that suits you, and our valet collects from your door — free, across Delhi, Gurugram and the NCR.',
    image: '/images/process-schedule-call.jpg',
    imageAlt: 'Customer booking a Vanzoo dry cleaning pickup by phone from home in Gurgaon',
  },
  {
    id: 'clean',
    tab: 'Clean with Hydrocarbon Tech',
    title: 'Cleaned with Italian hydrocarbon technology',
    body: 'Every piece is assessed individually, then cleaned in a closed-loop hydrocarbon system that dissolves stains without water or harsh solvents — and recycles 99% of the solvent each cycle.',
    image: '/images/service-hydrocarbon-machine.jpg',
    imageAlt:
      'Closed-loop hydrocarbon dry cleaning machine mid-cycle at the Vanzoo facility in Gurugram',
  },
  {
    id: 'delivered',
    tab: 'Delivered Pressed',
    title: 'Returned pressed, wrapped and ready to wear',
    body: 'Finishing is done by hand, packed in sustainable wrapping and delivered back to your door. Standard turnaround is 5-7 days, with same-day and 2-4 hour express options.',
    image: '/images/process-delivered-pressed.jpg',
    imageAlt:
      'Cream cable-knit sweater finished, pressed and hung ready for Vanzoo doorstep delivery in Gurgaon',
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Preserving Style — personas                                                */
/* -------------------------------------------------------------------------- */

export const personas = [
  {
    category: 'Business',
    title: 'Corporate Professionals & Executives',
    body: 'Tailored suits. Silk blouses. Fine outerwear. We ensure your wardrobe communicates confidence, sophistication, and attention to detail, at every meeting, every moment.',
    image: '/images/persona-corporate-professionals.jpg',
    imageAlt:
      'Executive selecting a freshly dry-cleaned shirt from a wardrobe rail of business wear',
  },
  {
    category: 'Hospitality',
    title: 'Guests of Luxury & Lifestyle Events',
    body: 'For those living or traveling in style, we offer premium care for special-occasion garments, from gala gowns to resort wear, always delivered flawlessly and discreetly.',
    image: '/images/persona-hospitality-guests.jpg',
    imageAlt: 'Gala gown and evening wear prepared for a luxury lifestyle event by Vanzoo',
  },
  {
    category: 'Fashion',
    title: 'Fashion Enthusiasts & Collectors',
    body: 'Designer labels, couture, and limited-edition pieces deserve more than basic dry cleaning. Our artisan approach protects fabric integrity and preserves statement pieces for years to come.',
    image: '/images/persona-fashion-collectors.jpg',
    imageAlt: 'Designer and limited-edition pieces displayed on mannequins in a fashion boutique',
  },
  {
    category: 'Entertainment',
    title: 'Creatives, Performers & Public Figures',
    body: 'On-stage or on-camera, appearances matter. We specialize in caring for costumes, performance attire, and iconic wardrobe items, ensuring they’re ready for every spotlight.',
    image: '/images/persona-performers.jpg',
    imageAlt: 'Classical dancer in performance costume cared for by Vanzoo garment specialists',
  },
  {
    category: 'Fashion',
    title: 'Families with Treasured Heirlooms',
    body: 'Your heirloom garments carry generations of meaning, a wedding saree, a christening gown, a vintage coat. Vanzoo treats each piece with reverence, offering gentle cleaning, museum-grade preservation, and personalized service.',
    image: '/images/persona-heirlooms.jpg',
    imageAlt: 'Two generations in heritage silk sarees preserved with museum-grade Vanzoo care',
  },
] as const;

/* -------------------------------------------------------------------------- */
/* What Makes VANZOO Different                                                */
/* -------------------------------------------------------------------------- */

export const differentiators = [
  {
    title: 'Expert Care for Luxury Garments',
    body: 'Unmatched attention for high-end fabrics and bespoke clothing.',
    icon: '/images/icons/expert-care.png',
    iconAlt: 'Hanger with a star icon representing expert care for luxury garments',
  },
  {
    title: 'Hydrocarbon Technology',
    body: 'Unlike PERC-based dry cleaning, our solution is safer for skin and the planet.',
    icon: '/images/icons/hydrocarbon-technology.png',
    iconAlt: 'Gear and circuit icon representing hydrocarbon dry cleaning technology',
  },
  {
    title: 'Sustainability at Core',
    body: 'Non-toxic, eco-conscious methods for safe, pristine clothes.',
    icon: '/images/icons/sustainability-core.png',
    iconAlt: 'Recycling icon representing sustainability at the core of Vanzoo fabric care',
  },
  {
    title: 'Convenient & Time-Saving',
    body: 'Luxury door-to-door service, fitting into your busy life.',
    icon: '/images/icons/convenient-time-saving.png',
    iconAlt: 'Clock and hand icon representing convenient time-saving doorstep service',
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Guarantee                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * AUTHORED — the brief's §2.3.6 guarantee block, written from claims Vanzoo
 * already makes on-site (individual assessment, hand finishing, free re-clean
 * is *not* claimed anywhere, so it is not promised here).
 */
export const guarantee = {
  eyebrow: 'Our promise',
  statement:
    'Every piece is assessed individually, cleaned in a closed-loop hydrocarbon system, and hand-finished before it comes back to you. If a garment returns anything less than pristine, tell us — we will make it right.',
  ctaLabel: 'Book a pickup',
} as const;

/* -------------------------------------------------------------------------- */
/* App promo                                                                  */
/* -------------------------------------------------------------------------- */

export const appPromo = {
  heading: 'Luxury Care. Just a Tap Away.',
  body: 'Easily manage your wardrobe with the VANZOO app book pickups, track orders, and ensure top-tier care for your clothes, all from your phone.',
  benefits: [
    'Schedule convenient pickups and deliveries',
    'Track your order status in real-time',
    'Get professional care for all types of garments',
    'Manage wardrobe services anytime, anywhere',
  ],
  image: '/images/app-phone-mockup.png',
  imageAlt:
    'Vanzoo dry cleaning app shown on a smartphone, used to book pickups and track garment orders',
} as const;

/* -------------------------------------------------------------------------- */
/* FAQ                                                                        */
/* -------------------------------------------------------------------------- */

export type Faq = { question: string; answer: string };

export const faqIntro =
  'We understand that you may have questions about our services. Here are some of the most common queries we receive from our customers. If you don’t find your answer here, please feel free to reach out to us.';

export const homeFaqs: readonly Faq[] = [
  {
    question: 'What is hydrocarbon dry cleaning?',
    answer:
      "Hydrocarbon dry cleaning is a cutting-edge, eco-friendly cleaning method that uses natural, non-toxic solvents to clean your clothes. Unlike traditional dry cleaning methods that use harsh chemicals like petrol and thinner, hydrocarbon cleaning preserves the fabric's integrity and protects the environment.",
  },
  {
    question: 'How is VANZOO different from other dry cleaners?',
    answer:
      'VANZOO specializes in luxury fabric care with a focus on eco-friendly practices. We use imported Italian hydrocarbon technology, which is gentle on fabrics and safer for the environment. Additionally, our door-to-door service, expert care, and focus on premium garments set us apart from traditional dry cleaners who uses manual processes or outdated technology which is harmful for the environment and your health.',
  },
  {
    question: 'Is hydrocarbon dry cleaning safe for all types of fabrics?',
    answer:
      'Yes, hydrocarbon dry cleaning is safe for all types of fabrics, including delicate materials like silk, cashmere, and wool. It’s a gentle cleaning process that helps maintain the original texture, color, and shine of your garments.',
  },
  {
    question: 'How long does the cleaning process take?',
    answer:
      'Our standard turnaround time is 5-7 days. However, we also offer express services for urgent needs with same-day or 2-4 hour delivery options.',
  },
  {
    question: 'How do I book a pickup and delivery?',
    answer:
      "Booking a pickup is simple! Just click on the 'Book Pickup' button on our homepage, select your preferred time slot, and our team will come to your location to pick up your garments. We will return them cleaned and ready to wear at your convenience.",
  },
  {
    question: 'Are your services eco-friendly?',
    answer:
      'Absolutely! At VANZOO, we are committed to sustainability. We use eco-friendly hydrocarbon technology, and our packaging is designed to be sustainable and recyclable. We also take steps to minimize water and energy consumption throughout our process.',
  },
  {
    question: 'How do I contact you if I have more questions?',
    answer:
      "Feel free to reach out to us via the 'Contact' page, or use the 'Request an Enquiry' form below for a personalized response. We’re always here to help!",
  },
];

/* -------------------------------------------------------------------------- */
/* Enquiry form                                                               */
/* -------------------------------------------------------------------------- */

export const enquiryIntro =
  'We would love to hear from you! If you have any specific questions or need more information about our services, please fill out the form below, and our team will get back to you promptly.';

export const serviceTypes = [
  'Garment Care',
  'Bag Care',
  'Shoes Care',
  'Toys & Accessories Care',
  'Leather Care',
  'Curtains Care',
  'Carpet Care',
  'Express Service',
] as const;

export const contactTimes = [
  'Morning (9 AM – 12 PM)',
  'Afternoon (12 PM – 4 PM)',
  'Evening (4 PM – 8 PM)',
] as const;

/* -------------------------------------------------------------------------- */
/* About Us                                                                   */
/* -------------------------------------------------------------------------- */

export const about = {
  heading: 'Where Craft Meets Care',
  intro:
    'Luxury garments aren’t just worn — they’re lived in. VANZOO, a unit of Vaaruni Ventures LLP, elevates wardrobe care to an art form. At VANZOO, we blend couture-level precision with next-gen eco-cleaning. From bespoke suits to designer heels, every item is treated with the respect it deserves.',
  pillars: [
    {
      title: 'Tailored Luxury Care',
      body: 'Couture, leather, silk every item assessed and handled by trained artisans.',
      icon: '/images/icons/expert-care.png',
      iconAlt: 'Hanger with a star icon representing tailored luxury garment care',
    },
    {
      title: 'Italian Hydrocarbon Technology',
      body: 'Advanced, non-toxic cleaning that’s gentle on fabrics and safe for the planet.',
      icon: '/images/icons/hydrocarbon-technology.png',
      iconAlt: 'Gear and circuit icon representing Italian hydrocarbon cleaning technology',
    },
    {
      title: 'Eco-Conscious. Always.',
      body: 'Reusable packaging, zero harmful solvents, and sustainability in every stitch.',
      icon: '/images/icons/sustainability-core.png',
      iconAlt: 'Recycling icon representing eco-conscious packaging and solvent-free cleaning',
    },
  ],
  philosophy: {
    heading: 'Our Philosophy',
    statements: [
      'Luxury deserves reverence.',
      'We protect craftsmanship, preserve legacy, and do it sustainably.',
      'Because your wardrobe tells your story, and we’re here to keep it pristine.',
    ],
  },
  whoWeServe: {
    heading: 'Who We Serve',
    body: 'From boardroom power suits to heritage saris, we serve clients who expect more than clean clothes. They expect care, discretion, and elegance in every return.',
  },
  image: '/images/garment-rail-couture.jpg',
  imageAlt:
    'Rail of couture jackets and blazers awaiting eco-friendly dry cleaning at the Vanzoo Gurgaon atelier',
} as const;

/* -------------------------------------------------------------------------- */
/* Hydrocarbon Tech page                                                      */
/* -------------------------------------------------------------------------- */

export const hydrocarbon = {
  hero: {
    headline: ['Premium Fabric Care, Powered', 'by Safer Science.'],
    subhead:
      'Experience the luxury of hydrocarbon dry cleaning, engineered for high-end garments, refined for the environment.',
    image: '/images/service-hydrocarbon-machine.jpg',
    imageAlt:
      'Control panel of the closed-loop hydrocarbon dry cleaning system Vanzoo uses for luxury garments',
  },
  sections: [
    {
      id: 'why-hydrocarbon',
      eyebrow: 'Why Hydrocarbon?',
      heading: 'The Future of Dry Cleaning Is Here',
      body: 'Hydrocarbon solvents are a modern, eco-forward replacement to PERC – safer for fabric, skin, and planet. At Vanzoo, we harness this innovation to offer a Premium Organic Dryclean experience that’s gentle, efficient, and sustainable.',
      image: '/images/tech-hydrocarbon-plant.jpg',
      imageAlt:
        'Industrial hydrocarbon dry cleaning plant used by Vanzoo as an eco-friendly replacement for PERC',
    },
    {
      id: 'how-it-works',
      eyebrow: 'How It Works',
      heading: 'The Future of Dry Cleaning Is Here',
      body: 'Our closed-loop hydrocarbon systems replace water with refined solvents, dissolving stains while maintaining garment softness. Machines purify and recycle 99% of solvent with each cycle.',
      image: '/images/tech-hydrocarbon-machine.jpg',
      imageAlt:
        'Closed-loop hydrocarbon dry cleaning machine that purifies and recycles 99% of solvent each cycle',
    },
  ],
  /** Sustainability infographic — "no harmful solvents, zero waste, eco-friendly
   *  packaging" — shown alongside the environmental FAQ answers. */
  sustainabilityImage: {
    src: '/images/tech-sustainability-wide.jpg',
    alt: 'Vanzoo sustainability diagram: no harmful solvents, zero waste, and eco-friendly reusable packaging',
  },
  comparison: {
    eyebrow: 'Why Switch?',
    heading: 'Hydrocarbon vs. Traditional Dry Cleaning (PERC)',
    items: [
      {
        title: 'Protects Luxury Fibers',
        body: 'No stiffness, shrinkage or chemical damage',
        icon: '/images/icons/protects-fibers.png',
        iconAlt: 'Shield icon representing protection of luxury fibers during cleaning',
      },
      {
        title: 'Eco-Friendly Process',
        body: 'Up to 99% solvent recycling',
        icon: '/images/icons/eco-process.png',
        iconAlt: 'Leaf icon representing an eco-friendly process with 99% solvent recycling',
      },
      {
        title: 'Compliant & Safe',
        body: 'With modern emission & fire-safety controls',
        icon: '/images/icons/compliant-safe.png',
        iconAlt: 'Certified gear icon representing emission and fire-safety compliance',
      },
      {
        title: 'No Harsh Odors',
        body: 'Clean finish every time',
        icon: '/images/icons/no-harsh-odors.png',
        iconAlt: 'Air flow icon representing an odour-free clean finish',
      },
    ],
  },
  processImage: {
    src: '/images/tech-nine-step-process.jpg',
    alt: 'Vanzoo nine-step garment care process from pickup and item collection through targeted stain treatment, premium hydrocarbon cleaning, drying, finishing touches, final quality inspection and secure packaging and delivery',
  },
  faqs: [
    {
      question: 'How does the hydrocarbon cleaning system actually work?',
      answer:
        'Hydrocarbon cleaning machines are closed-loop systems that combine controlled solvent immersion, gentle tumbling, and precise temperature management. During the cycle: the solvent dissolves oils and impurities without water or detergents; the machine continuously filters and distills the solvent, removing particulates and contaminants; solvent vapors are condensed and recovered for reuse, ensuring minimal waste. The entire process occurs in a sealed environment, so no solvent escapes into the air or water supply.',
    },
    {
      question: 'What makes hydrocarbon technology gentler on fabrics?',
      answer:
        'The hydrocarbon solvent has a lower surface tension and operates at lower mechanical and thermal stress levels than conventional methods. This prevents fiber swelling, color migration, and texture distortion. Because the solvent does not bond with water, materials like silk, cashmere, lace, and wool retain their original luster, softness, and drape even after multiple cleanings. This is why hydrocarbon systems are trusted for delicate couture, hand-finished garments, and technical fabrics that require precision care.',
    },
    {
      question: 'What environmental advantages does hydrocarbon technology offer?',
      answer:
        'Hydrocarbon systems are designed for solvent recovery and reuse, capturing nearly 99% of the solvent per cycle. The solvent itself is biodegradable, low-odor, and classified as low-toxicity under most international standards. Unlike PERC, which can contaminate soil and groundwater, hydrocarbon solvents are lighter-than-water (LNAPLs) and easier to contain or remediate. Combined with energy-efficient equipment, this makes hydrocarbon cleaning one of the most environmentally responsible fabric care technologies currently in use.',
    },
    {
      question: 'How does hydrocarbon cleaning ensure safety and health?',
      answer:
        'Hydrocarbon cleaning systems are engineered for safety at every stage. The solvents used are high-flashpoint and chemically stable, making them far less flammable and volatile than traditional dry-cleaning agents. Each machine operates in a sealed environment with advanced ventilation, solvent recovery, and filtration systems that prevent vapor release and maintain clean air quality. Designed to meet strict environmental and occupational standards, these systems provide reliable performance with minimal risk to people or the environment.',
    },
    {
      question: 'Why has Vanzoo chosen hydrocarbon technology?',
      answer:
        'Vanzoo chooses hydrocarbon cleaning as part of a deliberate approach to garment care, one that values precision, responsibility, and respect for materials. The technology provides deep, effective cleaning while remaining gentle on fabrics and environmentally considerate. Every piece is treated with care, ensuring its texture, color, and structure are preserved through a process built on modern science and mindful practice.',
    },
    {
      question: 'What makes Vanzoo different from other dry cleaners?',
      answer:
        'At Vanzoo, garment care is guided by precision and respect for materials. We use advanced hydrocarbon systems paired with engineering expertise to ensure every piece is cleaned safely and thoughtfully. Each fabric is assessed individually and treated with carefully calibrated programs that protect texture, color, and structure. Our facility operates with high-efficiency solvent recovery and strict safety standards, combining modern technology with considered craftsmanship. The result is consistent, responsible care that keeps your garments looking and feeling their best.',
    },
    {
      question: 'How is hydrocarbon technology shaping the future of fabric care?',
      answer:
        'Hydrocarbon technology marks a shift toward cleaner, more precise garment care. Its refined solvent chemistry and digitally controlled systems allow for deep cleaning with reduced stress on fabrics and lower environmental impact. Modern machines continuously filter and recycle the solvent, minimizing waste and energy use. As research advances, new bio-based hydrocarbon solvents are emerging, offering the same performance with renewable origins. For Vanzoo, this technology represents a future where science and responsibility work in harmony.',
    },
  ] as readonly Faq[],
} as const;

/* -------------------------------------------------------------------------- */
/* Photo-brick collage (homepage, used once per §2.3.5)                       */
/* -------------------------------------------------------------------------- */

/**
 * Photo-brick collage. The spans are sized to fill a 4-column grid exactly:
 * one 2×2 hero brick plus four squares complete two rows, then the wide banner
 * takes a full row of its own. Changing the count means re-checking the spans,
 * or the grid ends up with holes.
 */
export const collage = [
  {
    src: '/images/garment-rail-couture.jpg',
    alt: 'Rail of pastel couture blazers cleaned and pressed at the Vanzoo Gurgaon atelier',
    span: 'col-span-2 lg:row-span-2',
    ratio: 'aspect-square lg:aspect-auto',
  },
  {
    src: '/images/collage-folded-linens.jpg',
    alt: 'Neatly folded cleaned linens and towels after Vanzoo fabric care',
    span: '',
    ratio: 'aspect-square',
  },
  {
    src: '/images/collage-lehenga-detail.jpg',
    alt: 'Close-up of bridal lehenga embroidery being cleaned by hand at Vanzoo',
    span: '',
    ratio: 'aspect-square',
  },
  {
    src: '/images/collage-family-heirloom.jpg',
    alt: 'Child in a preserved heirloom dress cleaned with museum-grade Vanzoo care',
    span: '',
    ratio: 'aspect-square',
  },
  {
    src: '/images/process-schedule-call.jpg',
    alt: 'Customer booking a Vanzoo dry cleaning pickup by phone from home in Gurgaon',
    span: '',
    ratio: 'aspect-square',
  },
  {
    src: '/images/banner-we-care.jpg',
    alt: 'Vanzoo brand banner reading not just clothes, we care for what matters, beside a cleaned leather bag',
    span: 'col-span-2 sm:col-span-3 lg:col-span-4',
    ratio: 'aspect-[2/1] sm:aspect-[16/5] lg:aspect-[24/5]',
  },
] as const;
