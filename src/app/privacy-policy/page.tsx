import { JsonLd } from '@/components/JsonLd';
import { PolicyPage } from '@/components/PolicyPage';
import { getPolicy } from '@/content/policies';
import { breadcrumbSchema, buildMetadata } from '@/lib/seo';

const doc = getPolicy('privacy-policy')!;

export const metadata = buildMetadata({
  title: doc.title,
  description:
    'How Vanzoo collects, stores, uses and protects customer data from service orders, online interactions and communications.',
  path: doc.route,
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: doc.heading, href: doc.route }])} />
      <PolicyPage doc={doc} />
    </>
  );
}
