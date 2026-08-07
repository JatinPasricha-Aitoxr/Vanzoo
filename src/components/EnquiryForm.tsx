'use client';

import { useId, useState } from 'react';
import { contactTimes, serviceTypes } from '@/content/marketing';
import { Icon, IconBadge } from './ui/Icon';
import { serviceCities, site } from '@/lib/site';
import { cn } from '@/lib/cn';

type Errors = Partial<Record<'name' | 'email' | 'phone' | 'message', string>>;
type Status = 'idle' | 'submitting' | 'sent' | 'error';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Indian mobile numbers, tolerant of +91, 0, spaces and dashes. */
const PHONE_RE = /^(?:\+?91[\s-]?|0)?[6-9]\d{4}[\s-]?\d{5}$/;

/**
 * Enquiry form (§3.2.11) — fields carried over from the live site's form.
 *
 * Validation is client-side and non-blocking: errors are announced via
 * `aria-describedby` + `role="alert"` and the fields keep native types so mobile
 * keyboards and autofill behave. Submission POSTs to `/api/enquiry`; wire that
 * route to a mail provider before launch (see README).
 */
export function EnquiryForm({ variant = 'full' }: { variant?: 'full' | 'compact' }) {
  const formId = useId();
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');

  const fieldId = (name: string) => `${formId}-${name}`;
  const errorId = (name: string) => `${formId}-${name}-error`;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const phone = String(data.get('phone') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();

    const next: Errors = {};
    if (name.length < 2) next.name = 'Please enter your name.';
    if (!EMAIL_RE.test(email)) next.email = 'Please enter a valid email address.';
    if (!PHONE_RE.test(phone)) next.phone = 'Please enter a valid 10-digit mobile number.';
    if (message.length < 10) next.message = 'Please tell us a little more (10 characters or more).';

    setErrors(next);
    if (Object.keys(next).length > 0) {
      form.querySelector<HTMLElement>(`#${CSS.escape(fieldId(Object.keys(next)[0]))}`)?.focus();
      return;
    }

    setStatus('submitting');
    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(data.entries())),
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      setStatus('sent');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div
        role="status"
        className="rounded-card border border-neutral-line bg-white p-8 text-center"
      >
        <IconBadge name="check" tone="success" size="lg" className="mx-auto" />
        <h3 className="mt-4 font-display text-xl font-semibold">
          Thank you — your enquiry is in.
        </h3>
        <p className="mt-3 text-[0.9375rem] text-neutral-body">
          Our team will get back to you promptly. If it&apos;s urgent, call us on{' '}
          <a href={`tel:${site.phoneHref}`} className="font-medium text-brand">
            {site.phone}
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="btn-secondary btn-md mt-6"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-card border border-neutral-line bg-white p-6 sm:p-8"
    >
      <div className={cn('grid gap-x-5 gap-y-5', variant === 'full' && 'sm:grid-cols-2')}>
        <Field
          id={fieldId('name')}
          errorId={errorId('name')}
          name="name"
          label="Full Name"
          autoComplete="name"
          required
          error={errors.name}
        />
        <Field
          id={fieldId('email')}
          errorId={errorId('email')}
          name="email"
          label="Email Address"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          error={errors.email}
        />
        <Field
          id={fieldId('phone')}
          errorId={errorId('phone')}
          name="phone"
          label="Phone Number"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          error={errors.phone}
        />

        <div>
          <label htmlFor={fieldId('city')} className="field-label">
            City
          </label>
          <select id={fieldId('city')} name="city" className="field" defaultValue={serviceCities[0]}>
            {serviceCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>
        </div>

        {variant === 'full' ? (
          <>
            <div>
              <label htmlFor={fieldId('bestTime')} className="field-label">
                Best Time to Contact
              </label>
              <select id={fieldId('bestTime')} name="bestTime" className="field" defaultValue="">
                <option value="">Any time</option>
                {contactTimes.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor={fieldId('serviceType')} className="field-label">
                Service Type
              </label>
              <select
                id={fieldId('serviceType')}
                name="serviceType"
                className="field"
                defaultValue={serviceTypes[0]}
              >
                {serviceTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <fieldset className="sm:col-span-2">
              <legend className="field-label">Preferred Contact Method</legend>
              <div className="mt-1 flex flex-wrap gap-3">
                {['Email', 'Phone'].map((method, index) => (
                  <label
                    key={method}
                    className="inline-flex cursor-pointer items-center gap-2.5 rounded-pill border border-neutral-line px-4 py-2.5 text-[0.9375rem] transition-colors hover:border-brand/40 has-[:checked]:border-brand has-[:checked]:bg-brand-tint"
                  >
                    <input
                      type="radio"
                      name="contactMethod"
                      value={method}
                      defaultChecked={index === 0}
                      className="h-4 w-4 accent-brand"
                    />
                    {method}
                  </label>
                ))}
              </div>
            </fieldset>
          </>
        ) : null}

        <div className={cn(variant === 'full' && 'sm:col-span-2')}>
          <label htmlFor={fieldId('message')} className="field-label">
            Message/Details <RequiredMark />
          </label>
          <textarea
            id={fieldId('message')}
            name="message"
            rows={4}
            required
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? errorId('message') : undefined}
            className={cn('field resize-y', errors.message && 'field-invalid')}
          />
          <FieldError id={errorId('message')} message={errors.message} />
        </div>
      </div>

      {/* Honeypot: bots fill hidden fields, humans never see this one. */}
      <div aria-hidden="true" className="absolute h-px w-px overflow-hidden opacity-0">
        <label htmlFor={fieldId('company')}>Company</label>
        <input id={fieldId('company')} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="btn-primary btn-lg gap-2"
        >
          {status === 'submitting' ? 'Sending…' : 'Submit Enquiry'}
          <Icon name="arrowRight" className="arrow-nudge" />
        </button>
        <p className="text-xs text-neutral-body">
          We&apos;ll only use these details to respond to your enquiry.
        </p>
      </div>

      {status === 'error' ? (
        <p role="alert" className="mt-4 flex items-start gap-2 text-sm font-medium text-red-700">
          <Icon name="info" className="mt-0.5 text-base" />
          <span>
          Something went wrong sending your enquiry. Please try again, or call us on{' '}
          <a href={`tel:${site.phoneHref}`} className="underline">
            {site.phone}
          </a>
          .
          </span>
        </p>
      ) : null}
    </form>
  );
}

function Field({
  id,
  errorId,
  name,
  label,
  error,
  required,
  type = 'text',
  ...rest
}: {
  id: string;
  errorId: string;
  name: string;
  label: string;
  error?: string;
  required?: boolean;
  type?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label} {required ? <RequiredMark /> : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn('field', error && 'field-invalid')}
        {...rest}
      />
      <FieldError id={errorId} message={error} />
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-sm text-red-700">
      {message}
    </p>
  );
}

function RequiredMark() {
  return (
    <span className="text-red-700">
      <span aria-hidden="true">*</span>
      <span className="sr-only">(required)</span>
    </span>
  );
}
