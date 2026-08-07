'use client';

import { useId, useState } from 'react';
import { Icon } from './ui/Icon';
import { links, site } from '@/lib/site';

/**
 * "Check if we deliver to your area" (§3.8, optional).
 *
 * Vanzoo publishes no pincode-level coverage list, so this deliberately does
 * not claim a definitive yes/no. It checks the pincode against the NCR prefixes
 * Vanzoo names as its service area and, for anything outside them, points the
 * visitor at the phone number rather than guessing. Replace `NCR_PREFIXES` with
 * a real serviceability lookup when one exists — see README.
 */
const NCR_PREFIXES: Array<{ prefix: string; area: string }> = [
  { prefix: '122', area: 'Gurugram' },
  { prefix: '110', area: 'Delhi' },
  { prefix: '201', area: 'Noida & Ghaziabad' },
  { prefix: '121', area: 'Faridabad' },
];

type Result = { covered: boolean; area?: string } | null;

export function PincodeChecker() {
  const inputId = useId();
  const [value, setValue] = useState('');
  const [result, setResult] = useState<Result>(null);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const pincode = value.trim();

    if (!/^\d{6}$/.test(pincode)) {
      setError('Please enter a 6-digit Indian pincode.');
      setResult(null);
      return;
    }

    setError(null);
    const match = NCR_PREFIXES.find((entry) => pincode.startsWith(entry.prefix));
    setResult(match ? { covered: true, area: match.area } : { covered: false });
  }

  return (
    <div className="rounded-card border border-neutral-line bg-white p-6 sm:p-8">
      <h3 className="font-display text-xl font-semibold">Check if we deliver to your area</h3>
      <p className="mt-2 text-[0.9375rem] text-neutral-body">
        Enter your pincode and we&apos;ll tell you whether free pickup covers it.
      </p>

      <form onSubmit={onSubmit} noValidate className="mt-6">
        <label htmlFor={inputId} className="field-label">
          Pincode
        </label>
        <div className="flex flex-wrap gap-3">
          <input
            id={inputId}
            name="pincode"
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={6}
            value={value}
            onChange={(event) => setValue(event.target.value.replace(/\D/g, ''))}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${inputId}-error` : undefined}
            placeholder="122009"
            className={`field flex-1 ${error ? 'field-invalid' : ''}`}
          />
          <button type="submit" className="btn-primary btn-md shrink-0 gap-2">
            <Icon name="search" className="text-base" />
            Check
          </button>
        </div>
        {error ? (
          <p id={`${inputId}-error`} role="alert" className="mt-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}
      </form>

      {/* aria-live so the answer is announced without moving focus. */}
      <div aria-live="polite" className="mt-5">
        {result?.covered ? (
          <div className="flex gap-3 rounded-card border border-success/30 bg-success/5 p-4">
            <Icon name="shieldCheck" className="mt-0.5 text-lg text-success" />
            <div>
            <p className="text-[0.9375rem] font-semibold text-neutral-ink">
              Good news — we cover {result.area}.
            </p>
            <a
              href={links.bookPickup}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary btn-sm mt-3"
            >
              Book a pickup
            </a>
            </div>
          </div>
        ) : null}

        {result && !result.covered ? (
          <div className="flex gap-3 rounded-card border border-neutral-line bg-neutral-muted p-4">
            <Icon name="info" className="mt-0.5 text-lg text-brand" />
            <p className="text-[0.9375rem] text-neutral-body">
              That pincode is outside the areas we list, but our coverage changes — call{' '}
              <a href={`tel:${site.phoneHref}`} className="font-semibold text-brand">
                {site.phone}
              </a>{' '}
              and we&apos;ll confirm.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
