'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { api } from './ui';

const NAV = [
  { group: 'Overview', items: [{ href: '/admin', label: 'Dashboard', icon: '▦' }] },
  { group: 'Website Builder', items: [{ href: '/admin/pages', label: 'Pages', icon: '▤' }, { href: '/admin/posts', label: 'Blog posts', icon: '✎' }, { href: '/admin/templates', label: 'Detail templates', icon: '▥' }, { href: '/admin/media', label: 'Media library', icon: '▣' }] },
  { group: 'Content', items: [{ href: '/admin/content/service', label: 'Services', icon: '✦' }, { href: '/admin/content/product', label: 'Garment pages', icon: '◧' }, { href: '/admin/content/area', label: 'Locality pages', icon: '⌖' }, { href: '/admin/content/faq', label: 'FAQs', icon: '?' }, { href: '/admin/copy', label: 'Page text', icon: '¶' }, { href: '/admin/content/pricing', label: 'Pricing', icon: '₹', admin: true }] },
  { group: 'SEO', items: [{ href: '/admin/seo', label: 'SEO & redirects', icon: '◎' }] },
  { group: 'Website Settings', items: [{ href: '/admin/settings', label: 'Site settings', icon: '⚙', admin: true }, { href: '/admin/contact', label: 'Contact & locations', icon: '☎', admin: true }, { href: '/admin/design', label: 'Design tokens', icon: '◐', admin: true }, { href: '/admin/site', label: 'Header, footer & contact', icon: '☰', admin: true }] },
  { group: 'System', items: [{ href: '/admin/system', label: 'System & health', icon: '✚' }, { href: '/admin/users', label: 'Users & roles', icon: '☺', admin: true }] },
];

/** Collapsible WordPress-style sidebar around every non-editor admin screen. */
export function AdminShell({ user, role = 'admin', children }: { user: string; role?: 'admin' | 'editor'; children: React.ReactNode }) {
  const path = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  async function logout() {
    await api('/api/cms/auth/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  }

  return (
    <div className="flex min-h-screen">
      <aside className={`sticky top-0 flex h-screen shrink-0 flex-col bg-[#0b2f27] text-white transition-[width] duration-200 ${collapsed ? 'w-16' : 'w-60'}`} aria-label="Admin navigation">
        <div className="flex items-center justify-between px-4 py-4">
          {!collapsed ? <span className="font-display text-lg font-semibold tracking-wide">VANZOO <span className="text-[#FFB107]">CMS</span></span> : null}
          <button type="button" onClick={() => setCollapsed((c) => !c)} className="rounded p-1.5 hover:bg-white/10" aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} aria-expanded={!collapsed}>{collapsed ? '»' : '«'}</button>
        </div>
        <nav className="flex-1 overflow-y-auto px-2">
          {NAV.map((g) => ({ ...g, items: g.items.filter((i) => role === 'admin' || !('admin' in i && i.admin)) })).filter((g) => g.items.length).map((g) => (
            <div key={g.group} className="mb-4">
              {!collapsed ? <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-white/50">{g.group}</p> : null}
              {g.items.map((i) => {
                const active = i.href === '/admin' ? path === '/admin' : path.startsWith(i.href);
                return (
                  <Link key={i.href} href={i.href} title={i.label} aria-current={active ? 'page' : undefined} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${active ? 'bg-white/15 font-semibold' : 'text-white/80 hover:bg-white/10'}`}>
                    <span aria-hidden="true" className="w-4 text-center">{i.icon}</span>
                    {!collapsed ? i.label : <span className="sr-only">{i.label}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="border-t border-white/10 p-3 text-xs">
          {!collapsed ? <p className="mb-2 truncate text-white/70">Signed in as <strong>{user}</strong></p> : null}
          <a href="/" target="_blank" rel="noreferrer" className="block rounded px-2 py-1.5 text-white/80 hover:bg-white/10">{collapsed ? '↗' : 'View website ↗'}</a>
          <button type="button" onClick={logout} className="mt-1 w-full rounded px-2 py-1.5 text-left text-white/80 hover:bg-white/10">{collapsed ? '⎋' : 'Sign out'}</button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-6 lg:p-8">{children}</main>
    </div>
  );
}
