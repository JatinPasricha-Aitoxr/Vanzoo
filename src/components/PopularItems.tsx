import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/content/pricing';
import { getProduct, tariffRowFor } from '@/content/products';
import { RevealGroup } from './ui/Reveal';

/**
 * Priced item tiles — photo, name and tariff price, each linking to its
 * product page. Shared by the locality pages and the "best dry cleaning"
 * landing pages.
 */
export function PopularItems({ productIds }: { productIds: readonly string[] }) {
  const products = productIds.flatMap((id) => getProduct(id) ?? []);

  return (
    <RevealGroup as="ul" step={60} className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6">
      {products.map((product) => {
        const row = tariffRowFor(product.services[0]);
        return (
          <li key={product.id}>
            <Link
              href={`/products/${product.id}/`}
              className="card-lift group block overflow-hidden rounded-card border border-neutral-line bg-white hover:border-brand/30"
            >
              <div className="media-frame aspect-square rounded-none">
                <Image
                  src={row.image}
                  alt={product.heroImageAlt}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 15vw, (min-width: 768px) 30vw, 45vw"
                  className="card-media object-cover"
                />
              </div>
              <div className="p-4">
                <p className="font-display text-base font-semibold text-neutral-ink">{product.title}</p>
                <p className="mt-1 text-xs text-neutral-body">{formatPrice(row)}</p>
              </div>
            </Link>
          </li>
        );
      })}
    </RevealGroup>
  );
}
