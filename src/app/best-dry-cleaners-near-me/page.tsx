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

export default function BestNearMePage() {
  return <LandingPageView page={nearMePage} />;
}
