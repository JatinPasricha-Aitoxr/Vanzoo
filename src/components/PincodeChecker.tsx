'use client';

import { useId, useState } from 'react';
import { links, site } from '@/lib/site';

/**
 * "Check if we deliver to your area" (§3.8, optional).
 *
 * Vanzoo serves Gurgaon and publishes no pincode-level coverage list, so this
 * matches on the Gurgaon prefix rather than asserting a per-locality answer it
 * cannot back. Anything outside it is pointed at the phone number rather than
 * guessed at. Replace this with a real serviceability lookup when one exists —
 * see README "Service areas".
 */
const GURGAON_PREFIX = '122';

type Result = { covered: boolean } | null;

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
    setResult({ covered: pincode.startsWith(GURGAON_PREFIX) });
  }

  return (
    <div className="rounded-card border border-neutral-line bg-white p-6 sm:p-8">
      <h3 className="font-display text-xl font-semibold">Check if we collect from your area</h3>
      <p className="mt-2 text-[0.9375rem] text-neutral-body">
        Enter your Gurgaon pincode and we&apos;ll tell you whether free pickup covers it.
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
          <button type="submit" className="btn-primary btn-md shrink-0">
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
          <div className="rounded-card border border-success/30 bg-success/5 p-4">
            <p className="text-[0.9375rem] font-semibold text-neutral-ink">
              Good news — that&apos;s Gurgaon, and free pickup covers it.
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
        ) : null}

        {result && !result.covered ? (
          <div className="rounded-card border border-neutral-line bg-neutral-muted p-4">
            <p className="text-[0.9375rem] text-neutral-body">
              That pincode is outside Gurgaon, but our coverage changes — call{' '}
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
