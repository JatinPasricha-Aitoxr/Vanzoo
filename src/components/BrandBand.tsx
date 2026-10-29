import { brand } from '@/lib/site';
import Image from 'next/image';
import { Highlight } from './ui/Highlight';
import { Mascot } from './Mascot';
import { Reveal } from './ui/Reveal';
import { Section } from './ui/Section';

/** Brand identity band: logo, mascot and the brand promise. */
export function BrandBand() {
  return (
    <Section tone="dark" aria-labelledby="brand-heading">
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-14">
        <Reveal variant="left" className="text-center lg:text-left">
          <Image
            src={brand.logo}
            alt="Vanzoo — Premium Organic Dryclean"
            width={2200}
            height={653}
            loading="lazy"
            sizes="260px"
            className="mx-auto h-auto w-60 lg:mx-0"
          />
          <h2 id="brand-heading" className="mt-8 text-display-md text-white">
            <Highlight text="Care for everything you wear" dark />
          </h2>
          <p className="mt-4 text-lead text-pretty text-white/75">
            Premium organic dryclean — hydrocarbon technology, trained experts and free pickup and
            delivery, with a cleaner tomorrow in mind.
          </p>
        </Reveal>

        <Reveal variant="scale" delay={80} className="mx-auto">
          <Mascot className="w-48 sm:w-56 lg:w-64" sizes="256px" alt="The Vanzoo tiger mascot" />
        </Reveal>

        <Reveal variant="right" delay={120}>
          <ul className="grid gap-3 text-sm font-medium text-white sm:grid-cols-2 lg:grid-cols-1">
            {['Eco-friendly cleaning', 'German-organic chemistry', 'Free pickup & delivery', 'Premium quality, every piece'].map((item) => (
              <li key={item} className="flex items-center gap-3 rounded-card border border-white/15 bg-white/[0.06] px-4 py-3">
                <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-pill bg-accent-gold" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
