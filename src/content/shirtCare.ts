/**
 * Deep-dive content for the Shirt product page, /products/shirt/.
 *
 * Kept in its own file rather than folded into `products.ts` because this is
 * bespoke, garment-specific editorial copy (comparison table, process,
 * technology, fabric/stain notes, FAQs) — not data a second product page would
 * reuse as-is. `getShirtCareContent(id)` returns this only for `id === 'shirt'`,
 * so adding a plain product later doesn't inherit a wall of shirt-only copy.
 *
 * Every claim here is one Vanzoo already makes elsewhere on the site
 * (content/marketing.ts, content/hydrocarbon.ts): individual assessment,
 * closed-loop hydrocarbon cleaning with solvent recovery, hand finishing, free
 * pickup and delivery, and the 3–5 day / express turnaround. Nothing here adds
 * a certification, a percentage, a guarantee or a testimonial that isn't
 * already published.
 */

import type { Faq } from './marketing';

export type CareOption = {
  title: string;
  description: string;
  bestFor: readonly string[];
  result: string;
  cta: string;
};

export type FeatureItem = { title: string; body: string };

export type ProcessStage = { title: string; body: string };

export type FabricCareItem = { title: string; body: string };

export type ComparisonRow = { label: string; dryClean: boolean; steamPress: boolean };

export type AudienceItem = { title: string; body: string };

export type ShirtCareContent = {
  metaTitle: string;
  metaDescription: string;
  hero: {
    headline: string;
    intro: string;
    pickupNote: string;
    turnaroundNote: string;
  };
  careOptions: readonly CareOption[];
  whyCare: {
    heading: string;
    body: readonly string[];
    features: readonly FeatureItem[];
  };
  process: {
    heading: string;
    stages: readonly ProcessStage[];
  };
  technology: {
    heading: string;
    subheading: string;
    body: string;
    features: readonly (FeatureItem & { icon: string; iconAlt: string })[];
  };
  detailCare: {
    heading: string;
    items: readonly FeatureItem[];
  };
  fabricCare: {
    heading: string;
    items: readonly FabricCareItem[];
    disclaimer: string;
  };
  stainCare: {
    heading: string;
    intro: string;
    stains: readonly string[];
    beforeCleaning: { heading: string; body: string };
    qualifier: string;
  };
  comparison: {
    heading: string;
    columns: readonly [string, string];
    rows: readonly ComparisonRow[];
    guide: readonly { question: string; answer: string }[];
  };
  whyVanzoo: {
    heading: string;
    features: readonly FeatureItem[];
  };
  audiences: {
    heading: string;
    items: readonly AudienceItem[];
  };
  doorstep: {
    heading: string;
    steps: readonly FeatureItem[];
    statement: string;
    cta: string;
  };
  faqs: readonly Faq[];
  finalCta: {
    heading: string;
    intro: string;
    lines: readonly string[];
    cta: string;
    secondary: string;
  };
};

