import { Breadcrumbs } from '@/components/Breadcrumbs';
import { EnquiryForm } from '@/components/EnquiryForm';
import { FAQAccordion } from '@/components/FAQAccordion';
import { JsonLd } from '@/components/JsonLd';
import { PageHeader } from '@/components/Hero';
import { Icon, IconBadge, type IconName } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { Section, SectionHeading } from '@/components/ui/Section';
import { enquiryIntro, faqIntro, homeFaqs } from '@/content/marketing';
import { breadcrumbSchema, buildMetadata, localBusinessSchema } from '@/lib/seo';
import { primaryStore, site, socialLinks, stores } from '@/lib/site';

const CRUMBS = [{ name: 'Contact Us', href: '/contact-us/' }];

const SOCIAL_ICONS: Record<string, IconName> = {
  Facebook: 'facebook',
  Instagram: 'instagram',
  YouTube: 'youtube',
};

export const metadata = buildMetadata({
  title: 'Contact Vanzoo for Premium Fabric Care Services',
  description:
    'Contact Vanzoo for expert garment care, couture cleaning, and eco-friendly fabric solutions. Reach our team for support and service inquiries.',
  path: '/contact-us/',
});

export default function ContactPage() {
  return (
    <>
      <JsonLd data={[localBusinessSchema(), breadcrumbSchema(CRUMBS)]} />

      <PageHeader
        eyebrow="Get In Touch"
        title="Let's Talk with us"
        intro="Questions about a specific garment, a bulk order or an express turnaround? Our team answers every enquiry personally."
        image="/images/process-schedule-call.jpg"
        imageAlt="Customer speaking to the Vanzoo team about a garment care enquiry"
      >
        <Breadcrumbs crumbs={CRUMBS} tone="onDark" />
      </PageHeader>

      <Section tone="surface">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          {/* Contact details + map */}
          <Reveal variant="left">
            <h2 className="text-display-sm">{site.descriptor}</h2>
            <p className="mt-2 text-lead text-neutral-body">{site.serviceArea}</p>

            {/* Each detail leads with a badged icon so the block can be scanned
                for "phone" or "address" without reading the labels.

                The badge sits inside the <dt> rather than beside it: a <div>
                inside a <dl> is only valid if it contains nothing but dt/dd
                pairs, so an icon as their sibling would break the list
                semantics screen readers rely on. The <dd> is indented by the
                badge's width instead, which gives the same alignment. */}
            <dl className="mt-8 space-y-6">
              <div>
                <dt className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-body">
                  <IconBadge name="phone" />
                  Phone Number
                </dt>
                <dd className="mt-1 pl-[3.25rem]">
                  <a
                    href={`tel:${site.phoneHref}`}
                    className="font-display text-xl font-semibold text-brand transition-colors hover:text-brand-dark"
                  >
                    {site.phone}
                  </a>
                </dd>
              </div>

              <div>
                <dt className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-body">
                  <IconBadge name="mail" />
                  Email Address
                </dt>
                <dd className="mt-1 pl-[3.25rem]">
                  <a
                    href={`mailto:${site.email}`}
                    className="font-display text-xl font-semibold text-brand transition-colors hover:text-brand-dark"
                  >
                    {site.email}
                  </a>
                </dd>
              </div>

              <div>
                <dt className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-body">
                  <IconBadge name="mapPin" />
                  Stores
                </dt>
                <dd className="mt-2 space-y-4 pl-[3.25rem]">
                  {stores.map((store) => (
                    <p key={store.id} className="text-[0.9375rem] leading-relaxed">
                      <span className="font-semibold text-neutral-ink">{store.name}</span>
                      <br />
                      <span className="text-neutral-body">{store.address}</span>
                    </p>
                  ))}
                </dd>
              </div>

              <div>
                <dt className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-body">
                  <IconBadge name="clock" />
                  Turnaround
                </dt>
                <dd className="mt-1 pl-[3.25rem] text-[0.9375rem] leading-relaxed text-neutral-body">
                  Standard {site.turnaround}. Same-day and 2-4 hour express available on
                  request.
                </dd>
              </div>
            </dl>

            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-body">
                Follow us
              </p>
              <ul className="mt-3 flex flex-wrap gap-3">
                {socialLinks.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary btn-sm gap-2"
                    >
                      <Icon name={SOCIAL_ICONS[social.label]} className="text-base" />
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="media-frame mt-10 aspect-[4/3]">
              <iframe
                title={`Map showing Vanzoo at ${primaryStore.name}, ${primaryStore.locality}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(primaryStore.mapQuery)}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
          </Reveal>

          {/* Enquiry form */}
          <Reveal variant="right" delay={90} id="enquiry">
            <SectionHeading
              eyebrow="Send a message"
              title="Request an Enquiry"
              intro={enquiryIntro}
              className="max-w-none"
            />
            <div className="mt-8">
              <EnquiryForm />
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tone="muted" id="faq" aria-labelledby="contact-faq-heading">
        <SectionHeading
          id="contact-faq-heading"
          title="Frequently Asked Questions"
          intro={faqIntro}
          align="center"
          className="mx-auto"
        />
        <div className="mt-12">
          <FAQAccordion faqs={homeFaqs} groupName="contact-faq" />
        </div>
      </Section>
    </>
  );
}
