import Image from 'next/image';
import { RevealGroup } from './ui/Reveal';
import { personas } from '@/content/marketing';

/**
 * Persona cards (§2.3.7).
 *
 * A horizontal snap rail below `lg` and a three-column grid above it, so the
 * five cards never squash. It is a plain overflow container rather than a JS
 * carousel: native scrolling keeps keyboard and trackpad behaviour for free and
 * ships no client JS.
 */
export function PersonaScroller() {
  return (
    <RevealGroup
      as="ul"
      step={80}
      className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0">
      {personas.map((persona) => (
        <li
          key={persona.title}
          className="w-[80vw] shrink-0 snap-start sm:w-[58vw] md:w-[42vw] lg:w-auto"
        >
          <article className="card-lift group h-full overflow-hidden rounded-card border border-neutral-line bg-white hover:border-brand/35">
            <div className="media-frame aspect-[4/3] rounded-none">
              <Image
                src={persona.image}
                alt={persona.imageAlt}
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 30vw, (min-width: 768px) 42vw, 80vw"
                className="card-media object-cover"
              />
            </div>
            <div className="p-6">
              <p className="eyebrow">{persona.category}</p>
              <h3 className="mt-2.5 font-display text-xl font-semibold">{persona.title}</h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-pretty text-neutral-body">
                {persona.body}
              </p>
            </div>
          </article>
        </li>
      ))}
    </RevealGroup>
  );
}
