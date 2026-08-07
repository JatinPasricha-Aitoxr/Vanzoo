import type { Config } from 'tailwindcss';

/**
 * Vanzoo design tokens.
 *
 * Single source of truth for the palette — see README "Theming" before
 * changing any value here, since the JSON-LD `priceRange`, the OG images and
 * the manifest theme colour are the only brand colours that live elsewhere.
 *
 * Contrast (WCAG 2.1, measured against the surface each token is used on):
 *   brand.DEFAULT on white ......... 6.9:1  ✔ AA normal text
 *   white on brand.dark ............ 9.7:1  ✔ AAA normal text
 *   neutral.body on white .......... 7.6:1  ✔ AA normal text
 *   accent.gold on white ........... 2.4:1  ✘ never text
 *   accent.gold on brand.dark ...... 4.1:1  ✘ never text
 *   accent.gold-ink on white ....... 5.0:1  ✔ the gold to use on light surfaces
 *   accent.gold-soft on brand.dark . 7.6:1  ✔ the gold to use on dark surfaces
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
          DEFAULT: '#1E6177',
          dark: '#154A5C',
          light: '#E8F1F3',
          // Intermediate steps the brief doesn't name but hover/border states need.
          hover: '#19566A',
          tint: '#F2F8F9',
        },
        accent: {
          /** Decorative only — icons, stars, rules. Never text. */
          gold: '#C9A24B',
          /** Gold text on dark surfaces. */
          'gold-soft': '#EFE2C4',
          /** Gold text on light surfaces. */
          'gold-ink': '#8A6B1F',
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
        // Fluid display scale. Lower bound is the mobile size, upper bound the
        // 48–72px the brief specifies for H1 and 32–40px for H2.
        'display-xl': ['clamp(2.5rem, 5.4vw, 4.5rem)', { lineHeight: '1.04', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2.125rem, 4vw, 3.25rem)', { lineHeight: '1.08', letterSpacing: '-0.018em' }],
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
        pop: '0 2px 4px rgba(18,24,27,0.04), 0 18px 40px -24px rgba(30,97,119,0.35)',
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
