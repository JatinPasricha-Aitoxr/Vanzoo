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

export default function BestGurgaonPage() {
  return <LandingPageView page={gurgaonPage} />;
}
