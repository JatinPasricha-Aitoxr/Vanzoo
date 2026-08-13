'use client';

import { useId, useState } from 'react';
import { links, serviceAreas } from '@/lib/site';
import { cn } from '@/lib/cn';

const PICKUP_SLOTS = ['Today', 'Tomorrow', 'This week'] as const;

/**
 * The persistent pickup control (§2.3.1, §3.1).
 *
 * Booking itself lives in Vanzoo's app, so this is a pre-fill affordance rather
 * than a form: the two selects choose a slot and city, and the button hands both
 * to the booking app as query params. It stays a native `<a>` so middle-click
 * and "open in new tab" behave, and both selects carry visible labels for
 * screen readers via `aria-label` on the control group.
 */
export function BookPickupWidget({ variant = 'header' }: { variant?: 'header' | 'inline' }) {
  const [slot, setSlot] = useState<string>(PICKUP_SLOTS[0]);
  const [city, setCity] = useState<string>(serviceAreas[0]);
  const groupId = useId();

  const href = `${links.bookPickup}&pickup=${encodeURIComponent(slot)}&city=${encodeURIComponent(city)}`;

  return (
    <div
      role="group"
      aria-labelledby={groupId}
      className={cn(
        'items-center gap-1 rounded-pill border border-neutral-line bg-white p-1',
        // The header no longer renders this variant — eight nav labels, the cart
        // and the pickup button already fill the bar at every width. It survives
        // for the inline variant inside the mobile menu.
        variant === 'header' ? 'hidden 2xl:flex' : 'flex flex-wrap',
      )}
    >
      <span id={groupId} className="sr-only">
        Book a Vanzoo pickup
      </span>

      <PillSelect
        label="Pickup"
        value={slot}
        onChange={setSlot}
        options={PICKUP_SLOTS}
        srLabel="Pickup day"
      />

      <span aria-hidden="true" className="h-5 w-px shrink-0 bg-neutral-line" />

      <PillSelect
        label="Where"
        value={city}
        onChange={setCity}
        options={serviceAreas}
        srLabel="Pickup area in Gurgaon"
      />

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary btn-sm ml-1 shrink-0"
      >
        Book Pickup
      </a>
    </div>
  );
}

function PillSelect({
  label,
  srLabel,
  value,
  onChange,
  options,
}: {
  label: string;
  srLabel: string;
  value: string;
  onChange: (next: string) => void;
  options: readonly string[];
}) {
  const id = useId();
  return (
    <div className="relative flex items-center gap-1.5 rounded-pill px-3 py-1.5 transition-colors hover:bg-neutral-muted">
      <span aria-hidden="true" className="text-xs font-medium text-neutral-body">
        {label}:
      </span>
      <label htmlFor={id} className="sr-only">
        {srLabel}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="cursor-pointer appearance-none bg-transparent pr-4 text-xs font-semibold text-neutral-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 h-3 w-3 text-neutral-body" />
    </div>
  );
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className={className}>
      <path
        d="M2.5 4.5 6 8l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
