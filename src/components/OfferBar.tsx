import Link from 'next/link';
import { heroOffer } from '@/content/marketing';

/** Slim site-wide strip carrying the first-order offer on every page. */
export function OfferBar() {
  return (
    <div className="flex h-[var(--bar-h)] items-center justify-center gap-2 bg-brand-ink px-3 text-center text-[0.6875rem] font-medium text-white sm:text-xs">
      <span className="truncate">
        <strong className="font-semibold text-accent-gold-soft">{heroOffer.lead}</strong>
        <span className="hidden sm:inline"> · {heroOffer.codeLabel}</span>
      </span>
      <span className="rounded-pill bg-accent-gold px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-[0.08em] text-brand-ink">
        {heroOffer.code}
      </span>
      <Link href="/membership/" className="hidden text-accent-gold-soft underline underline-offset-2 sm:inline">
        Membership up to 40% off
      </Link>
    </div>
  );
}
