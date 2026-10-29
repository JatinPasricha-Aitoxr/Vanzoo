import { cmsOr } from '@/cms/override';
import { withSeo } from '@/cms/withSeo';
import { JsonLd } from '@/components/JsonLd';
import { PolicyPage } from '@/components/PolicyPage';
import { getPolicy } from '@/content/policies';
import { breadcrumbSchema, buildMetadata } from '@/lib/seo';

const doc = getPolicy('terms-conditions')!;

export async function generateMetadata() {
  return withSeo(buildMetadata({
  title: doc.title,
  description:
    'The terms that apply to all garments, shoes, accessories, curtains and carpets accepted by Vanzoo for cleaning, pressing, alteration or repair.',
  path: doc.route,
}));
}

function TermsConditionsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: doc.heading, href: doc.route }])} />
      <PolicyPage doc={doc} />
    </>
  );
}

/** A page published from the builder at /terms-conditions/ replaces this built-in version. */
export default cmsOr('/terms-conditions/', TermsConditionsPage);
