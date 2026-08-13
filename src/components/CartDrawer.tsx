'use client';

import Image from 'next/image';
import { useEffect, useId, useRef, useState } from 'react';
import { formatRupees, tariffNote } from '@/content/pricing';
import { useCart, type CartLine } from '@/lib/cart';
import { cn } from '@/lib/cn';
import { serviceAreas, site } from '@/lib/site';

type Errors = Partial<Record<'name' | 'email' | 'phone', string>>;
type Status = 'idle' | 'submitting' | 'sent' | 'error';
/** The drawer is two panes: review the list, then give us your details. */
type Step = 'cart' | 'details';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Indian mobile numbers, tolerant of +91, 0, spaces and dashes. */
const PHONE_RE = /^(?:\+?91[\s-]?|0)?[6-9]\d{4}[\s-]?\d{5}$/;

/**
 * Slide-over cart for the tariff pages.
 *
 * Two panes rather than one: a list long enough to be worth totalling plus a
 * six-field form does not fit a phone-height panel, and stacking them squeezes
 * the list down to two visible rows. The list gets the panel to itself, then
 * hands over to the details pane.
 *
 * The submit path is deliberately the existing `/api/enquiry` route rather than
 * a new order endpoint: this is a request for a pickup and a firm quote, not a
 * purchase. The itemised list is rendered into the enquiry's `message` so the
 * team receives it in the same inbox as every other enquiry, with no new
 * delivery plumbing to configure.
 */
