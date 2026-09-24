/**
 * "Why Choose VANZOO?" — the four pillars behind the sticky split-scroll
 * section on the homepage (components/WhyChoosePillars.tsx).
 *
 * Edit pillars and points here; the layout reads this array and nothing else.
 * Every point restates a claim the site already makes on the Hydrocarbon Tech
 * page, the service copy or the FAQs — no new figures or certifications.
 */

export type PillarPointIcon =
  | 'machine'
  | 'filter'
  | 'steps'
  | 'no-flask'
  | 'percent'
  | 'air'
  | 'drop'
  | 'shield'
  | 'feather'
  | 'recycle'
  | 'water'
  | 'box';

export type Pillar = {
  id: string;
  title: string;
  tagline: string;
  /** Dark-green tile icon — the same artwork as the old badge row. */
  icon: { src: string; alt: string };
  image: { src: string; alt: string };
  points: readonly { icon: PillarPointIcon; heading: string; body: string }[];
};

export const pillarsIntro = {
  eyebrow: 'Why Choose VANZOO?',
  heading: 'Dry cleaning built on safer science',
} as const;

export const pillars: readonly Pillar[] = [
  {
    id: 'western-technology',
    title: 'Western Technology',
    tagline: 'Imported Italian hydrocarbon systems, and a nine-step process built around them.',
    icon: {
      src: '/images/icons/western-technology.png',
      alt: 'Circuit and gear icon representing imported Western dry cleaning technology',
    },
    image: {
      src: '/images/tech-hydrocarbon-machine.jpg',
      alt: 'Closed-loop Italian hydrocarbon dry cleaning machine at the Vanzoo facility in Gurgaon',
    },
    points: [
      {
        icon: 'machine',
        heading: 'Closed-loop Italian machines',
        body: 'Garments are immersed and gently tumbled in solvent at controlled, moderate temperatures inside a fully sealed system, so no solvent vapour escapes into the store or the air outside.',
      },
      {
        icon: 'filter',
        heading: 'Continuous filtration and distillation',
        body: 'While the cycle runs, the machine filters out particulates and distils the solvent, recovering roughly 99% of it to be reused cycle after cycle.',
      },
      {
        icon: 'steps',
        heading: 'Nine steps, every order',
        body: 'Every piece runs the same nine stages, from individual assessment and stain treatment to hand finishing, quality inspection and protective packaging.',
      },
    ],
  },
  {
    id: 'toxin-free',
    title: 'Toxin Free',
    tagline: 'A refined hydrocarbon solvent in place of PERC: powerful on stains, free of harsh chemicals.',
    icon: {
      src: '/images/icons/toxin-free.png',
      alt: 'Crossed-out chemical flask icon representing toxin-free garment cleaning',
    },
    image: {
      src: '/images/service-hydrocarbon-machine.jpg',
      alt: 'Control panel of the PERC-free hydrocarbon dry cleaning system used at Vanzoo',
    },
    points: [
      {
        icon: 'no-flask',
        heading: 'No PERC, ever',
        body: 'We clean with a high-flashpoint hydrocarbon fluid, chemically closer to a light mineral oil, never the perchloroethylene most conventional dry cleaning still relies on.',
      },
      {
        icon: 'percent',
        heading: '99% of chemicals removed',
        body: 'Hydrocarbon extracts remove 99% of chemicals from the fabric, so nothing harsh is left behind in the clothes you wear.',
      },
      {
        icon: 'air',
        heading: 'No harsh odours',
        body: 'Every piece comes back with a clean, fresh finish and no lingering chemical smell, with modern emission and fire-safety controls behind the process.',
      },
    ],
  },
  {
    id: 'skin-friendly',
    title: 'Skin Friendly',
    tagline: 'Residue-free cleaning that is kinder to your skin and to the fibres that touch it.',
    icon: {
      src: '/images/icons/skin-friendly.png',
      alt: 'Skin layer icon representing skin-friendly residue-free fabric care',
    },
    image: {
      src: '/images/service-silk-wool-delicates.jpg',
      alt: 'Folded silk, wool and cashmere garments after gentle, skin-friendly hydrocarbon cleaning',
    },
    points: [
      {
        icon: 'drop',
        heading: 'A residue-free finish',
        body: 'With chemicals lifted out of the fabric rather than left in it, garments come back clean against the skin, not coated in solvent.',
      },
      {
        icon: 'shield',
        heading: 'Protects luxury fibres',
        body: 'Lower temperatures and gentler action mean no stiffness, shrinkage or chemical damage, and less fibre swelling and colour migration than older solvent systems.',
      },
      {
        icon: 'feather',
        heading: 'Gentle on delicates',
        body: 'Silk, wool, cashmere and embellished pieces keep their natural softness and lustre, which is why hydrocarbon cleaning is trusted for couture.',
      },
    ],
  },
  {
    id: 'sustainable',
    title: 'Sustainable',
    tagline: 'Solvent recovered and reused, not discarded, with packaging designed to be recyclable.',
    icon: {
      src: '/images/icons/sustainable.png',
      alt: 'Leaf in a cycle icon representing sustainable eco-friendly dry cleaning',
    },
    image: {
      src: '/images/tech-hydrocarbon-plant.jpg',
      alt: 'Vanzoo hydrocarbon cleaning plant that recovers and reuses its solvent',
    },
    points: [
      {
        icon: 'recycle',
        heading: 'Up to 99% solvent recycling',
        body: 'Continuous distillation separates the solvent from the soiling it lifted, so it is reused cycle after cycle instead of being thrown away.',
      },
      {
        icon: 'water',
        heading: 'Less water and energy',
        body: 'The process replaces water with a refined solvent, and we take steps to minimise water and energy consumption at every stage.',
      },
      {
        icon: 'box',
        heading: 'Sustainable packaging',
        body: 'Finished pieces are wrapped in packaging designed to be sustainable and recyclable, so the care continues after delivery.',
      },
    ],
  },
];
