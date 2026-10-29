/** Self-hosted font choices (next/font). Client-safe list; the font files themselves are loaded in app/layout.tsx. */
export const DISPLAY_FONTS = [
  { id: 'fraunces', label: 'Fraunces (current)', cssVar: '--font-display' },
  { id: 'playfair', label: 'Playfair Display', cssVar: '--font-d-playfair' },
  { id: 'lora', label: 'Lora', cssVar: '--font-d-lora' },
  { id: 'cormorant', label: 'Cormorant Garamond', cssVar: '--font-d-cormorant' },
] as const;

export const SANS_FONTS = [
  { id: 'inter', label: 'Inter (current)', cssVar: '--font-sans' },
  { id: 'dmsans', label: 'DM Sans', cssVar: '--font-s-dmsans' },
  { id: 'lato', label: 'Lato', cssVar: '--font-s-lato' },
  { id: 'poppins', label: 'Poppins', cssVar: '--font-s-poppins' },
] as const;

/** Defaults for the editor's responsive overrides (tablet ≤ px, mobile ≤ px). */
export const DEFAULT_BREAKPOINTS = { tablet: 1023, mobile: 639 } as const;
export const BP_RANGE = { tablet: [768, 1279], mobile: [480, 767] } as const;