export function CartDrawer() {
  const { lines, count, subtotal, hasFromPrices, isOpen, closeCart, setQuantity, remove, clear } =
    useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Errors>({});
  const [step, setStep] = useState<Step>('cart');
  const formId = useId();

  const fieldId = (name: string) => `${formId}-${name}`;

  // Escape closes, and focus is trapped inside the panel while it is open.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeCart();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    panelRef.current?.querySelector<HTMLElement>('button')?.focus();
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, closeCart]);

  // Locking the body stops the page scrolling under the panel on iOS;
  // compensating for the scrollbar keeps the layout from shifting sideways.
  useEffect(() => {
    if (!isOpen) return;
    const { body } = document;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    body.style.overflow = 'hidden';
    if (gap > 0) body.style.paddingRight = `${gap}px`;
    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, [isOpen]);

  // Reopening after a successful send should offer a fresh cart, not the
  // "thank you" panel from the previous request.
  useEffect(() => {
    if (!isOpen) {
      setStatus('idle');
      setStep('cart');
    }
  }, [isOpen]);

  // Emptying the cart from the details pane would otherwise strand the visitor
  // on a form with nothing to submit.
  useEffect(() => {
    if (lines.length === 0 && step === 'details') setStep('cart');
  }, [lines.length, step]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const phone = String(data.get('phone') ?? '').trim();

    const next: Errors = {};
    if (name.length < 2) next.name = 'Please enter your name.';
    if (!EMAIL_RE.test(email)) next.email = 'Please enter a valid email address.';
    if (!PHONE_RE.test(phone)) next.phone = 'Please enter a valid 10-digit mobile number.';

    setErrors(next);
    if (Object.keys(next).length > 0) {
      form.querySelector<HTMLElement>(`#${CSS.escape(fieldId(Object.keys(next)[0]))}`)?.focus();
      return;
    }

    setStatus('submitting');
    try {
      // Trailing slash matches `trailingSlash: true` in next.config — without
      // it every submission takes a 308 round trip first.
      const response = await fetch('/api/enquiry/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...Object.fromEntries(data.entries()),
          serviceType: 'Garment Care',
          message: buildMessage(lines, subtotal, hasFromPrices, String(data.get('notes') ?? '')),
        }),
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      setStatus('sent');
      clear();
    } catch {
      setStatus('error');
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Your cart">
      <button
        type="button"
        aria-label="Close cart"
        onClick={closeCart}
        className="cart-scrim absolute inset-0 h-full w-full cursor-default bg-neutral-ink/50 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        className="cart-panel absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl"
      >
        <header className="flex items-center justify-between gap-4 border-b border-neutral-line px-5 py-4 sm:px-6">
          {step === 'details' && status !== 'sent' ? (
            <button
              type="button"
              onClick={() => setStep('cart')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
            >
              <span aria-hidden="true">←</span>
              Back to cart
            </button>
          ) : (
            <h2 className="font-display text-lg font-semibold text-neutral-ink">
              Your cart{' '}
              {count > 0 ? (
                <span className="text-neutral-body">
                  ({count} {count === 1 ? 'item' : 'items'})
                </span>
              ) : null}
            </h2>
          )}
          <button
            type="button"
            onClick={closeCart}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-pill border border-neutral-line text-neutral-ink transition-colors hover:bg-neutral-muted"
          >
            <span className="sr-only">Close cart</span>
            <CloseIcon />
          </button>
        </header>

        {status === 'sent' ? (
          <SentPanel onClose={closeCart} />
        ) : lines.length === 0 ? (
          <EmptyPanel onClose={closeCart} />
        ) : step === 'cart' ? (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
              <ul className="space-y-3">
                {lines.map((line) => (
                  <li
                    key={line.id}
                    className="rounded-card border border-neutral-line bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        {/* Thumbnail is optional: lines stored before images
                            shipped simply render without one. Empty alt — the
                            item name sits right beside it. */}
                        {line.image ? (
                          <div
                            aria-hidden="true"
                            className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-brand-light"
                          >
                            <Image
                              src={line.image}
                              alt=""
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>
                        ) : null}
                        <div className="min-w-0">
                          <p className="font-medium text-neutral-ink">{line.item}</p>
                          <p className="mt-0.5 text-xs text-neutral-body">
                            {line.service} · {line.from ? 'from ' : ''}
                            {formatRupees(line.amount)} each
                          </p>
                        </div>
                      </div>
                      <p className="shrink-0 font-display font-semibold tabular-nums text-brand">
                        {formatRupees(line.amount * line.quantity)}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <Stepper
                        label={line.item}
                        quantity={line.quantity}
                        onChange={(next) => setQuantity(line.id, next)}
                      />
                      <button
                        type="button"
                        onClick={() => remove(line.id)}
                        className="text-xs font-medium text-neutral-body underline underline-offset-2 transition-colors hover:text-red-700"
                      >
                        Remove
                        <span className="sr-only"> {line.item}</span>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={clear}
                className="mt-4 text-xs font-medium text-neutral-body underline underline-offset-2 transition-colors hover:text-red-700"
              >
                Clear cart
              </button>
            </div>

            {/* Total and the forward action pinned below the scrolling list, so
                both stay visible however many garments are in the cart. */}
            <div className="border-t border-neutral-line bg-neutral-muted/60 px-5 py-5 sm:px-6">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-medium text-neutral-ink">
                  {hasFromPrices ? 'Estimated total' : 'Total'}
                </span>
                <span className="font-display text-xl font-semibold tabular-nums text-brand">
                  {hasFromPrices ? 'from ' : ''}
                  {formatRupees(subtotal)}
                </span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-neutral-body">
                {tariffNote}
                {hasFromPrices
                  ? ' Items priced “starting from” are confirmed after our team sees the garment.'
                  : ''}
              </p>
              <button
                type="button"
                onClick={() => setStep('details')}
                className="btn-primary btn-md mt-4 w-full"
              >
                Request pickup for these items
              </button>
            </div>
          </>
        ) : (
          <>
            <form
              onSubmit={onSubmit}
              noValidate
              className="flex flex-1 flex-col overflow-y-auto px-5 py-5 sm:px-6"
            >
              <p className="text-sm font-semibold text-neutral-ink">
                Where should we collect {count} {count === 1 ? 'item' : 'items'}?
              </p>
              <p className="mt-1 text-xs text-neutral-body">
                {hasFromPrices ? 'Estimated total ' : 'Total '}
                <span className="font-semibold text-brand">
                  {hasFromPrices ? 'from ' : ''}
                  {formatRupees(subtotal)}
                </span>{' '}
                — excl. GST, confirmed before we collect.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <DrawerField
                  id={fieldId('name')}
                  name="name"
                  label="Name"
                  autoComplete="name"
                  error={errors.name}
                />
                <DrawerField
                  id={fieldId('phone')}
                  name="phone"
                  label="Phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  error={errors.phone}
                />
                <div className="sm:col-span-2">
                  <DrawerField
                    id={fieldId('email')}
                    name="email"
                    label="Email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    error={errors.email}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor={fieldId('city')} className="field-label">
                    Area in Gurgaon
                  </label>
                  <select
                    id={fieldId('city')}
                    name="city"
                    className="field py-2.5"
                    defaultValue=""
                  >
                    <option value="">Select your area</option>
                    {serviceAreas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                    <option value="Elsewhere in Gurgaon">Elsewhere in Gurgaon</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor={fieldId('notes')} className="field-label">
                    Anything we should know? <span className="text-neutral-body">(optional)</span>
                  </label>
                  <textarea
                    id={fieldId('notes')}
                    name="notes"
                    rows={2}
                    placeholder="Stains, delicate fabrics, preferred pickup time…"
                    className="field resize-y py-2.5"
                  />
                </div>
              </div>

              {/* Honeypot: bots fill hidden fields, humans never see this one. */}
              <div aria-hidden="true" className="absolute h-px w-px overflow-hidden opacity-0">
                <label htmlFor={fieldId('company')}>Company</label>
                <input
                  id={fieldId('company')}
                  name="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {/* mt-auto pins the action to the bottom when the form is shorter
                  than the panel, and lets it scroll normally when it is not. */}
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="btn-primary btn-md mt-auto w-full"
              >
                {status === 'submitting' ? 'Sending…' : 'Send request'}
              </button>

              {status === 'error' ? (
                <p role="alert" className="mt-3 text-sm font-medium text-red-700">
                  Something went wrong. Please try again, or call us on{' '}
                  <a href={`tel:${site.phoneHref}`} className="underline">
                    {site.phone}
                  </a>
                  .
                </p>
              ) : (
                <p className="mt-3 text-xs text-neutral-body">
                  No payment is taken here — we confirm the quote before collecting.
                </p>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Renders the cart as the plain-text body of an enquiry. The team reads this in
 * whatever inbox `ENQUIRY_WEBHOOK_URL` points at, so it has to stand alone
 * without the site's markup.
 */
function buildMessage(
  lines: CartLine[],
  subtotal: number,
  hasFromPrices: boolean,
  notes: string,
): string {
  const items = lines
    .map(
      (line) =>
        `• ${line.item} (${line.service}) × ${line.quantity} — ${line.from ? 'from ' : ''}${formatRupees(
          line.amount * line.quantity,
        )}`,
    )
    .join('\n');

  const total = `${hasFromPrices ? 'Estimated total' : 'Total'}: ${
    hasFromPrices ? 'from ' : ''
  }${formatRupees(subtotal)} (excl. GST)`;

  return [
    'Pickup request from the website tariff cart:',
    items,
    total,
    notes.trim() ? `Notes: ${notes.trim()}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

function Stepper({
  label,
  quantity,
  onChange,
}: {
  label: string;
  quantity: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="inline-flex items-center rounded-pill border border-neutral-line">
      <button
        type="button"
        onClick={() => onChange(quantity - 1)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-pill text-neutral-ink transition-colors hover:bg-neutral-muted"
      >
        <span aria-hidden="true">−</span>
        <span className="sr-only">Decrease {label} quantity</span>
      </button>
      <span aria-live="polite" className="w-8 text-center text-sm font-semibold tabular-nums">
        {quantity}
        <span className="sr-only"> {label}</span>
      </span>
      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-pill text-neutral-ink transition-colors hover:bg-neutral-muted"
      >
        <span aria-hidden="true">+</span>
        <span className="sr-only">Increase {label} quantity</span>
      </button>
    </div>
  );
}

function DrawerField({
  id,
  name,
  label,
  error,
  type = 'text',
  ...rest
}: {
  id: string;
  name: string;
  label: string;
  error?: string;
  type?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn('field py-2.5', error && 'field-invalid')}
        {...rest}
      />
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function EmptyPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-pill bg-brand-light text-brand">
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-6 w-6">
          <path
            d="M1 1.5h1.9l1.6 8.2h7.3l1.4-5.9H4"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="6" cy="13" r="1.3" fill="currentColor" />
          <circle cx="11.5" cy="13" r="1.3" fill="currentColor" />
        </svg>
      </span>
      <p className="mt-5 font-display text-lg font-semibold text-neutral-ink">
        Your cart is empty
      </p>
      <p className="mt-2 text-[0.9375rem] text-neutral-body">
        Add garments from the tariff pages and we&apos;ll quote the lot in one go.
      </p>
      <button type="button" onClick={onClose} className="btn-secondary btn-md mt-6">
        Browse tariffs
      </button>
    </div>
  );
}

function SentPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 text-center" role="status">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-pill bg-brand-light text-brand">
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-6 w-6">
          <path
            d="m3 8.5 3.2 3.2L13 5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <p className="mt-5 font-display text-lg font-semibold text-neutral-ink">
        Your list is on its way
      </p>
      <p className="mt-2 text-[0.9375rem] text-neutral-body">
        We&apos;ll confirm the quote and a pickup slot shortly. Urgent? Call{' '}
        <a href={`tel:${site.phoneHref}`} className="font-medium text-brand">
          {site.phone}
        </a>
        .
      </p>
      <button type="button" onClick={onClose} className="btn-secondary btn-md mt-6">
        Keep browsing
      </button>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-4 w-4">
      <path
        d="m4 4 8 8M12 4l-8 8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
