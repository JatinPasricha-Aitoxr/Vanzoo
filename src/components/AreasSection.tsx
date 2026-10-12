import Link from 'next/link';
import { AreaCoverageGrid } from './AreaCoverageGrid';
import { Section, SectionHeading } from './ui/Section';
import { areaGroups, links, serviceAreas } from '@/lib/site';

/** "Every area we serve" band — used on the homepage, Services and Pricing. */
export function AreasSection() {
  return (
    <Section tone="surface" aria-labelledby="areas-heading">
          <SectionHeading
          fixedCity
            id="areas-heading"
            eyebrow="Where we deliver"
            title="Every area we serve in Gurgaon"
            intro={`Free pickup and delivery across ${serviceAreas.length} neighbourhoods in ${areaGroups.length} corridors — from DLF and Golf Course Road to New Gurgaon. Find yours below.`}
            align="center"
            className="mx-auto"
          />
          <div className="mt-12">
            <AreaCoverageGrid headingLevel="h3" showBlurb={false} />
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a href={links.bookPickup} target="_blank" rel="noopener noreferrer" className="btn-primary btn-md">
              Book Pickup
            </a>
            <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-secondary btn-md">
              Chat on WhatsApp
            </a>
          </div>
          <p className="mt-6 text-center">
            <Link
              href="/areas-we-serve/"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
            >
              Check your pincode & see full coverage details
              <span aria-hidden="true">→</span>
            </Link>
          </p>
        </Section>
  );
}
