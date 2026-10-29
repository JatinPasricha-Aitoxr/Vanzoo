import { cmsOr } from '@/cms/override';
import { LandingPageView } from '@/components/LandingPageView';
import { nearMePage } from '@/content/landing';
import { withSeo } from '@/cms/withSeo';
import { buildMetadata } from '@/lib/seo';

export async function generateMetadata() {
  return withSeo(buildMetadata({
  title: nearMePage.metaTitle,
  description: nearMePage.metaDescription,
  path: nearMePage.path,
  image: nearMePage.hero.image,
  imageAlt: nearMePage.hero.imageAlt,
}));
}

function BestNearMePage() {
  return <LandingPageView page={nearMePage} />;
}

/** A page published from the builder at /best-dry-cleaners-near-me/ replaces this built-in version. */
export default cmsOr('/best-dry-cleaners-near-me/', BestNearMePage);
