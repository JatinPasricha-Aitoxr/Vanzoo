import { links } from '@/lib/site';

/**
 * Floating WhatsApp launcher, bottom-left so it never competes with the
 * contact rail (right edge) or the mobile "Book Pickup" bar (full-width,
 * bottom) — cleared with extra bottom offset on small screens where that bar
 * is pinned.
 */
export function WhatsAppButton() {
  return (
    <a
      href={links.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Vanzoo on WhatsApp"
      className="fixed bottom-20 left-4 z-30 inline-flex h-14 w-14 items-center justify-center rounded-pill bg-[#25D366] text-white shadow-lift-hover transition-transform duration-200 ease-entrance hover:-translate-y-0.5 sm:bottom-6 sm:left-6 print:hidden"
    >
      <WhatsAppIcon />
    </a>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-7 w-7">
      <path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.74.46 3.44 1.32 4.94L2.1 22l5.36-1.4a9.8 9.8 0 0 0 4.58 1.16h.01c5.43 0 9.84-4.4 9.84-9.84A9.78 9.78 0 0 0 12.04 2zm0 17.9h-.01a8.2 8.2 0 0 1-4.15-1.13l-.3-.18-3.08.8.82-3-.19-.31a8.13 8.13 0 0 1-1.25-4.34c0-4.5 3.67-8.16 8.17-8.16 2.18 0 4.23.85 5.77 2.4a8.1 8.1 0 0 1 2.39 5.77c0 4.5-3.67 8.16-8.17 8.16zm4.48-6.1c-.24-.13-1.45-.72-1.68-.8-.22-.08-.39-.12-.55.12s-.63.8-.77.96c-.14.17-.28.19-.52.06a6.7 6.7 0 0 1-1.97-1.22 7.4 7.4 0 0 1-1.36-1.7c-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.15.16-.25.24-.41.08-.17.04-.31-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.47-.4-.4-.55-.41h-.47c-.16 0-.43.06-.65.3-.22.25-.85.84-.85 2.04s.87 2.37.99 2.53c.12.17 1.71 2.62 4.15 3.67.58.25 1.03.4 1.39.51.58.19 1.11.16 1.53.1.47-.07 1.45-.6 1.65-1.17.2-.58.2-1.07.14-1.17-.06-.11-.22-.17-.46-.29z" />
    </svg>
  );
}
