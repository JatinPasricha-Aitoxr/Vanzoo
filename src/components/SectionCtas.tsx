import { links } from '@/lib/site';
import { cn } from '@/lib/cn';

/** Book Pickup + WhatsApp pair, closing a section. */
export function SectionCtas({ className, tone = 'light' }: { className?: string; tone?: 'light' | 'dark' }) {
  return (
    <div className={cn('mt-10 flex flex-wrap items-center gap-3', className)}>
      <a href={links.bookPickup} target="_blank" rel="noopener noreferrer" className="btn-gold btn-md">
        Book Pickup
      </a>
      <a
        href={links.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className={cn('btn-md', tone === 'dark' ? 'btn-inverse' : 'btn-secondary')}
      >
        Chat on WhatsApp
      </a>
    </div>
  );
}
