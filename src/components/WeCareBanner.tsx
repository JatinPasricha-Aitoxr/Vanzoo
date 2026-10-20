import Image from 'next/image';
import { weCare } from '@/content/marketing';
import { Reveal } from './ui/Reveal';
import { links } from '@/lib/site';

/**
 * Editorial statement band — the old site's "NOT JUST CLOTHES. WE CARE FOR WHAT
 * MATTERS." banner, rebuilt as live type on the dark-green band instead of text
 * baked into a JPEG. The oversized second line in gold is the moment; the photo
 * keeps it grounded in product rather than pure slogan.
 */
export function WeCareBanner() {
  return (
    <section aria-labelledby="we-care-heading" className="band-dark overflow-hidden">
      <div className="shell grid items-center gap-10 py-section-sm lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-16">
        <Reveal variant="left">
          <h2 id="we-care-heading" className="font-display font-semibold uppercase">
            <span className="block text-[clamp(1.5rem,3vw,2.5rem)] tracking-[0.04em] text-white">
              {weCare.headline[0]}
            </span>
            <span className="mt-1 block text-[clamp(2rem,4.6vw,3.9rem)] leading-[1.05] tracking-[0.01em] text-accent-gold-soft">
              {weCare.headline[1]}
            </span>
          </h2>
          <p className="mt-6 max-w-xl text-lead text-pretty text-white/75">{weCare.body}</p>
          <a
            href={links.bookPickup}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold btn-lg mt-9"
          >
            Book Pickup
          </a>
        </Reveal>

        <Reveal variant="scale" delay={90} className="relative">
          {/* Gold frame offset behind the photo — the plate detail that keeps
              the image from floating unanchored on the dark field. */}
          <div
            aria-hidden="true"
            className="absolute -bottom-3 -right-3 h-full w-full rounded-media border border-accent-gold/40"
          />
          <div className="media-frame aspect-[4/3] bg-brand-dark">
            <Image
              src={weCare.image}
              alt={weCare.imageAlt}
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 38vw, 90vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
