import { cmsOr } from '@/cms/override';
import { withSeo } from '@/cms/withSeo';
import { JsonLd } from '@/components/JsonLd';
import { PolicyPage } from '@/components/PolicyPage';
import { getPolicy } from '@/content/policies';
import { breadcrumbSchema, buildMetadata } from '@/lib/seo';

const doc = getPolicy('delivery-refund-policy')!;

export async function generateMetadata() {
  return withSeo(buildMetadata({
  title: doc.title,
  description:
    'How Vanzoo handles deliveries, missed appointments, storage of completed articles, and how refunds, compensation and claims are processed.',
  path: doc.route,
}));
}

function DeliveryRefundPolicyPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: doc.heading, href: doc.route }])} />
      <PolicyPage doc={doc} />
    </>
  );
}

/** A page published from the builder at /delivery-refund-policy/ replaces this built-in version. */
export default cmsOr('/delivery-refund-policy/', DeliveryRefundPolicyPage);
