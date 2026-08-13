'use client';

import { useState } from 'react';

/**
 * Article share row (§3.10).
 *
 * Uses the native share sheet where the browser offers one (every mobile
 * browser Vanzoo's audience uses), and falls back to per-network share URLs on
 * desktop. Nothing here loads a third-party SDK — social share buttons are a
 * common source of blocking scripts and trackers, and plain links do the job.
 */
export function ShareLinks({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const targets = [
    { label: 'WhatsApp', href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: 'X', href: `https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}` },
    {
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
  ];

  async function onNativeShare() {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // User dismissed the sheet — fall through to copying instead.
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-semibold text-neutral-ink">Share this article</span>

      <ul className="flex flex-wrap items-center gap-2">
        {targets.map((target) => (
          <li key={target.label}>
            <a
              href={target.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary btn-sm"
            >
              {target.label}
            </a>
          </li>
        ))}
        <li>
          <button type="button" onClick={onNativeShare} className="btn-secondary btn-sm">
            {copied ? 'Link copied' : 'Copy link'}
          </button>
        </li>
      </ul>

      <span aria-live="polite" className="sr-only">
        {copied ? 'Link copied to clipboard' : ''}
      </span>
    </div>
  );
}
