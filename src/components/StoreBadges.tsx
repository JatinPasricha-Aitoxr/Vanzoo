import { links } from '@/lib/site';
import { cn } from '@/lib/cn';

/**
 * Google Play + App Store badges, shared by the footer and the app promo.
 * The App Store badge links out once `links.appStore` is set (env
 * NEXT_PUBLIC_APP_STORE_URL); until then it renders a disabled "coming soon"
 * badge instead of a dead link.
 */
export function StoreBadges({ className }: { className?: string }) {
  const badge =
    'inline-flex items-center gap-2.5 rounded-card border border-white/30 px-4 py-2.5 text-white transition-colors';
  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      <a
        href={links.playStore}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(badge, 'hover:border-accent-gold hover:text-accent-gold-soft')}
      >
        <PlayIcon />
        <Label small="Get it on" big="Google Play" />
      </a>
      {links.appStore ? (
        <a
          href={links.appStore}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(badge, 'hover:border-accent-gold hover:text-accent-gold-soft')}
        >
          <AppleIcon />
          <Label small="Download on the" big="App Store" />
        </a>
      ) : (
        <span aria-disabled="true" className={cn(badge, 'opacity-60')}>
          <AppleIcon />
          <Label small="Coming soon on" big="App Store" />
        </span>
      )}
    </div>
  );
}

function Label({ small, big }: { small: string; big: string }) {
  return (
    <span className="text-left leading-tight">
      <span className="block text-[0.625rem] uppercase tracking-wide text-white/75">{small}</span>
      <span className="block text-sm font-semibold">{big}</span>
    </span>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
      <path d="M3.6 2.6c-.3.3-.5.8-.5 1.4v16c0 .6.2 1.1.5 1.4l.1.1 9-9v-.2l-9-9-.1.1zm12.2 5.9L5.4 2.4l8.8 8.8 1.6-1.6v-1.1zm2.9 2.1-2.2-1.3-1.8 1.8 1.8 1.8 2.2-1.3c.7-.4.7-1.2 0-1.6zM5.4 21.6l10.4-6.1-1.6-1.6-8.8 7.7z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
      <path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9s-1.8-.8-3-.8c-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.8 3-.8s1.8.8 3 .7c1.3 0 2.1-1.1 2.8-2.2.9-1.3 1.3-2.5 1.3-2.6-.1 0-2.5-1-2.5-3.8zM14.2 5.8c.6-.8 1.1-1.8.9-2.9-.9 0-2 .6-2.7 1.4-.6.7-1.100 1.800-1 2.800 1 .1 2.100-.5 2.800-1.300z" />
    </svg>
  );
}
