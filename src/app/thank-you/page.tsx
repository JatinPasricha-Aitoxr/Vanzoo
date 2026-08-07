import Link from 'next/link';
import { BlogGrid } from '@/components/BlogCard';
import { Icon, IconBadge } from '@/components/ui/Icon';
import { Section, SectionHeading } from '@/components/ui/Section';
import { posts } from '@/content/blog';
import { buildMetadata } from '@/lib/seo';
import { links, site } from '@/lib/site';

/**
 * Form confirmation page.
 *
 * `noIndex` — a thank-you page has no value in search results, and letting it
 * rank means people land on a confirmation for a form they never submitted.
 */
export const metadata = buildMetadata({
  title: 'Thank You | Vanzoo',
  description: 'Thank you for contacting Vanzoo. Our team will be in touch shortly.',
  path: '/thank-you/',
  noIndex: true,
});

export default function ThankYouPage() {
  return (
    <>
      <section className="bg-brand-light pb-section-sm pt-[calc(var(--header-h)+4rem)]">
        <div className="shell max-w-2xl text-center">
          <div className="hero-stagger" style={{ '--line': 0 } as React.CSSProperties}>
            <IconBadge name="check" tone="success" size="lg" className="mx-auto" />
          </div>
          <h1
            className="hero-stagger mt-6 text-display-lg"
            style={{ '--line': 1 } as React.CSSProperties}
          >
            Thank You
          </h1>
          <p
            className="hero-stagger mt-4 text-lead text-pretty text-neutral-body"
            style={{ '--line': 2 } as React.CSSProperties}
          >
            Thank you for submitting the form. Our team will contact you soon.
          </p>
          <div
            className="hero-stagger mt-8 flex flex-wrap items-center justify-center gap-3"
            style={{ '--line': 3 } as React.CSSProperties}
          >
            <a
              href={links.bookPickup}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary btn-lg gap-2"
            >
              Book a pickup
              <Icon name="arrowRight" className="arrow-nudge" />
            </a>
            <Link href="/" className="btn-secondary btn-lg">
              Back to home
            </Link>
          </div>

          <p
            className="hero-stagger mt-8 text-sm text-neutral-body"
            style={{ '--line': 4 } as React.CSSProperties}
          >
            In a hurry? Call us on{' '}
            <a href={`tel:${site.phoneHref}`} className="font-semibold text-brand">
              {site.phone}
            </a>
            .
          </p>
        </div>
      </section>

      {/* Something to do next, rather than a dead end. */}
      <Section tone="surface" aria-labelledby="thanks-reading-heading">
        <SectionHeading
          id="thanks-reading-heading"
          eyebrow="While you wait"
          title="Fabric care, explained"
          align="center"
          className="mx-auto"
        />
        <div className="mt-12">
          <BlogGrid posts={posts.slice(0, 3)} />
        </div>
      </Section>
    </>
  );
}
