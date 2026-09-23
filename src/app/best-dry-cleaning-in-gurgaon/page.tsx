import { LandingPageView } from '@/components/LandingPageView';
import { gurgaonPage } from '@/content/landing';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: gurgaonPage.metaTitle,
  description: gurgaonPage.metaDescription,
  path: gurgaonPage.path,
  image: gurgaonPage.hero.image,
  imageAlt: gurgaonPage.hero.imageAlt,
});

export default function BestGurgaonPage() {
  return <LandingPageView page={gurgaonPage} />;
}
