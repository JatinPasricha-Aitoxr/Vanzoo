import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CtaBanner } from '@/components/CtaBanner';
import { JsonLd } from '@/components/JsonLd';
import { PageHeader } from '@/components/Hero';
import { ProductBuyBox } from '@/components/ProductBuyBox';
import { TabbedExplainer } from '@/components/TabbedExplainer';
import { Section, SectionHeading } from '@/components/ui/Section';
import { howItWorksIntro, howItWorksSteps } from '@/content/marketing';
import { lineId } from '@/content/pricing';
import { getProduct, productEntries, tariffRowFor } from '@/content/products';
import { breadcrumbSchema, buildMetadata, productSchema } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

type Params = { params: { slug: string } };

/** The one product shipped so far is static; an unknown slug is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return productEntries.map((product) => ({ slug: product.id }));
}

export function generateMetadata({ params }: Params) {
  const product = getProduct(params.slug);
  if (!product) return {};

  return buildMetadata({
    title: `${product.title} Dry Cleaning & Steam Press | Vanzoo`,
    description: `${product.intro} Free pickup and delivery across Gurgaon.`.slice(0, 300),
    path: `/products/${product.id}/`,
    image: product.heroImage,
    imageAlt: product.heroImageAlt,
  });
}

export default function ProductDetailPage({ params }: Params) {
  const product = getProduct(params.slug);
  if (!product) notFound();

  const crumbs = [
    { name: 'Products', href: '/products/' },
    { name: product.title, href: `/products/${product.id}/` },
  ];

  return (
    <>
      <JsonLd
        data={[
          productSchema({
            slug: product.id,
            title: product.title,
            description: product.intro,
            image: product.heroImage,
            offers: product.services.map((option) => {
              const row = tariffRowFor(option);
              return {
                name: option.label,
                price: row.amount,
                url: `${SITE_URL}/products/${product.id}/#${lineId(
                  option.catalogId,
                  option.groupId,
                  option.item,
                )}`,
              };
            }),
          }),
          breadcrumbSchema(crumbs),
        ]}
      />

      <PageHeader
        eyebrow="Products"
        title={product.title}
        intro={product.intro}
        image={product.heroImage}
        imageAlt={product.heroImageAlt}
      >
        <Breadcrumbs crumbs={crumbs} tone="dark" />
      </PageHeader>

      {/* Product photo + variant picker — the same layout a retail product
          page uses for size/colour, with the service treatment as the
          variant. Picking one swaps price, description and cart control
          together, so the page reads as one product, not a grid of cards. */}
      <Section tone="surface" aria-labelledby="product-options-heading">
        <ProductBuyBox product={product} />
      </Section>

      {/* How it works — the same three-step explainer as every other detail page */}
      <Section tone="muted" id="how-it-works" aria-labelledby="product-how-heading">
        <SectionHeading
          id="product-how-heading"
          eyebrow="How It Works"
          title="Three steps, and it's handled"
          intro={howItWorksIntro}
        />
        <div className="mt-14">
          <TabbedExplainer steps={howItWorksSteps} />
        </div>
      </Section>

      <Section tone="surface" size="sm">
        <CtaBanner
          heading={`Ready to get your ${product.title.toLowerCase()}s cleaned?`}
          secondary={{ label: 'See all products', href: '/products/' }}
        />
      </Section>
    </>
  );
}
