import type { Config } from 'tailwindcss';

/**
 * Vanzoo design tokens.
 *
 * Single source of truth for the palette — see README "Theming" before
 * changing any value here, since the JSON-LD `priceRange`, the OG images and
 * the manifest theme colour are the only brand colours that live elsewhere.
 *
 * The green and gold are the live vanzoo.in brand colours, read straight out of
 * the site's Elementor global palette (`--e-global-color-7288823: #004A40` and
 * `--e-global-color-1db031f: #FFB107`); `brand.ink` is the near-black green the
 * live site uses in its footer and icon strokes (`#001A16`).
 *
 * Contrast (WCAG 2.1, measured against the surface each token is used on):
 *   brand.DEFAULT on white ......... 10.2:1 ✔ AAA normal text
 *   brand.DEFAULT on brand.light ...  8.8:1 ✔ AAA normal text
 *   white on brand.hover ...........  6.6:1 ✔ AA normal text
 *   white on brand.dark ............ 13.9:1 ✔ AAA normal text
 *   white on brand.ink ............. 18.6:1 ✔ AAA normal text
 *   neutral.body on white ..........  7.6:1 ✔ AA normal text
 *   accent.gold on white ...........  1.8:1 ✘ never text
 *   accent.gold on brand.dark ......  7.6:1 ✘ never text
 *   accent.gold-ink on white .......  6.9:1 ✔ the gold to use on light surfaces
 *   accent.gold-soft on brand.dark . 13.4:1 ✔ the gold to use on dark surfaces
 *
 * `accent.gold` is therefore restricted to icon fills, star glyphs and hairline
 * rules — anything conveyed by shape rather than by reading it. Gold *text*
 * always uses `gold-ink` (on light) or `gold-soft` (on dark).
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#004A40',
          dark: '#00332C',
          light: '#E6F0EC',
          /** Near-black green — footer base and the deepest bands. */
          ink: '#001A16',
          // Intermediate steps the brand palette doesn't name but hover/border
          // states need. Hover lifts *lighter*: #004A40 is already so dark that
          // darkening it further reads as a disabled state rather than a press.
          hover: '#00695A',
          tint: '#F4F9F7',
        },
        accent: {
          /** Decorative only — icons, stars, rules. Never text. */
          gold: '#FFB107',
          /** Gold text on dark surfaces. */
          'gold-soft': '#F5E0B0',
          /** Gold text on light surfaces. */
          'gold-ink': '#7A5200',
        },
        neutral: {
          ink: '#12181B',
          body: '#4A5559',
          line: '#E2E8E9',
          surface: '#FFFFFF',
          muted: '#F6F8F8',
        },
        success: '#2E7D5B',
      },
      fontFamily: {
        // Bound in src/app/layout.tsx via next/font — self-hosted, swap-display.
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'ui-serif', 'Georgia', 'serif'],
      },
      fontSize: {
        // Fluid display scale. Lower bound is the mobile size; the xl upper
        // bound runs past the brief's 72px to 88px — the old site's headline
        // drama is part of what reads as premium, and the hero column has the
        // room for it.
        'display-xl': ['clamp(2.75rem, 6.2vw, 5.5rem)', { lineHeight: '1.02', letterSpacing: '-0.022em' }],
        'display-lg': ['clamp(2.25rem, 4.4vw, 3.625rem)', { lineHeight: '1.07', letterSpacing: '-0.018em' }],
        'display-md': ['clamp(1.75rem, 2.8vw, 2.5rem)', { lineHeight: '1.14', letterSpacing: '-0.015em' }],
        'display-sm': ['clamp(1.375rem, 2vw, 1.75rem)', { lineHeight: '1.22', letterSpacing: '-0.01em' }],
        lead: ['clamp(1.0625rem, 1.2vw, 1.1875rem)', { lineHeight: '1.65' }],
        body: ['1rem', { lineHeight: '1.6' }],
      },
      spacing: {
        section: 'clamp(4rem, 8vw, 8rem)',
        'section-sm': 'clamp(3rem, 5vw, 5rem)',
      },
      maxWidth: {
        shell: '1280px',
        prose: '720px',
      },
      borderRadius: {
        pill: '9999px',
        card: '16px',
        media: '24px',
      },
      boxShadow: {
        // Deliberately restrained — the brief asks for 1px borders over shadows.
        header: '0 1px 0 #E2E8E9, 0 6px 24px -20px rgba(18,24,27,0.45)',
        pop: '0 2px 4px rgba(18,24,27,0.04), 0 18px 40px -24px rgba(0,74,64,0.35)',
        /** Resting state for the tariff/review cards. */
        lift: '0 1px 2px rgba(0,26,22,0.04), 0 12px 28px -20px rgba(0,74,64,0.30)',
        /** Hover state — the card rises and the shadow deepens with it. */
        'lift-hover': '0 2px 6px rgba(0,26,22,0.06), 0 26px 52px -26px rgba(0,74,64,0.45)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translate3d(0, 20px, 0)' },
          to: { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.4s ease-out both',
      },
      transitionTimingFunction: {
        entrance: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionDuration: {
        // The brief's 150–200ms hover window.
        DEFAULT: '180ms',
      },
    },
  },
  plugins: [],
};

export default config;
