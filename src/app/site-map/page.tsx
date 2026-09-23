import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { PageHeader } from '@/components/Hero';
import { JsonLd } from '@/components/JsonLd';
import { Section } from '@/components/ui/Section';
import { areaPageFor } from '@/content/areas';
import { categories, categorySlug, posts } from '@/content/blog';
import { landingPages } from '@/content/landing';
import { productEntries } from '@/content/products';
import { serviceEntries } from '@/content/services';
import { breadcrumbSchema, buildMetadata } from '@/lib/seo';
import { areaGroups } from '@/lib/site';

const CRUMBS = [{ name: 'Site Map', href: '/site-map/' }];

export const metadata = buildMetadata({
  title: 'Site Map | All Pages | Vanzoo Dry Cleaning Gurgaon',
  description:
    'Every page on the Vanzoo website in one place — services, products and prices, the Gurgaon areas we serve, hydrocarbon technology, blog articles and policies.',
  path: '/site-map/',
});

type LinkItem = { label: string; href: string };
type Group = { heading: string; links: readonly LinkItem[] };

/**
 * HTML site map — every route on the site, built from the same content arrays
 * the pages themselves render from, so it never drifts out of date. The XML
 * sitemap for crawlers is separate (app/sitemap.ts).
 */
export default function SiteMapPage() {
  const groups: Group[] = [
    {
      heading: 'Main pages',
      links: [
        { label: 'Home', href: '/' },
        { label: 'About Us', href: '/about-us/' },
        { label: 'Services', href: '/services/' },
        { label: 'Products', href: '/products/' },
        { label: 'Pricing', href: '/pricing/' },
        { label: 'Hydrocarbon Tech', href: '/hydrocarbon-tech/' },
        { label: 'Membership', href: '/membership/' },
        { label: 'Areas We Serve', href: '/areas-we-serve/' },
        { label: 'Locate Us', href: '/locate-us/' },
        { label: 'Contact Us', href: '/contact-us/' },
        { label: 'Blogs', href: '/blogs/' },
        ...landingPages.map((page) => ({ label: page.name, href: page.path })),
      ],
    },
    {
      heading: 'Services',
      links: serviceEntries.map((service) => ({ label: service.title, href: `/services/${service.id}/` })),
    },
    {
      heading: 'Products & prices',
      links: productEntries.map((product) => ({ label: product.title, href: `/products/${product.id}/` })),
    },
    ...areaGroups.map((group) => ({
      heading: `Areas · ${group.name}`,
      links: group.areas.flatMap((name) => {
        const page = areaPageFor(name);
        return page ? [{ label: name, href: `/areas-we-serve/${page.id}/` }] : [];
      }),
    })),
    {
      heading: 'Blog categories',
      links: categories.map((category) => ({ label: category, href: `/blogs/category/${categorySlug(category)}/` })),
    },
    {
      heading: 'Policies',
      links: [
        { label: 'Privacy Policy', href: '/privacy-policy/' },
        { label: 'Terms of Service', href: '/terms-conditions/' },
        { label: 'Delivery & Refund Policy', href: '/delivery-refund-policy/' },
      ],
    },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(CRUMBS)} />

      <PageHeader
        eyebrow="Site Map"
        title="Every page, in one place"
        intro="Services, products and prices, the Gurgaon areas we serve, and every article on the blog."
      >
        <Breadcrumbs crumbs={CRUMBS} />
      </PageHeader>

      <Section tone="surface" aria-label="All pages">
        <div className="columns-1 gap-10 sm:columns-2 lg:columns-3">
          {groups.map((group) => (
            <LinkGroup key={group.heading} group={group} />
          ))}
        </div>
      </Section>

      <Section tone="muted" aria-labelledby="sitemap-articles-heading">
        <h2 id="sitemap-articles-heading" className="text-display-sm">
          Blog articles <span className="text-neutral-body">({posts.length})</span>
        </h2>
        <ul className="mt-8 columns-1 gap-10 text-sm sm:columns-2 lg:columns-3">
          {posts.map((post) => (
            <li key={post.slug} className="mb-2.5 break-inside-avoid">
              <Link href={`/blogs/${post.slug}/`} className="text-neutral-body hover:text-brand hover:underline">
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}

function LinkGroup({ group }: { group: Group }) {
  return (
    <section className="mb-10 break-inside-avoid">
      <h2 className="font-display text-lg font-semibold text-neutral-ink">{group.heading}</h2>
      <span aria-hidden="true" className="mt-2 block h-px w-12 bg-accent-gold/60" />
      <ul className="mt-4 space-y-2 text-sm">
        {group.links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-neutral-body hover:text-brand hover:underline">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
