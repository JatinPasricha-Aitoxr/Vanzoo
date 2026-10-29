import { cmsOr } from '@/cms/override';
import { LandingPageView } from '@/components/LandingPageView';
import { gurgaonPage } from '@/content/landing';
import { withSeo } from '@/cms/withSeo';
import { buildMetadata } from '@/lib/seo';

export async function generateMetadata() {
  return withSeo(buildMetadata({
  title: gurgaonPage.metaTitle,
  description: gurgaonPage.metaDescription,
  path: gurgaonPage.path,
  image: gurgaonPage.hero.image,
  imageAlt: gurgaonPage.hero.imageAlt,
}));
}

function BestGurgaonPage() {
  return <LandingPageView page={gurgaonPage} />;
}

/** A page published from the builder at /best-dry-cleaning-in-gurgaon/ replaces this built-in version. */
export default cmsOr('/best-dry-cleaning-in-gurgaon/', BestGurgaonPage);
