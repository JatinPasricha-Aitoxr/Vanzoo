import { cmsOr } from '@/cms/override';
import { withSeo } from '@/cms/withSeo';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CtaBanner } from '@/components/CtaBanner';
import { JsonLd } from '@/components/JsonLd';
import { PageHeader } from '@/components/Hero';
import { Reviews } from '@/components/Reviews';
import { Section } from '@/components/ui/Section';
import { reviews, reviewsIntro } from '@/content/reviews';
import { breadcrumbSchema, buildMetadata } from '@/lib/seo';

const CRUMBS = [{ name: 'Reviews', href: '/reviews/' }];

export async function generateMetadata() {
  return withSeo(buildMetadata({
  title: 'Customer Reviews | Vanzoo Dry Cleaning Gurgaon',
  description:
    'Read what Gurgaon customers say about Vanzoo — dry cleaning, steam press and garment care with free doorstep pickup and delivery.',
  path: '/reviews/',
}));
}

function ReviewsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(CRUMBS)} />
      <PageHeader seoH1="Best & Premium Dry Cleaning Reviews in Gurgaon" eyebrow="Customer reviews" title={`What ${reviews.length} customers say`} intro={reviewsIntro}>
        <Breadcrumbs crumbs={CRUMBS} />
      </PageHeader>
      <Section tone="surface">
        <Reviews limit={reviews.length} columns={3} />
      </Section>
      <Section tone="muted" size="sm">
        <CtaBanner />
      </Section>
    </>
  );
}

/** A page published from the builder at /reviews/ replaces this built-in version. */
export default cmsOr('/reviews/', ReviewsPage);
