import { cmsOr } from '@/cms/override';
import { withSeo } from '@/cms/withSeo';
import { JsonLd } from '@/components/JsonLd';
import { PolicyPage } from '@/components/PolicyPage';
import { getPolicy } from '@/content/policies';
import { breadcrumbSchema, buildMetadata } from '@/lib/seo';

const doc = getPolicy('privacy-policy')!;

export async function generateMetadata() {
  return withSeo(buildMetadata({
  title: doc.title,
  description:
    'How Vanzoo collects, stores, uses and protects customer data from service orders, online interactions and communications.',
  path: doc.route,
}));
}

function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: doc.heading, href: doc.route }])} />
      <PolicyPage doc={doc} />
    </>
  );
}

/** A page published from the builder at /privacy-policy/ replaces this built-in version. */
export default cmsOr('/privacy-policy/', PrivacyPolicyPage);
