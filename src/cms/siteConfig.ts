import { unstable_cache } from 'next/cache';
import { DISPLAY_FONTS, SANS_FONTS } from './fonts';
import { readSetting } from './seoStore';

/** Editable design tokens and navigation. Anything unset falls back to the code defaults in site.ts / tailwind. */
export const DESIGN_TAG = 'design';
export const SITECFG_TAG = 'siteconfig';

export const TOKENS = [
  { key: 'brand', label: 'Brand green', group: 'Brand', def: '#004A40' },
  { key: 'brand-dark', label: 'Brand dark', group: 'Brand', def: '#00332C' },
  { key: 'brand-light', label: 'Brand light', group: 'Brand', def: '#E6F0EC' },
  { key: 'brand-ink', label: 'Brand ink (footer)', group: 'Brand', def: '#001A16' },
  { key: 'brand-hover', label: 'Brand hover', group: 'Brand', def: '#00695A' },
  { key: 'brand-tint', label: 'Brand tint', group: 'Brand', def: '#F4F9F7' },
  { key: 'gold', label: 'Gold (icons, rules)', group: 'Accent', def: '#FFB107' },
  { key: 'gold-soft', label: 'Gold on dark', group: 'Accent', def: '#F5E0B0' },
  { key: 'gold-ink', label: 'Gold text on light', group: 'Accent', def: '#7A5200' },
  { key: 'ink', label: 'Headings', group: 'Text & surfaces', def: '#12181B' },
  { key: 'body', label: 'Body text', group: 'Text & surfaces', def: '#4A5559' },
  { key: 'line', label: 'Borders', group: 'Text & surfaces', def: '#E2E8E9' },
  { key: 'surface', label: 'Page background', group: 'Text & surfaces', def: '#FFFFFF' },
  { key: 'muted', label: 'Muted background', group: 'Text & surfaces', def: '#F6F8F8' },
  { key: 'success', label: 'Success', group: 'Text & surfaces', def: '#2E7D5B' },
] as const;

export type DesignOverrides = Record<string, string>;
const HEX = /^#[0-9a-f]{6}$/i;

export const getDesign = unstable_cache(() => readSetting<DesignOverrides>('design', {}), ['design'], { tags: [DESIGN_TAG], revalidate: 300 });

/** CSS for only the tokens that differ from the defaults; empty string when nothing is customised. */
export function designCss(o: DesignOverrides): string {
  const rules = TOKENS.filter((t) => o[t.key] && HEX.test(o[t.key]) && o[t.key].toUpperCase() !== t.def)
    .map((t) => `--c-${t.key}:${[1, 3, 5].map((i) => parseInt(o[t.key].slice(i, i + 2), 16)).join(' ')}`);
  const out = rules.length ? [`:root{${rules.join(';')}}`] : [];
  // Font choice: re-point the existing font variables at an alternative loaded in app/layout.tsx.
  const fd = DISPLAY_FONTS.find((f) => f.id === o['font-display']);
  const fs = SANS_FONTS.find((f) => f.id === o['font-sans']);
  const fonts = [fd && fd.id !== 'fraunces' ? `--font-display:var(${fd.cssVar})` : '', fs && fs.id !== 'inter' ? `--font-sans:var(${fs.cssVar})` : ''].filter(Boolean);
  if (fonts.length) out.push(`html:root{${fonts.join(';')}}`);
  return out.join('');
}

export type NavItem = { label: string; href: string };
export type FooterColumn = { heading: string; links: NavItem[] };
export type Announcement = { enabled: boolean; text: string; linkLabel: string; href: string; tone: 'dark' | 'gold'; dismissible: boolean; startsAt: string; endsAt: string };
export const DEFAULT_ANNOUNCEMENT: Announcement = { enabled: false, text: '', linkLabel: '', href: '', tone: 'dark', dismissible: true, startsAt: '', endsAt: '' };
export type SiteConfig = { nav?: NavItem[]; footerColumns?: FooterColumn[]; social?: { label: string; href: string }[]; announcement?: Announcement };

export const getSiteConfig = unstable_cache(() => readSetting<SiteConfig>('siteconfig', {}), ['siteconfig'], { tags: [SITECFG_TAG], revalidate: 300 });
