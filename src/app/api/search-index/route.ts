import { NextResponse } from 'next/server';
import { getCatalogs, getServices } from '@/cms/content';
import { getSiteConfig } from '@/cms/siteConfig';
import { formatPrice } from '@/content/pricing';
import { navLinks } from '@/lib/site';

/** Header-search index: pages, services and every tariff row, including editor changes. Loaded on first open. */
export const dynamic = 'force-dynamic';

export async function GET() {
  const [services, catalogs, cfg] = await Promise.all([getServices(), getCatalogs(), getSiteConfig()]);
  const pages = (cfg.nav?.length ? cfg.nav : navLinks).map((l) => ({ label: l.label, href: l.href, group: 'Pages' }));
  const svc = services.map((s) => ({ label: s.title, href: `/services/${s.id}/`, group: 'Services' }));
  const products = [catalogs.couture, catalogs.steam].flatMap((c) =>
    c.groups.flatMap((g) => g.rows.map((r) => ({ label: r.item, href: `/pricing/#${g.id}`, group: `${g.label} · ${c.label}`, price: formatPrice(r) }))),
  );
  return NextResponse.json({ items: [...pages, ...svc, ...products] }, { headers: { 'cache-control': 'public, s-maxage=300, stale-while-revalidate=600' } });
}
