import { ProductSearchGrid } from '@/components/ProductSearchGrid';
import { SectionCtas } from '@/components/SectionCtas';
import { OfferBand } from '@/components/OfferBand';
import { AreaCoverageGrid } from '@/components/AreaCoverageGrid';
import { PageHeader } from '@/components/Hero';
import { Section } from '@/components/ui/Section';
import { productEntries, productsIntro } from '@/content/products';
import { buildMetadata } from '@/lib/seo';

export function generateMetadata() {
  return buildMetadata({
    title: 'Shop by Garment | Vanzoo',
    description: `${productsIntro} Free pickup and delivery across Gurgaon.`.slice(0, 300),
    path: '/products/',
  });
}

export default function ProductsIndexPage() {
  return (
    <>
      <PageHeader eyebrow="Products" title="Best Dry Cleaning for Every Garment in Gurgaon" intro={productsIntro} />

      <Section tone="surface" aria-labelledby="products-heading">
        <h2 id="products-heading" className="sr-only">
          All garments
        </h2>
        <ProductSearchGrid products={productEntries} />
        <SectionCtas className="justify-center" />
      </Section>

      <Section tone="muted" aria-labelledby="products-areas-heading">
        <h2 id="products-areas-heading" className="text-display-sm">
          Free pickup & delivery across <span className="hl">Gurgaon</span>
        </h2>
        <div className="mt-8">
          <AreaCoverageGrid headingLevel="h3" showBlurb={false} />
        </div>
        <SectionCtas />
      </Section>

      <OfferBand />
    </>
  );
}
