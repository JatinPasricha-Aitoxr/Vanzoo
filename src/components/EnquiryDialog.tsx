'use client';

import { useEffect, useRef, useState } from 'react';
import { EnquiryForm } from './EnquiryForm';
import { enquiryIntro } from '@/content/marketing';

/**
 * "Enquire Now" trigger + modal (§3.2.3).
 *
 * Built on the native `<dialog>` element, so focus trapping, Escape-to-close,
 * inertness of the page behind it and the `aria-modal` semantics come from the
 * platform rather than from hand-rolled key handlers.
 *
 * The form is only mounted while the dialog is open — this component appears six
 * times on the homepage, and mounting six idle forms would put six copies of
 * every field into the accessibility tree.
 */
export function EnquiryDialog({
  label = 'Enquire Now',
  subject,
  variant = 'link',
}: {
  label?: string;
  /** Pre-selects the service in the form's dropdown, e.g. a service row title. */
  subject?: string;
  variant?: 'link' | 'button';
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  /**
   * Kept true through the closing transition. The form is only mounted while
   * the dialog is in use — this component appears six times on the homepage,
   * and six idle forms would put six copies of every field in the
   * accessibility tree — but unmounting it the instant `open` flips would
   * empty the panel mid-exit. This holds the content for the animation.
   */
  const [content, setContent] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      setContent(true);
      if (!dialog.open) dialog.showModal();
      return;
    }

    if (dialog.open) dialog.close();
    // Matches --dur-mid in motion.css.
    const timer = window.setTimeout(() => setContent(false), 320);
    return () => window.clearTimeout(timer);
  }, [open]);

  // Locking the body stops the page scrolling behind the modal on iOS.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          variant === 'button'
            ? 'btn-primary btn-md'
            : 'inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-brand transition-colors hover:text-brand-dark'
        }
      >
        {label}
        {subject ? <span className="sr-only"> about {subject}</span> : null}
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        // Clicking the backdrop closes; the inner wrapper stops the event so a
        // click inside the panel doesn't bubble up as a backdrop click.
        onClick={(event) => {
          if (event.target === dialogRef.current) setOpen(false);
        }}
        aria-labelledby="enquiry-dialog-title"
        className="dialog-animated w-[min(46rem,calc(100vw-2rem))] rounded-media bg-neutral-muted p-0 backdrop:bg-neutral-ink/60 backdrop:backdrop-blur-sm"
      >
        {content ? (
          <div className="max-h-[85svh] overflow-y-auto p-6 sm:p-8">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h2 id="enquiry-dialog-title" className="text-display-sm">
                  Request an Enquiry
                </h2>
                {subject ? <p className="eyebrow mt-2">{subject}</p> : null}
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-pill border border-neutral-line bg-white text-neutral-ink transition-colors hover:bg-neutral-muted"
              >
                <span className="sr-only">Close enquiry form</span>
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-4 w-4">
                  <path
                    d="M5 5l10 10M15 5L5 15"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <p className="mt-4 text-[0.9375rem] leading-relaxed text-neutral-body">
              {enquiryIntro}
            </p>

            <div className="mt-6">
              <EnquiryForm variant="compact" />
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
