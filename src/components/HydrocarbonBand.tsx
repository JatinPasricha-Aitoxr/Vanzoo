import Image from 'next/image';
import Link from 'next/link';
import { Highlight } from './ui/Highlight';
import { Reveal } from './ui/Reveal';
import { Section } from './ui/Section';
import { hydrocarbon } from '@/content/marketing';

/** "About hydrocarbon" band — used on Services and the garments (Products) page. */
export function HydrocarbonBand({
  heading = 'One technology behind every service',
  id = 'hydrocarbon-band-heading',
}: {
  heading?: string;
  id?: string;
}) {
  return (
    <Section tone="dark" aria-labelledby={id}>
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal variant="left">
          <p className="eyebrow text-accent-gold-soft">{hydrocarbon.sections[0].eyebrow}</p>
          <h2 id={id} className="mt-3 text-display-md text-white">
            <Highlight text={heading} dark={true} />
          </h2>
          <p className="mt-4 text-lead text-pretty text-white/75">{hydrocarbon.sections[0].body}</p>
          <p className="mt-4 text-pretty text-white/70">{hydrocarbon.sections[1].body}</p>
          <Link href="/hydrocarbon-tech/" className="btn-inverse btn-md mt-8">
            Explore hydrocarbon tech
          </Link>
        </Reveal>
        <Reveal variant="scale" delay={90} className="media-frame aspect-[4/3] bg-brand-dark">
          <Image
            src="/images/tech-hydrocarbon-machine.jpg"
            alt="Closed-loop hydrocarbon dry cleaning machine that recycles 99% of solvent each cycle"
            fill
            loading="lazy"
            sizes="(min-width: 1024px) 46vw, 90vw"
            className="object-cover"
          />
        </Reveal>
      </div>
    </Section>
  );
}
