import { Reveal } from './Reveal';
import { cn } from '@/lib/cn';

type SectionProps = {
  children: React.ReactNode;
  id?: string;
  className?: string;
  /** `muted` and `light` are the two alternate bands; `dark` is the teal band. */
  tone?: 'surface' | 'muted' | 'light' | 'dark';
  /** Tightens the vertical rhythm where two related bands sit back to back. */
  size?: 'default' | 'sm';
  as?: 'section' | 'div' | 'aside';
  'aria-labelledby'?: string;
};

const TONES = {
  surface: 'bg-neutral-surface',
  muted: 'bg-neutral-muted',
  light: 'bg-brand-light',
  dark: 'bg-brand-dark text-white',
} as const;

export function Section({
  children,
  id,
  className,
  tone = 'surface',
  size = 'default',
  as: Tag = 'section',
  ...rest
}: SectionProps) {
  return (
    <Tag
      id={id}
      className={cn(
        TONES[tone],
        size === 'sm' ? 'py-section-sm' : 'py-section',
        className,
      )}
      {...rest}
    >
      <div className="shell">{children}</div>
    </Tag>
  );
}

type SectionHeadingProps = {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  id?: string;
  align?: 'left' | 'center';
  tone?: 'light' | 'dark';
  className?: string;
  /** Rendered as h2 by default; pass 'h1' on pages where this is the page title. */
  as?: 'h1' | 'h2';
};

export function SectionHeading({
  eyebrow,
  title,
  intro,
  id,
  align = 'left',
  tone = 'light',
  className,
  as: Tag = 'h2',
}: SectionHeadingProps) {
  return (
    <Reveal
      variant="up"
      className={cn(
        'max-w-2xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {eyebrow ? (
        <p className={cn('eyebrow', tone === 'dark' && 'text-accent-gold-soft')}>{eyebrow}</p>
      ) : null}
      <Tag
        id={id}
        className={cn(
          Tag === 'h1' ? 'text-display-lg' : 'text-display-md',
          eyebrow && 'mt-3',
          tone === 'dark' && 'text-white',
        )}
      >
        {title}
      </Tag>
      {intro ? (
        <p
          className={cn(
            'mt-4 text-lead text-pretty',
            tone === 'dark' ? 'text-white/80' : 'text-neutral-body',
          )}
        >
          {intro}
        </p>
      ) : null}
    </Reveal>
  );
}
