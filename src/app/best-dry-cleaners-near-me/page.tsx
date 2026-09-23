import { LandingPageView } from '@/components/LandingPageView';
import { nearMePage } from '@/content/landing';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: nearMePage.metaTitle,
  description: nearMePage.metaDescription,
  path: nearMePage.path,
  image: nearMePage.hero.image,
  imageAlt: nearMePage.hero.imageAlt,
});

export default function BestNearMePage() {
  return <LandingPageView page={nearMePage} />;
}