const shirtCare: ShirtCareContent = {
  metaTitle: 'Professional Shirt Dry Cleaning & Steam Press | Vanzoo',
  metaDescription:
    'Professional shirt dry cleaning, pressing and steam finishing by Vanzoo. Italian hydrocarbon technology, careful garment finishing and convenient doorstep pickup and delivery.',
  hero: {
    headline: 'Professional Shirt Care, Finished to Perfection',
    intro:
      'From everyday cottons to premium business shirts, Vanzoo cleans, presses and finishes every shirt with the attention it deserves.',
    pickupNote: 'Free Pickup & Delivery',
    turnaroundNote: 'Standard turnaround: 3–5 days · Express options available',
  },

  careOptions: [
    {
      title: 'Dry Clean & Press',
      description: 'For shirts that need professional cleaning as well as a polished finish.',
      bestFor: [
        'Formal shirts',
        'Premium cotton shirts',
        'Designer shirts',
        'Shirts with visible stains or marks',
        'Shirts that need deeper cleaning',
        'Shirts requiring careful collar and cuff treatment',
      ],
      result: 'Professional cleaning followed by professional finishing and pressing.',
      cta: 'Choose Dry Clean & Press',
    },
    {
      title: 'Steam Press',
      description:
        'For shirts that are already clean but need wrinkle removal and a crisp, ready-to-wear finish.',
      bestFor: [
        'Recently washed shirts',
        'Lightly worn shirts',
        'Wrinkled shirts',
        'Business shirts',
        'Everyday wardrobe maintenance',
        'Preparing for meetings or events',
      ],
      result: 'Steam treatment, wrinkle removal and professional pressing.',
      cta: 'Choose Steam Press',
    },
  ],

  whyCare: {
    heading: 'A Crisp Shirt Is About More Than Removing Wrinkles',
    body: [
      'A shirt can be clean and still look tired.',
      'Collars lose their shape. Cuffs become soft and uneven. Wrinkles settle into the fabric. Repeated ironing can leave fabrics looking flat.',
      'At Vanzoo, we focus on the details that make a freshly cared-for shirt look different.',
    ],
    features: [
      {
        title: 'Crisp Collars',
        body: 'Careful finishing around the collar for a structured, polished appearance.',
      },
      {
        title: 'Sharp Cuffs',
        body: 'Cuffs are finished with attention to their shape and edges.',
      },
      {
        title: 'Smooth Fabric',
        body: 'Professional finishing helps remove wrinkles while maintaining the character of the fabric.',
      },
      {
        title: 'Ready to Wear',
        body: 'Your shirt comes back professionally finished, packed and ready for your wardrobe.',
      },
    ],
  },

  process: {
    heading: 'From Your Wardrobe to Ready-to-Wear',
    stages: [
      {
        title: 'Doorstep Pickup',
        body: 'Schedule your pickup online or through the Vanzoo app. Our valet collects your shirts directly from your doorstep.',
      },
      {
        title: 'Individual Assessment',
        body: 'Every garment is assessed before cleaning. Fabric, stains, construction and care requirements are considered before treatment.',
      },
      {
        title: 'Stain & Spot Treatment',
        body: 'Visible stains and marks are identified and treated appropriately before the main cleaning process.',
      },
      {
        title: 'Professional Cleaning',
        body: "For Dry Clean & Press orders, the shirt is cleaned using Vanzoo's closed-loop hydrocarbon cleaning system.",
      },
      {
        title: 'Careful Drying',
        body: 'The garment is dried under controlled conditions appropriate to the cleaning process.',
      },
      {
        title: 'Hand Finishing',
        body: 'The shirt is professionally pressed and finished, with particular attention to collars, cuffs and overall presentation.',
      },
      {
        title: 'Quality Inspection',
        body: 'The finished shirt is checked before packaging.',
      },
      {
        title: 'Protective Packaging',
        body: 'Your shirt is carefully packed to help keep it clean and presentable.',
      },
      {
        title: 'Doorstep Delivery',
        body: 'Your finished shirt is returned to your door, ready for your wardrobe.',
      },
    ],
  },

  technology: {
    heading: 'Powered by Italian Hydrocarbon Technology',
    subheading: 'Advanced Cleaning. Considered Fabric Care.',
    body: 'Vanzoo uses a closed-loop hydrocarbon cleaning system designed for professional garment care. Unlike conventional water-based washing, the process uses a hydrocarbon solvent to clean garments while allowing the cleaning solvent to be recovered and reused within the system.',
    features: [
      {
        title: 'Gentle on Fabrics',
        body: 'Designed for professional care of garments where fabric integrity matters.',
        icon: '/images/icons/skin-friendly.png',
        iconAlt: 'Skin layer icon representing gentle fabric-safe cleaning',
      },
      {
        title: 'Effective Cleaning',
        body: 'Helps dissolve oily soils and everyday grime that water-based cleaning may not handle in the same way.',
        icon: '/images/icons/hydrocarbon-technology.png',
        iconAlt: 'Gear and circuit icon representing hydrocarbon cleaning technology',
      },
      {
        title: 'Controlled Process',
        body: 'Each garment is assessed before entering the cleaning process.',
        icon: '/images/icons/compliant-safe.png',
        iconAlt: 'Certified gear icon representing a controlled, assessed cleaning process',
      },
      {
        title: 'Closed-Loop System',
        body: 'The solvent is recovered and recycled as part of the cleaning cycle.',
        icon: '/images/icons/eco-process.png',
        iconAlt: 'Leaf icon representing a closed-loop, solvent-recycling process',
      },
    ],
  },

  detailCare: {
    heading: 'The Details Matter',
    items: [
      {
        title: 'Collar',
        body: 'Careful cleaning and finishing around one of the most visible parts of your shirt.',
      },
      { title: 'Cuffs', body: 'Finished neatly to maintain a polished appearance.' },
      {
        title: 'Placket',
        body: "Handled carefully to maintain the shirt's structure and presentation.",
      },
      {
        title: 'Sleeves',
        body: "Pressed smoothly without compromising the garment's natural shape.",
      },
      {
        title: 'Fabric',
        body: 'Treatment selected according to the garment and its care requirements.',
      },
      {
        title: 'Overall Finish',
        body: 'A final inspection before the shirt is packed and returned.',
      },
    ],
  },

  fabricCare: {
    heading: 'Shirt Care Across Different Fabrics',
    items: [
      {
        title: 'Cotton',
        body: 'Everyday shirts that benefit from professional cleaning and a crisp finish.',
      },
      {
        title: 'Linen',
        body: 'Lightweight fabrics that require careful handling and finishing to retain their natural character.',
      },
      { title: 'Silk', body: 'Delicate shirts requiring specialised fabric care.' },
      {
        title: 'Blended Fabrics',
        body: 'Professional treatment according to the fabric composition and care requirements.',
      },
      {
        title: 'Premium & Designer Shirts',
        body: 'For garments where preserving construction, texture and finish matters as much as cleaning.',
      },
    ],
    disclaimer: "Care is always determined by the garment's fabric composition, construction and care label.",
  },

  stainCare: {
    heading: 'From Everyday Marks to Stubborn Stains',
    intro: 'Shirts face some of the most common everyday stains and marks.',
    stains: [
      'Sweat & body oils',
      'Food & beverage marks',
      'Coffee & tea',
      'Makeup',
      'Grease & oil',
      'Collar & cuff buildup',
      'Dust and everyday grime',
    ],
    beforeCleaning: {
      heading: 'Professional Stain Treatment Begins Before Cleaning',
      body: 'Every garment is assessed individually so visible stains and problem areas can be identified before the cleaning cycle.',
    },
    qualifier:
      'Stain removal results depend on the type of stain, fabric, age of the stain and previous treatment.',
  },

  comparison: {
    heading: 'Which Service Should You Choose?',
    columns: ['Dry Clean & Press', 'Steam Press'],
    rows: [
      { label: 'Deep cleaning', dryClean: true, steamPress: false },
      { label: 'Removes wrinkles', dryClean: true, steamPress: true },
      { label: 'Professional pressing', dryClean: true, steamPress: true },
      { label: 'Stain treatment', dryClean: true, steamPress: false },
      { label: 'Best for worn shirts', dryClean: true, steamPress: false },
      { label: 'Best for freshly washed shirts', dryClean: false, steamPress: true },
      { label: 'Collar & cuff finishing', dryClean: true, steamPress: true },
      { label: 'Ideal for quick refresh', dryClean: false, steamPress: true },
    ],
    guide: [
      { question: 'Shirt is clean but wrinkled?', answer: 'Choose Steam Press.' },
      { question: 'Shirt needs cleaning?', answer: 'Choose Dry Clean & Press.' },
      { question: 'Still unsure?', answer: 'Send it for professional assessment.' },
    ],
  },

  whyVanzoo: {
    heading: 'Why Trust Your Shirts With Vanzoo?',
    features: [
      {
        title: 'Premium Garment Care',
        body: 'Your shirt is treated as an individual garment rather than simply another item in a laundry batch.',
      },
      {
        title: 'Advanced Cleaning Technology',
        body: 'Italian hydrocarbon technology with a closed-loop cleaning system.',
      },
      {
        title: 'Hand-Finished',
        body: 'Finishing is performed with attention to presentation, including collars and cuffs.',
      },
      {
        title: 'Doorstep Convenience',
        body: 'Schedule your pickup online or through the app and have your garments collected and delivered back to you.',
      },
      {
        title: 'Express Options',
        body: 'Standard turnaround is 3–5 days, with same-day and next-day express options available.',
      },
      {
        title: 'Considered Packaging',
        body: 'Garments are professionally packed before delivery.',
      },
    ],
  },

  audiences: {
    heading: 'Made for Shirts That Matter',
    items: [
      {
        title: 'Business Professionals',
        body: 'Keep your work shirts sharp for meetings, presentations and everyday office wear.',
      },
      {
        title: 'Executives',
        body: 'For wardrobes where a polished appearance is part of the job.',
      },
      {
        title: 'Frequent Travelers',
        body: 'Get shirts professionally cleaned and finished without finding a laundry service at every destination.',
      },
      {
        title: 'Special Occasions',
        body: 'Prepare formal shirts before weddings, dinners, events and celebrations.',
      },
      {
        title: 'Premium Wardrobes',
        body: 'For customers who want professional care for designer and premium garments.',
      },
    ],
  },

  doorstep: {
    heading: 'Your Shirt Care, Without the Errand',
    steps: [
      { title: 'Book', body: 'Choose your service and pickup slot online or through the Vanzoo app.' },
      { title: 'We Collect', body: 'Our valet collects your garments from your doorstep.' },
      {
        title: 'We Care',
        body: "Your shirt goes through Vanzoo's professional cleaning and finishing process.",
      },
      {
        title: 'We Deliver',
        body: 'Your finished shirt is returned to your doorstep, ready for your wardrobe.',
      },
    ],
    statement: 'No shop visits. No waiting around.',
    cta: 'Schedule a Pickup',
  },

  faqs: [
    {
      question: 'Should I choose Dry Clean or Steam Press for my shirt?',
      answer:
        'Choose Steam Press when the shirt is already clean but needs wrinkle removal and a crisp finish. Choose Dry Clean & Press when the shirt requires professional cleaning.',
    },
    {
      question: 'How long does shirt cleaning take?',
      answer:
        "Vanzoo's standard turnaround is 3–5 days. Same-day and next-day express options are also available, subject to service availability.",
    },
    {
      question: 'Do you pick up shirts from home?',
      answer: 'Yes. Vanzoo offers doorstep pickup and delivery across its service areas.',
    },
    {
      question: 'Will you treat stains on my shirt?',
      answer:
        'Garments are assessed individually and stains can be identified and treated as part of the cleaning process. Results depend on the stain, fabric, age and previous treatment.',
    },
    {
      question: 'Can you clean delicate shirts?',
      answer:
        'Vanzoo provides specialised care for delicate fabrics. Treatment is determined according to the garment and its care requirements.',
    },
    {
      question: 'Will my shirt be pressed after dry cleaning?',
      answer: 'Yes. Dry Clean & Press includes professional finishing and pressing.',
    },
    {
      question: 'Can I get express shirt service?',
      answer:
        'Same-day and next-day express options are available, subject to pickup location, timing and service availability.',
    },
    {
      question: 'How do I book?',
      answer: "Select your service, add it to your cart and schedule a pickup through Vanzoo's booking flow.",
    },
  ],

  finalCta: {
    heading: 'Your Shirt. Professionally Cared For.',
    intro: 'From the first pickup to the final fold, every detail is handled with care.',
    lines: ['Professional cleaning.', 'Hand finishing.', 'Doorstep convenience.'],
    cta: 'Book Your Shirt Pickup',
    secondary: 'Free pickup & delivery across Gurgaon',
  },
};

const shirtCareContentById: Record<string, ShirtCareContent> = {
  shirt: shirtCare,
};

export function getShirtCareContent(productId: string): ShirtCareContent | undefined {
  return shirtCareContentById[productId];
}
