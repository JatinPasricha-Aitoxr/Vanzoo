import Image from 'next/image';
import Link from 'next/link';
import { Icon, type IconName } from '@/components/ui/Icon';

const SUGGESTIONS: Array<{ href: string; label: string; icon: IconName }> = [
  { href: '/couture-care-tariffs/', label: 'Couture Care Tariffs', icon: 'shirt' },
  { href: '/steam-iron-tariffs/', label: 'Steam Iron Tariffs', icon: 'jacket' },
  { href: '/hydrocarbon-tech/', label: 'Hydrocarbon Tech', icon: 'cpu' },
  { href: '/locate-us/', label: 'Locate Us', icon: 'mapPin' },
  { href: '/blogs/', label: 'Blogs', icon: 'calendar' },
  { href: '/contact-us/', label: 'Contact Us', icon: 'mail' },
];

export default function NotFound() {
  return (
    <div className="shell grid min-h-[75svh] items-center gap-12 py-section lg:grid-cols-2 lg:gap-16">
      <div>
        <p className="eyebrow">404</p>
        <h1 className="mt-3 text-display-lg">We couldn&apos;t find that page</h1>
        <p className="mt-4 max-w-xl text-lead text-neutral-body">
          The link may be out of date. Try one of these instead, or head back to the homepage.
        </p>

        <ul className="mt-8 grid gap-2.5 sm:grid-cols-2">
          {SUGGESTIONS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group flex items-center gap-3 rounded-card border border-neutral-line px-4 py-3 text-[0.9375rem] font-medium text-neutral-ink transition-colors duration-200 hover:border-brand/40 hover:bg-brand-tint"
              >
                <Icon name={item.icon} className="text-lg text-brand" />
                {item.label}
                <Icon
                  name="arrowRight"
                  className="arrow-nudge ml-auto text-base text-brand opacity-40"
                />
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10">
          <Link href="/" className="btn-primary btn-lg gap-2">
            Back to home
            <Icon name="arrowRight" className="arrow-nudge" />
          </Link>
        </div>
      </div>

      {/* Kept to one image and hidden on small screens — a 404 should get the
          reader somewhere useful, not spend their bandwidth on decoration. */}
      <div className="media-frame hidden aspect-[4/3] lg:block">
        <Image
          src="/images/garment-rail-couture.jpg"
          alt="Rail of couture garments at the Vanzoo eco-friendly dry cleaning atelier in Gurgaon"
          fill
          loading="lazy"
          sizes="(min-width: 1024px) 46vw, 0px"
          className="object-cover"
        />
      </div>
    </div>
  );
}
