'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/admin/seo', label: 'Overview & audit' },
  { href: '/admin/seo/search', label: 'Search data' },
  { href: '/admin/seo/redirects', label: 'Redirects & 404s' },
  { href: '/admin/seo/settings', label: 'Global settings' },
  { href: '/admin/seo/schema', label: 'Structured data' },
];

export function SeoTabs() {
  const path = usePathname().replace(/\/$/, '');
  return (
    <nav className="mb-6 flex flex-wrap gap-1 border-b border-[#d6dedb]" aria-label="SEO sections">
      {TABS.map((t) => (
        <Link key={t.href} href={t.href} aria-current={path === t.href ? 'page' : undefined} className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium ${path === t.href ? 'border-[#0A5C4B] text-[#0A5C4B]' : 'border-transparent text-[#6b7a75] hover:text-neutral-ink'}`}>
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
