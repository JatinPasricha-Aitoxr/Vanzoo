import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { PageHeader } from '@/components/Hero';
import { SectionCtas } from '@/components/SectionCtas';
import { TariffGrid } from '@/components/TariffGrid';
import { Section } from '@/components/ui/Section';
import { coutureCatalog } from '@/content/pricing';
import { breadcrumbSchema, buildMetadata } from '@/lib/seo';

/** Dedicated price pages for the two item groups customers look up most. */
const PAGES = {
  'shoe-care': {
    groupId: 'footwear',
    title: 'Shoe & Sneaker Cleaning Prices in Gurgaon',
    eyebrow: 'Shoe care pricing',
    intro: 'Every shoe item we clean, with its starting price — sports shoes, sneakers, leather, suede, boots, sandals and more.',
  },
  'home-textiles': {
    groupId: 'home-textiles',
    title: 'Blanket & Home Textile Cleaning Prices in Gurgaon',
    eyebrow: 'Home textile pricing',
    intro: 'Carpets, curtains, blankets, quilts, bedsheets, bed spreads and comforters — priced item by item.',
  },
} as const;

type Params = { params: { group: string } };

export const dynamicParams = false;
export const generateStaticParams = () => Object.keys(PAGES).map((group) => ({ group }));

export function generateMetadata({ params }: Params) {
  const page = PAGES[params.group as keyof typeof PAGES];
  if (!page) return {};
  return buildMetadata({
    title: `${page.title} | Vanzoo`,
    description: `${page.intro} Free pickup and delivery across Gurgaon. GST extra.`,
    path: `/pricing/${params.group}/`,
  });
}

export default function PricingGroupPage({ params }: Params) {
  const page = PAGES[params.group as keyof typeof PAGES];
  if (!page) notFound();
  const group = coutureCatalog.groups.find((g) => g.id === page.groupId);
  if (!group) notFound();

  const crumbs = [
    { name: 'Pricing', href: '/pricing/' },
    { name: group.label, href: `/pricing/${params.group}/` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <PageHeader eyebrow={page.eyebrow} title={page.title} intro={page.intro}>
        <Breadcrumbs crumbs={crumbs} />
      </PageHeader>
      <Section tone="surface">
        <p className="mb-8 rounded-card border-2 border-accent-gold bg-accent-gold/10 p-4 text-center font-bold text-neutral-ink">
          Prices start from — GST extra. WhatsApp us to know the actual price for your item.
        </p>
        <TariffGrid catalog={{ ...coutureCatalog, groups: [group] }} />
        <SectionCtas className="justify-center" />
        <p className="mt-8 text-center text-sm">
          <Link href="/pricing/" className="font-medium text-brand underline underline-offset-2">
            See the complete price list →
          </Link>
        </p>
      </Section>
    </>
  );
}
