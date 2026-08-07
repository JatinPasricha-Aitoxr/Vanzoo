import { JsonLd } from '@/components/JsonLd';
import { PolicyPage } from '@/components/PolicyPage';
import { getPolicy } from '@/content/policies';
import { breadcrumbSchema, buildMetadata } from '@/lib/seo';

const doc = getPolicy('delivery-refund-policy')!;

export const metadata = buildMetadata({
  title: doc.title,
  description:
    'How Vanzoo handles deliveries, missed appointments, storage of completed articles, and how refunds, compensation and claims are processed.',
  path: doc.route,
});

export default function DeliveryRefundPolicyPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: doc.heading, href: doc.route }])} />
      <PolicyPage doc={doc} />
    </>
  );
}
