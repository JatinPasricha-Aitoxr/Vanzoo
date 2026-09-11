import Image from 'next/image';
import Link from 'next/link';
import { PageHeader } from '@/components/Hero';
import { RevealGroup } from '@/components/ui/Reveal';
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
      <PageHeader eyebrow="Products" title="Shop by garment" intro={productsIntro} />

      <Section tone="surface" aria-labelledby="products-heading">
        <h2 id="products-heading" className="sr-only">
          All garments
        </h2>
        <RevealGroup as="ul" step={70} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {productEntries.map((product) => (
            <li
              key={product.id}
              className="card-lift group flex flex-col overflow-hidden rounded-card border border-neutral-line bg-white shadow-lift hover:border-brand/30 hover:shadow-lift-hover"
            >
              <Link
                href={`/products/${product.id}/`}
                className="media-frame block aspect-[3/2] rounded-none"
                tabIndex={-1}
              >
                <Image
                  src={product.heroImage}
                  alt={product.heroImageAlt}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                  className="card-media object-cover"
                />
              </Link>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-xl font-semibold leading-snug text-neutral-ink">
                  <Link href={`/products/${product.id}/`} className="transition-colors hover:text-brand">
                    {product.title}
                  </Link>
                </h3>
                <p className="mt-2.5 flex-1 text-[0.9375rem] leading-relaxed text-pretty text-neutral-body">
                  {product.intro}
                </p>
                <Link
                  href={`/products/${product.id}/`}
                  className="mt-5 inline-flex items-center gap-1.5 border-t border-neutral-line pt-5 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
                >
                  Choose a service
                  <span aria-hidden="true" className="arrow-nudge">→</span>
                </Link>
              </div>
            </li>
          ))}
        </RevealGroup>
      </Section>
    </>
  );
}
