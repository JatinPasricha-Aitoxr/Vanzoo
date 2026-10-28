import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { RenderDoc } from '@/cms/render';
import { pageMetadata } from '@/cms/seo';
import { defaultHomeDoc } from '@/cms/seed';
import { getPublishedBySlug } from '@/cms/store';
import { homeFaqs } from '@/content/marketing';
import { faqSchema, localBusinessSchema } from '@/lib/seo';

/** Published edits revalidate immediately on publish; this is a safety net. */
export const revalidate = 300;

const FALLBACK_META = {
  title: 'Premium & Luxury Dry Cleaning in Gurgaon | Vanzoo',
  description:
    "Vanzoo is Gurgaon's premium organic dry cleaner. Hydrocarbon cleaning for suits, sarees, lehengas, shoes, bags, curtains and carpets. Free pickup and delivery.",
};

export async function generateMetadata(): Promise<Metadata> {
  const live = await getPublishedBySlug('/');
  return pageMetadata('/', live?.page.seo ?? {}, FALLBACK_META);
}

export default async function HomePage() {
  // The layout published from the page builder, or the built-in default if none.
  const live = await getPublishedBySlug('/');
  const doc = live?.doc ?? defaultHomeDoc();

  return (
    <>
      <JsonLd data={[localBusinessSchema(), faqSchema(homeFaqs)]} />
      <RenderDoc doc={doc} />
    </>
  );
}
