/**
 * Deep-dive content for every /products/[slug]/ page.
 *
 * Shirt was the first page built here and stays fully bespoke — its own
 * prose in every section. The other 33 garments reuse six category
 * "buckets" (structured apparel, delicate knits & wraps, ethnic wear, home
 * textiles, leather & footwear, soft toys), each with its own detail-care,
 * fabric-care, stain and audience copy genuinely written for that category —
 * so a curtain page and a sherwani page read differently — while hero copy,
 * FAQs and the comparison table are generated per garment from its own title
 * and whether it has one or two service options.
 *
 * Every claim below is one Vanzoo already makes elsewhere on the site
 * (content/marketing.ts, content/hydrocarbon.ts): individual assessment,
 * closed-loop hydrocarbon cleaning with solvent recovery, hand finishing,
 * free pickup and delivery, and the 3–5 day / express turnaround. Nothing
 * here adds a certification, a percentage, a guarantee or a testimonial
 * that isn't already published.
 */

import type { Faq } from './marketing';
import { productEntries, type ProductEntry } from './products';
import { getShirtCareContent } from './shirtCare';

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

export type ProductCareContent = {
  metaTitle: string;
  metaDescription: string;
  hero: {
    headline: string;
    intro: string;
    pickupNote: string;
    turnaroundNote: string;
  };
  /** Absent for garments with only one published service option — the page
   *  skips the "choose the right care" cards and the comparison table. */
  careOptions?: readonly CareOption[];
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
  comparison?: {
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

/* -------------------------------------------------------------------------- */
/* Shared, garment-agnostic sections                                          */
/* -------------------------------------------------------------------------- */

/** The nine-stage care process — also shown on every /areas-we-serve/ page. */
export const sharedProcess: ProductCareContent['process'] = {
  heading: 'From Your Wardrobe to Ready-to-Wear',
  stages: [
    {
      title: 'Doorstep Pickup',
      body: 'Schedule your pickup online or through the Vanzoo app. Our valet collects your items directly from your doorstep.',
    },
    {
      title: 'Individual Assessment',
      body: 'Every item is assessed before cleaning. Fabric, stains, construction and care requirements are considered before treatment.',
    },
    {
      title: 'Stain & Spot Treatment',
      body: 'Visible stains and marks are identified and treated appropriately before the main cleaning process.',
    },
    {
      title: 'Professional Cleaning',
      body: "For Dry Clean & Press orders, your item is cleaned using Vanzoo's closed-loop hydrocarbon cleaning system.",
    },
    {
      title: 'Careful Drying',
      body: 'The item is dried under controlled conditions appropriate to the cleaning process.',
    },
    {
      title: 'Hand Finishing',
      body: 'Your item is professionally pressed and finished, with particular attention to detail and overall presentation.',
    },
    {
      title: 'Quality Inspection',
      body: 'The finished item is checked before packaging.',
    },
    {
      title: 'Protective Packaging',
      body: 'Your item is carefully packed to help keep it clean and presentable.',
    },
    {
      title: 'Doorstep Delivery',
      body: 'Your finished item is returned to your door, ready for your wardrobe or home.',
    },
  ],
};

const sharedTechnology: ProductCareContent['technology'] = {
  heading: 'Powered by Italian Hydrocarbon Technology',
  subheading: 'Advanced Cleaning. Considered Fabric Care.',
  body: 'Vanzoo uses a closed-loop hydrocarbon cleaning system designed for professional garment care. Unlike conventional water-based washing, the process uses a hydrocarbon solvent to clean items while allowing the cleaning solvent to be recovered and reused within the system.',
  features: [
    {
      title: 'Gentle on Fabrics',
      body: 'Designed for professional care of items where fabric integrity matters.',
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
      body: 'Each item is assessed before entering the cleaning process.',
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
};

const sharedWhyVanzoo: ProductCareContent['whyVanzoo'] = {
  heading: 'Why Trust Vanzoo With Your Care?',
  features: [
    {
      title: 'Premium Garment Care',
      body: 'Your item is treated individually rather than simply another piece in a laundry batch.',
    },
    {
      title: 'Advanced Cleaning Technology',
      body: 'Italian hydrocarbon technology with a closed-loop cleaning system.',
    },
    {
      title: 'Hand-Finished',
      body: 'Finishing is performed with attention to presentation and detail.',
    },
    {
      title: 'Doorstep Convenience',
      body: 'Schedule your pickup online or through the app and have your items collected and delivered back to you.',
    },
    {
      title: 'Express Options',
      body: 'Standard turnaround is 3–5 days, with same-day and next-day express options available.',
    },
    {
      title: 'Considered Packaging',
      body: 'Items are professionally packed before delivery.',
    },
  ],
};

function sharedDoorstep(title: string): ProductCareContent['doorstep'] {
  const lower = title.toLowerCase();
  return {
    heading: `Your ${title} Care, Without the Errand`,
    steps: [
      { title: 'Book', body: 'Choose your service and pickup slot online or through the Vanzoo app.' },
      { title: 'We Collect', body: 'Our valet collects your items from your doorstep.' },
      { title: 'We Care', body: `Your ${lower} goes through Vanzoo's professional cleaning and finishing process.` },
      { title: 'We Deliver', body: `Your finished ${lower} is returned to your doorstep, ready for use.` },
    ],
    statement: 'No shop visits. No waiting around.',
    cta: 'Schedule a Pickup',
  };
}

function genericFaqs(title: string, hasComparison: boolean): readonly Faq[] {
  const lower = title.toLowerCase();
  const base: Faq[] = hasComparison
    ? [
        {
          question: `Should I choose Dry Clean or Steam Press for my ${lower}?`,
          answer: `Choose Steam Press when the ${lower} is already clean but needs wrinkle removal and a crisp finish. Choose Dry Clean & Press when it requires professional cleaning.`,
        },
      ]
    : [];
  return [
    ...base,
    {
      question: `How long does ${lower} cleaning take?`,
      answer:
        "Vanzoo's standard turnaround is 3–5 days. Same-day and next-day express options are also available, subject to service availability.",
    },
    {
      question: `Do you pick up ${lower}s from home?`,
      answer: 'Yes. Vanzoo offers doorstep pickup and delivery across its service areas.',
    },
    {
      question: `Will you treat stains on my ${lower}?`,
      answer:
        'Items are assessed individually and stains can be identified and treated as part of the cleaning process. Results depend on the stain, fabric, age and previous treatment.',
    },
    {
      question: 'Can you clean delicate items?',
      answer:
        'Vanzoo provides specialised care for delicate fabrics. Treatment is determined according to the item and its care requirements.',
    },
    ...(hasComparison
      ? [
          {
            question: `Will my ${lower} be pressed after dry cleaning?`,
            answer: 'Yes. Dry Clean & Press includes professional finishing and pressing.',
          },
        ]
      : []),
    {
      question: 'Can I get express service?',
      answer:
        'Same-day and next-day express options are available, subject to pickup location, timing and service availability.',
    },
    {
      question: 'How do I book?',
      answer: "Select your service, add it to your cart and schedule a pickup through Vanzoo's booking flow.",
    },
  ];
}

function genericFinalCta(title: string): ProductCareContent['finalCta'] {
  return {
    heading: `Your ${title}. Professionally Cared For.`,
    intro: 'From the first pickup to the final fold, every detail is handled with care.',
    lines: ['Professional cleaning.', 'Hand finishing.', 'Doorstep convenience.'],
    cta: `Book Your ${title} Pickup`,
    secondary: 'Free pickup & delivery across Gurgaon',
  };
}

function genericComparison(title: string): NonNullable<ProductCareContent['comparison']> {
  const lower = title.toLowerCase();
  return {
    heading: 'Which Service Should You Choose?',
    columns: ['Dry Clean & Press', 'Steam Press'],
    rows: [
      { label: 'Deep cleaning', dryClean: true, steamPress: false },
      { label: 'Removes wrinkles', dryClean: true, steamPress: true },
      { label: 'Professional pressing', dryClean: true, steamPress: true },
      { label: 'Stain treatment', dryClean: true, steamPress: false },
      { label: `Best for well-worn ${lower}s`, dryClean: true, steamPress: false },
      { label: 'Best for freshly washed items', dryClean: false, steamPress: true },
      { label: 'Detail finishing', dryClean: true, steamPress: true },
      { label: 'Ideal for quick refresh', dryClean: false, steamPress: true },
    ],
    guide: [
      { question: `${title} is clean but wrinkled?`, answer: 'Choose Steam Press.' },
      { question: `${title} needs cleaning?`, answer: 'Choose Dry Clean & Press.' },
      { question: 'Still unsure?', answer: 'Send it for professional assessment.' },
    ],
  };
}

/* -------------------------------------------------------------------------- */
/* Category buckets                                                           */
/* -------------------------------------------------------------------------- */

type Bucket = {
  whyCare: ProductCareContent['whyCare'];
  detailCare: ProductCareContent['detailCare'];
  fabricCare: ProductCareContent['fabricCare'];
  stainCare: Omit<ProductCareContent['stainCare'], 'heading' | 'intro'> & {
    heading: string;
    intro: (title: string) => string;
  };
  audiences: ProductCareContent['audiences'];
  bestFor: { dryClean: readonly string[]; steam: readonly string[] };
};

const structuredApparel: Bucket = {
  whyCare: {
    heading: 'A Sharp Finish Is About More Than Removing Wrinkles',
    body: [
      'A garment can be clean and still look tired.',
      'Seams lose their crispness. Fabric holds creases in the wrong places. Repeated ironing can leave fabric looking flat.',
      'At Vanzoo, we focus on the details that make a freshly cared-for garment look different.',
    ],
    features: [
      { title: 'Sharp Finish', body: 'Careful pressing gives a clean, structured line wherever the garment needs it.' },
      { title: 'Clean Seams', body: "Seams and stitching are pressed flat without flattening the garment's shape." },
      { title: 'Smooth Fabric', body: "Professional finishing removes wrinkles while keeping the fabric's character." },
      { title: 'Ready to Wear', body: 'Comes back professionally finished, packed and ready for your wardrobe.' },
    ],
  },
  detailCare: {
    heading: 'The Details Matter',
    items: [
      { title: 'Seams & Stitching', body: "Checked and pressed flat without flattening the garment's shape." },
      { title: 'Fastenings', body: 'Buttons, zips and hooks handled carefully during cleaning and pressing.' },
      { title: 'Lining', body: 'Where a garment is lined, the lining is treated as carefully as the outer fabric.' },
      { title: 'Fabric', body: 'Treatment selected according to the garment and its care requirements.' },
      { title: 'Shape & Structure', body: 'Pressed to hold its shape rather than flattened into the wrong crease.' },
      { title: 'Overall Finish', body: 'A final inspection before the garment is packed and returned.' },
    ],
  },
  fabricCare: {
    heading: 'Care Across Different Fabrics',
    items: [
      { title: 'Cotton', body: 'Everyday pieces that benefit from professional cleaning and a crisp finish.' },
      { title: 'Wool & Blends', body: 'Structured fabrics that hold a press well when handled correctly.' },
      { title: 'Synthetic & Technical Fabrics', body: 'Treated according to their specific care requirements.' },
      { title: 'Linen', body: 'Lightweight fabric that needs careful handling to retain its natural character.' },
      {
        title: 'Premium & Designer Pieces',
        body: 'For garments where preserving construction, texture and finish matters as much as cleaning.',
      },
    ],
    disclaimer: "Care is always determined by the garment's fabric composition, construction and care label.",
  },
  stainCare: {
    heading: 'From Everyday Marks to Stubborn Stains',
    intro: (title) => `${title}s face some of the most common everyday stains and marks.`,
    stains: ['Sweat & body oils', 'Food & beverage marks', 'Mud & outdoor marks', 'Grease & oil', 'Ink marks', 'Dust and everyday grime'],
    beforeCleaning: {
      heading: 'Professional Stain Treatment Begins Before Cleaning',
      body: 'Every item is assessed individually so visible stains and problem areas can be identified before the cleaning cycle.',
    },
    qualifier: 'Stain removal results depend on the type of stain, fabric, age of the stain and previous treatment.',
  },
  audiences: {
    heading: 'Made for Wardrobes That Matter',
    items: [
      { title: 'Business Professionals', body: 'Keep your work wardrobe sharp for meetings, presentations and everyday office wear.' },
      { title: 'Executives', body: 'For wardrobes where a polished appearance is part of the job.' },
      { title: 'Frequent Travelers', body: 'Get garments professionally cleaned and finished without finding a laundry service at every destination.' },
      { title: 'Special Occasions', body: 'Prepare formal pieces before weddings, dinners, events and celebrations.' },
      { title: 'Everyday Wardrobes', body: 'For customers who want considered, professional care for the pieces they wear most.' },
    ],
  },
  bestFor: {
    dryClean: [
      'Formal pieces',
      'Premium fabrics',
      'Designer pieces',
      'Items with visible stains or marks',
      'Items that need deeper cleaning',
      'Pieces requiring careful seam and fabric treatment',
    ],
    steam: [
      'Recently washed items',
      'Lightly worn pieces',
      'Wrinkled items',
      'Everyday wear',
      'Wardrobe maintenance',
      'Preparing for meetings or events',
    ],
  },
};

const delicateKnits: Bucket = {
  whyCare: {
    heading: 'Wool and Cashmere Need a Gentler Hand',
    body: [
      'A knit or wrap can lose its character long before it looks dirty.',
      'Fibres stiffen, shapes stretch out of place, and repeated washing can felt a fine weave.',
      'At Vanzoo, we treat delicate knits and wraps with the lower-stress process they need.',
    ],
    features: [
      { title: 'Softness Preserved', body: 'Cleaned at lower mechanical stress so the fibre keeps its natural feel.' },
      { title: 'Shape Retained', body: 'Finished flat or on a form so it keeps its original shape, not a stretched one.' },
      { title: 'No Stiffness or Shrinkage', body: 'A gentler process helps avoid the stiffness or shrinkage a harsh wash can cause.' },
      { title: 'Ready to Wear', body: 'Comes back professionally finished, packed and ready for your wardrobe.' },
    ],
  },
  detailCare: {
    heading: 'The Details Matter',
    items: [
      { title: 'Fibre Care', body: 'Handled to protect the natural softness and lustre of the material.' },
      { title: 'Shape & Stretch', body: 'Finished to avoid stretching the knit out of its original shape.' },
      { title: 'Trims & Edges', body: 'Ribbing, hems and borders finished with attention to their edges.' },
      { title: 'Colour', body: 'Assessed before cleaning so colour is treated appropriately.' },
      { title: 'Fabric', body: 'Treatment selected according to the fibre and its care requirements.' },
      { title: 'Overall Finish', body: 'A final inspection before the item is packed and returned.' },
    ],
  },
  fabricCare: {
    heading: 'Care Across Wool, Cashmere and Wraps',
    items: [
      { title: 'Wool', body: 'Cleaned at lower thermal and mechanical stress to help prevent felting.' },
      { title: 'Cashmere', body: 'Handled with the gentler process fine cashmere fibres need.' },
      { title: 'Pashmina', body: 'Treated with care for both the fibre and any embellishment.' },
      { title: 'Blended Knits', body: 'Professional treatment according to the fibre composition and care requirements.' },
      { title: 'Premium & Heirloom Pieces', body: 'For pieces where preserving softness and structure matters as much as cleaning.' },
    ],
    disclaimer: "Care is always determined by the item's fibre composition, construction and care label.",
  },
  stainCare: {
    heading: 'From Everyday Marks to Stubborn Stains',
    intro: () => 'Knits and wraps pick up some of the most common everyday stains and marks.',
    stains: ['Sweat & body oils', 'Food & beverage marks', 'Makeup marks', 'Perfume marks', 'Dust and everyday grime', 'General discolouration'],
    beforeCleaning: {
      heading: 'Professional Stain Treatment Begins Before Cleaning',
      body: 'Every item is assessed individually so visible stains and problem areas can be identified before the cleaning cycle.',
    },
    qualifier: 'Stain removal results depend on the type of stain, fabric, age of the stain and previous treatment.',
  },
  audiences: {
    heading: 'Made for Pieces You Want to Keep',
    items: [
      { title: 'Cold-Weather Wardrobes', body: 'Keep winter knits and wraps in shape through the season.' },
      { title: 'Frequent Travelers', body: 'Professional care between trips, without a harsh home wash.' },
      { title: 'Heirloom Owners', body: 'For pieces passed down and worth preserving carefully.' },
      { title: 'Gifting', body: 'Have a piece cleaned and finished before it is given.' },
      { title: 'Everyday Layering', body: 'For knits and wraps that are worn often and need regular, gentle care.' },
    ],
  },
  bestFor: {
    dryClean: [
      'Wool and cashmere pieces',
      'Pashmina and fine wraps',
      'Pieces with visible stains or marks',
      'Items that need deeper cleaning',
      'Pieces requiring gentle fibre treatment',
      'Heirloom or premium knitwear',
    ],
    steam: [
      'Recently washed pieces',
      'Lightly worn knits',
      'Items with light creasing',
      'Everyday wear',
      'Wardrobe maintenance',
      'Preparing for a cold-weather outing',
    ],
  },
};

const ethnicWear: Bucket = {
  whyCare: {
    heading: 'Embroidery and Drape Deserve More Than a Regular Wash',
    body: [
      'Zari, embroidery and delicate dyes can be damaged by a standard wash long before the fabric itself wears out.',
      'Pleats lose their fall, embellishment can fray, and colour can bleed under the wrong process.',
      'At Vanzoo, every ethnic piece is assessed on its own, not run through a standard cycle.',
    ],
    features: [
      { title: 'Embroidery Protected', body: 'Zari, thread work and embellishment checked before cleaning begins.' },
      { title: 'Pleats & Drape', body: 'Finished by hand so pleats and drape fall the way they were meant to.' },
      { title: 'Zari & Dye Care', body: 'A process chosen to avoid running colour or dulling metallic work.' },
      { title: 'Ready to Wear', body: 'Comes back professionally finished, packed and ready for the occasion.' },
    ],
  },
  detailCare: {
    heading: 'The Details Matter',
    items: [
      { title: 'Embroidery & Zari', body: 'Checked before cleaning so thread work and metallic zari are treated appropriately.' },
      { title: 'Pleats', body: 'Finished by hand to help pleats fall back into their original shape.' },
      { title: 'Lining', body: 'Inner linings treated as carefully as the outer fabric.' },
      { title: 'Fabric', body: 'Treatment selected according to the fabric and its care requirements.' },
      { title: 'Beadwork & Embellishment', body: 'Assessed individually so delicate embellishment is not put at risk.' },
      { title: 'Overall Finish', body: 'A final inspection before the piece is packed and returned.' },
    ],
  },
  fabricCare: {
    heading: 'Care Across Ethnic Fabrics',
    items: [
      { title: 'Cotton & Silk Blends', body: 'Everyday ethnic wear that benefits from professional cleaning and pressing.' },
      { title: 'Pure Silk', body: 'Handled with the specialised care fine silk requires.' },
      { title: 'Georgette & Chiffon', body: 'Lightweight fabrics that need careful handling to avoid distortion.' },
      { title: 'Velvet & Brocade', body: 'Heavier weaves treated according to their pile and construction.' },
      { title: 'Bridal & Heirloom Pieces', body: 'For pieces where preserving embroidery and structure matters as much as cleaning.' },
    ],
    disclaimer: "Care is always determined by the garment's fabric composition, construction and care label.",
  },
  stainCare: {
    heading: 'From Everyday Marks to Stubborn Stains',
    intro: (title) => `${title}s worn at events and celebrations pick up some distinctive stains and marks.`,
    stains: ['Sweat & body oils', 'Food & beverage marks', 'Mehendi & makeup marks', 'Oil & ghee marks', 'Dust and travel grime', 'Perfume marks'],
    beforeCleaning: {
      heading: 'Professional Stain Treatment Begins Before Cleaning',
      body: 'Every piece is assessed individually so visible stains and problem areas can be identified before the cleaning cycle.',
    },
    qualifier: 'Stain removal results depend on the type of stain, fabric, age of the stain and previous treatment.',
  },
  audiences: {
    heading: 'Made for Occasions That Matter',
    items: [
      { title: 'Weddings & Celebrations', body: 'Prepare festive pieces before the event, and care for them after.' },
      { title: 'Festive Wardrobes', body: 'Keep embroidered and embellished pieces ready season after season.' },
      { title: 'Heirloom Pieces', body: 'For pieces carrying family history that deserve reverent handling.' },
      { title: 'Bridal Parties', body: 'Coordinated care for multiple outfits ahead of a wedding.' },
      { title: 'Everyday Ethnic Wear', body: 'Regular, considered care for the pieces worn most often.' },
    ],
  },
  bestFor: {
    dryClean: [
      'Heavily embroidered pieces',
      'Silk and premium fabrics',
      'Bridal and designer wear',
      'Pieces with visible stains or marks',
      'Items that need deeper cleaning',
      'Pieces requiring careful embroidery treatment',
    ],
    steam: [
      'Recently washed pieces',
      'Lightly worn items',
      'Wrinkled pieces',
      'Everyday ethnic wear',
      'Wardrobe maintenance',
      'Preparing for an event',
    ],
  },
};

const homeTextiles: Bucket = {
  whyCare: {
    heading: 'Everyday Textiles Trap More Than They Show',
    body: [
      'Carpets, curtains, blankets and bedsheets get more daily contact than almost anything else in the home.',
      'Dust and allergens settle deep into the pile or weave that a home wash or vacuum rarely reaches.',
      'At Vanzoo, home textiles get the same individual assessment as a couture garment.',
    ],
    features: [
      { title: 'Deep, Dust-Free Clean', body: 'Cleans without soaking the backing or weakening the weave.' },
      { title: 'Colours Refreshed', body: 'A considered process helps bring colour and pile back rather than flattening them.' },
      { title: 'Pile & Weave Protected', body: 'Treatment chosen according to the material and construction.' },
      { title: 'Ready for the Home', body: 'Comes back clean, fresh and ready to put back in place.' },
    ],
  },
  detailCare: {
    heading: 'The Details Matter',
    items: [
      { title: 'Fibre & Pile', body: 'Cleaned according to the material without soaking or flattening the pile.' },
      { title: 'Seams & Edges', body: 'Borders, hems and seams checked and finished carefully.' },
      { title: 'Colour', body: 'Assessed before cleaning so colour is treated appropriately.' },
      { title: 'Allergen Removal', body: 'Deep cleaning helps remove dust and allergens that settle into everyday textiles.' },
      { title: 'Fabric', body: 'Treatment selected according to the material and its care requirements.' },
      { title: 'Overall Finish', body: 'A final inspection before the item is packed and returned.' },
    ],
  },
  fabricCare: {
    heading: 'Care Across Home Textiles',
    items: [
      { title: 'Cotton', body: 'Everyday textiles that benefit from a deep, professional clean.' },
      { title: 'Wool & Blended Carpets', body: 'Treated according to pile and backing construction.' },
      { title: 'Silk-Blend Rugs', body: 'Handled with the specialised care fine rugs require.' },
      { title: 'Synthetic Fabrics', body: 'Cleaned according to their specific care requirements.' },
      { title: 'Heavier Textiles', body: 'Blankets, curtains and larger pieces treated for their weight and construction.' },
    ],
    disclaimer: "Care is always determined by the item's material composition, construction and care label.",
  },
  stainCare: {
    heading: 'From Everyday Marks to Stubborn Stains',
    intro: () => 'Home textiles pick up some of the most common everyday stains and marks.',
    stains: ['Dust & everyday grime', 'Food & beverage marks', 'Pet marks', 'Mildew marks', 'Ink & marker marks', 'General discolouration'],
    beforeCleaning: {
      heading: 'Professional Stain Treatment Begins Before Cleaning',
      body: 'Every item is assessed individually so visible stains and problem areas can be identified before the cleaning cycle.',
    },
    qualifier: 'Stain removal results depend on the type of stain, fabric, age of the stain and previous treatment.',
  },
  audiences: {
    heading: 'Made for Homes That Matter',
    items: [
      { title: 'Households', body: 'Regular, considered care for the textiles used every day.' },
      { title: 'Allergy-Sensitive Homes', body: 'Deep cleaning that helps reduce dust and allergen build-up.' },
      { title: 'Landlords & Move-Outs', body: 'Get textiles refreshed between tenancies.' },
      { title: 'Festive Refresh', body: 'Clean the home’s textiles before hosting or celebrations.' },
      { title: 'Everyday Upkeep', body: 'For homes that want a professional clean without the hassle of DIY.' },
    ],
  },
  bestFor: {
    dryClean: [
      'Heavily used pieces',
      'Wool and premium textiles',
      'Items with visible stains or marks',
      'Pieces that need deeper cleaning',
      'Larger or heavier textiles',
      'Pieces requiring careful pile treatment',
    ],
    steam: [
      'Recently cleaned pieces',
      'Lightly used textiles',
      'Items with light creasing',
      'Everyday upkeep',
      'Seasonal refresh',
      'Preparing for guests',
    ],
  },
};

const leatherAndFootwear: Bucket = {
  whyCare: {
    heading: 'Leather and Uppers Need Material-Specific Care',
    body: [
      'Leather, suede and technical uppers do not respond to the same treatment, so Vanzoo does not give them one.',
      'Soles, uppers and hardware are cleaned and conditioned as separate steps, with the material deciding the process.',
      'At Vanzoo, every piece is assessed on its own construction before any cleaning begins.',
    ],
    features: [
      { title: 'Finish Restored', body: 'Conditioning brings back the material’s finish rather than just wiping off surface dirt.' },
      { title: 'Soles & Hardware Protected', body: 'Cleaned and conditioned separately from the upper material.' },
      { title: 'Shape Maintained', body: 'Structure and shape restored without cracking or discolouring the material.' },
      { title: 'Ready to Use', body: 'Comes back looking cared for, not just wiped down.' },
    ],
  },
  detailCare: {
    heading: 'The Details Matter',
    items: [
      { title: 'Uppers', body: 'Cleaned according to whether the material is leather, suede, canvas or mesh.' },
      { title: 'Soles', body: 'Cleaned and conditioned without breaking down the sole structure.' },
      { title: 'Hardware & Fastenings', body: 'Buckles, zips and clasps inspected before cleaning.' },
      { title: 'Lining', body: 'Inner lining treated as carefully as the outer material.' },
      { title: 'Material', body: 'Treatment selected according to the material and its care requirements.' },
      { title: 'Overall Finish', body: 'A final inspection before the piece is packed and returned.' },
    ],
  },
  fabricCare: {
    heading: 'Care Across Materials',
    items: [
      { title: 'Leather', body: 'Conditioned to bring back the finish without cracking or discolouring it.' },
      { title: 'Suede', body: 'Treated to protect the nap rather than flatten it.' },
      { title: 'Canvas & Mesh', body: 'Cleaned according to the weave without harsh scrubbing.' },
      { title: 'Synthetic Uppers', body: 'Professional treatment according to the material composition.' },
      { title: 'Premium & Designer Pieces', body: 'For pieces where preserving finish and structure matters as much as cleaning.' },
    ],
    disclaimer: "Care is always determined by the item's material composition, construction and care label.",
  },
  stainCare: {
    heading: 'From Everyday Marks to Stubborn Stains',
    intro: () => 'Leather goods and footwear pick up some distinctive everyday marks.',
    stains: ['Scuffs & scratches', 'Mud & outdoor marks', 'Sweat & odour', 'Salt marks', 'Everyday grime', 'Colour fading'],
    beforeCleaning: {
      heading: 'Professional Stain Treatment Begins Before Cleaning',
      body: 'Every piece is assessed individually so visible marks and problem areas can be identified before the cleaning cycle.',
    },
    qualifier: 'Stain and mark removal results depend on the type of mark, material, age and previous treatment.',
  },
  audiences: {
    heading: 'Made for Pieces You Wear Often',
    items: [
      { title: 'Everyday Footwear', body: 'Regular, considered care for the pieces worn most often.' },
      { title: 'Frequent Travelers', body: 'Professional care between trips, without searching for a service on the road.' },
      { title: 'Sports & Outdoor Use', body: 'Cleaned without breaking down performance materials.' },
      { title: 'Premium Leather Goods', body: 'For pieces where preserving finish and construction matters.' },
      { title: 'Considered Wardrobes', body: 'For customers who want professional care for the accessories they rely on.' },
    ],
  },
  bestFor: {
    dryClean: [
      'Leather and suede pieces',
      'Designer footwear and bags',
      'Items with visible marks or scuffs',
      'Pieces that need deeper cleaning',
      'Pieces requiring careful material treatment',
      'Premium or heirloom pieces',
    ],
    steam: [
      'Lightly used pieces',
      'Recently cleaned items',
      'Everyday wear',
      'Wardrobe maintenance',
      'Preparing for travel',
      'A quick refresh',
    ],
  },
};

const softToys: Bucket = {
  whyCare: {
    heading: "A Child's Favourite Toy Deserves a Gentle Clean",
    body: [
      'A soft toy gets held, chewed and slept with — it needs a process that is genuinely gentle, not just labelled that way.',
      'Fabric, stuffing and trims each need their own kind of care.',
      'At Vanzoo, soft toys are cleaned individually, never in a batch with other items.',
    ],
    features: [
      { title: 'Skin-Safe Process', body: 'Cleaned using the same hydrocarbon process trusted for couture garments.' },
      { title: 'Shape Preserved', body: 'Stuffing and shape checked so the toy keeps its form.' },
      { title: 'Colours Protected', body: 'A considered process helps protect colour and print.' },
      { title: 'Ready to Hug', body: 'Comes back clean, fresh and ready to go straight back to the child.' },
    ],
  },
  detailCare: {
    heading: 'The Details Matter',
    items: [
      { title: 'Fabric', body: 'Plush, fur and knit fabrics treated according to their material.' },
      { title: 'Stuffing', body: 'Checked so the toy keeps its shape and softness after cleaning.' },
      { title: 'Stitching & Seams', body: 'Seams checked before cleaning to avoid putting stress on them.' },
      { title: 'Trims & Eyes', body: 'Buttons, eyes and trims inspected and handled carefully.' },
      { title: 'Colour', body: 'Assessed before cleaning so colour and print are treated appropriately.' },
      { title: 'Overall Finish', body: 'A final inspection before the toy is packed and returned.' },
    ],
  },
  fabricCare: {
    heading: 'Care Across Toy Fabrics',
    items: [
      { title: 'Plush & Fur Fabrics', body: 'Cleaned gently to keep the pile soft rather than matted.' },
      { title: 'Cotton & Knit Toys', body: 'Treated according to the fabric and its construction.' },
      { title: 'Felt & Trims', body: 'Smaller trims and felt details handled with individual care.' },
      { title: 'Larger Stuffed Toys', body: 'Assessed for size and stuffing before cleaning.' },
    ],
    disclaimer: "Care is always determined by the toy's fabric composition, construction and care label.",
  },
  stainCare: {
    heading: 'From Everyday Marks to Stubborn Stains',
    intro: () => 'Soft toys pick up marks from exactly the kind of handling that makes them loved.',
    stains: ['Everyday handling marks', 'Food & drink spills', 'Drool & saliva marks', 'Dust and allergens', 'General discolouration'],
    beforeCleaning: {
      heading: 'Professional Stain Treatment Begins Before Cleaning',
      body: 'Every toy is assessed individually so visible marks can be identified before the cleaning cycle.',
    },
    qualifier: 'Stain removal results depend on the type of mark, fabric, age and previous treatment.',
  },
  audiences: {
    heading: 'Made for the Toys Children Love Most',
    items: [
      { title: 'Nurseries', body: 'Regular, gentle care for the toys used every day.' },
      { title: 'Gifting', body: 'Have a toy cleaned and refreshed before it is given.' },
      { title: 'Travel Companions', body: 'Keep a well-loved travel toy fresh between trips.' },
      { title: 'Everyday Play', body: 'For toys that are handled and loved often.' },
      { title: 'Heirloom Toys', body: 'For toys passed down and worth preserving carefully.' },
    ],
  },
  bestFor: { dryClean: [], steam: [] },
};

/* -------------------------------------------------------------------------- */
/* Assembly                                                                    */
/* -------------------------------------------------------------------------- */

function buildProductCare(input: {
  id: string;
  title: string;
  hasComparison: boolean;
  bucket: Bucket;
}): ProductCareContent {
  const { title, hasComparison, bucket } = input;

  const careOptions: readonly CareOption[] | undefined = hasComparison
    ? [
        {
          title: 'Dry Clean & Press',
          description: `For a ${title.toLowerCase()} that needs professional cleaning as well as a polished finish.`,
          bestFor: bucket.bestFor.dryClean,
          result: 'Professional cleaning followed by professional finishing and pressing.',
          cta: 'Choose Dry Clean & Press',
        },
        {
          title: 'Steam Press',
          description: `For a ${title.toLowerCase()} that is already clean but needs wrinkle removal and a crisp, ready-to-use finish.`,
          bestFor: bucket.bestFor.steam,
          result: 'Steam treatment, wrinkle removal and professional pressing.',
          cta: 'Choose Steam Press',
        },
      ]
    : undefined;

  return {
    metaTitle: `Professional ${title} Dry Cleaning${hasComparison ? ' & Steam Press' : ''} | Vanzoo`,
    metaDescription: `Professional ${title.toLowerCase()} cleaning${hasComparison ? ', pressing and steam finishing' : ' and finishing'} by Vanzoo. Italian hydrocarbon technology, careful finishing and convenient doorstep pickup and delivery.`,
    hero: {
      headline: `Professional ${title} Care, Finished to Perfection`,
      intro:
        productEntries.find((p) => p.id === input.id)?.intro ??
        `Vanzoo cleans, presses and finishes every ${title.toLowerCase()} with the attention it deserves.`,
      pickupNote: 'Free Pickup & Delivery',
      turnaroundNote: 'Standard turnaround: 3–5 days · Express options available',
    },
    careOptions,
    whyCare: bucket.whyCare,
    process: sharedProcess,
    technology: sharedTechnology,
    detailCare: bucket.detailCare,
    fabricCare: bucket.fabricCare,
    stainCare: {
      heading: bucket.stainCare.heading,
      intro: bucket.stainCare.intro(title),
      stains: bucket.stainCare.stains,
      beforeCleaning: bucket.stainCare.beforeCleaning,
      qualifier: bucket.stainCare.qualifier,
    },
    comparison: hasComparison ? genericComparison(title) : undefined,
    whyVanzoo: sharedWhyVanzoo,
    audiences: bucket.audiences,
    doorstep: sharedDoorstep(title),
    faqs: genericFaqs(title, hasComparison),
    finalCta: genericFinalCta(title),
  };
}

/** Which bucket + comparison-flag each non-Shirt product uses. */
const productConfig: Record<string, { bucket: Bucket; hasComparison: boolean }> = {
  'pant-trouser': { bucket: structuredApparel, hasComparison: true },
  jeans: { bucket: structuredApparel, hasComparison: true },
  't-shirt': { bucket: structuredApparel, hasComparison: true },
  coat: { bucket: structuredApparel, hasComparison: true },
  'men-suit-2-pcs': { bucket: structuredApparel, hasComparison: false },
  'men-suit-3-pcs': { bucket: structuredApparel, hasComparison: false },
  dress: { bucket: structuredApparel, hasComparison: true },
  jacket: { bucket: structuredApparel, hasComparison: true },
  'leather-jacket': { bucket: leatherAndFootwear, hasComparison: true },
  'waist-coat': { bucket: structuredApparel, hasComparison: false },
  'sweat-pants': { bucket: structuredApparel, hasComparison: false },

  shawl: { bucket: delicateKnits, hasComparison: true },
  sweater: { bucket: delicateKnits, hasComparison: true },

  sherwani: { bucket: ethnicWear, hasComparison: true },
  kurta: { bucket: ethnicWear, hasComparison: true },
  'kurta-fancy': { bucket: ethnicWear, hasComparison: false },
  'kurta-heavy': { bucket: ethnicWear, hasComparison: false },
  salwar: { bucket: ethnicWear, hasComparison: true },
  saree: { bucket: ethnicWear, hasComparison: true },
  lehenga: { bucket: ethnicWear, hasComparison: true },
  blouse: { bucket: ethnicWear, hasComparison: false },

  carpet: { bucket: homeTextiles, hasComparison: false },
  curtain: { bucket: homeTextiles, hasComparison: true },
  'double-blanket': { bucket: homeTextiles, hasComparison: false },
  'single-blanket': { bucket: homeTextiles, hasComparison: false },
  'double-bedsheet': { bucket: homeTextiles, hasComparison: true },
  'single-bedsheet': { bucket: homeTextiles, hasComparison: true },

  'sports-shoes': { bucket: leatherAndFootwear, hasComparison: false },
  'leather-shoes': { bucket: leatherAndFootwear, hasComparison: false },
  'suede-leather-shoes': { bucket: leatherAndFootwear, hasComparison: false },
  'sneakers-shoes': { bucket: leatherAndFootwear, hasComparison: false },

  'leather-handbag': { bucket: leatherAndFootwear, hasComparison: false },
  'soft-toy': { bucket: softToys, hasComparison: false },
};

const productCareById: Record<string, ProductCareContent> = Object.fromEntries(
  Object.entries(productConfig).map(([id, config]) => {
    const product = productEntries.find((entry): entry is ProductEntry => entry.id === id);
    const title = product?.title ?? id;
    return [id, buildProductCare({ id, title, hasComparison: config.hasComparison, bucket: config.bucket })];
  }),
);

/** Shirt keeps its original, fully bespoke content (content/shirtCare.ts);
 *  every other garment is assembled from its category bucket above. */
export function getProductCareContent(productId: string): ProductCareContent | undefined {
  return getShirtCareContent(productId) ?? productCareById[productId];
}
