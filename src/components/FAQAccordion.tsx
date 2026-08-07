import type { Faq } from '@/content/marketing';

/**
 * FAQ accordion (§2.3.8).
 *
 * Built on native `<details>`/`<summary>`: keyboard operation, the open/closed
 * state announcement and in-page find are all handled by the browser, and the
 * answers are present in the DOM whether or not a panel is open — which is what
 * makes the FAQPage schema on these pages truthful.
 *
 * `name` groups the items into a single-open accordion in browsers that support
 * it, and degrades to independent toggles in those that don't.
 *
 * The panel animates open via the grid-rows technique (see `.accordion-panel` in
 * motion.css) — `<details>` cannot transition to auto height, and collapsing
 * with `max-height` guesswork either clips long answers or eases at the wrong
 * speed depending on how much text there is.
 */
export function FAQAccordion({
  faqs,
  groupName = 'faq',
}: {
  faqs: readonly Faq[];
  groupName?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl">
      {faqs.map((faq) => (
        <details
          key={faq.question}
          name={groupName}
          className="group border-b border-neutral-line"
        >
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 text-left [&::-webkit-details-marker]:hidden">
            <h3 className="font-display text-lg font-semibold text-neutral-ink transition-colors duration-200 group-hover:text-brand sm:text-xl">
              {faq.question}
            </h3>
            <span
              aria-hidden="true"
              className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-pill border border-neutral-line text-brand transition-[background-color,border-color,color,transform] duration-300 ease-entrance group-hover:border-brand/50 group-open:rotate-180 group-open:bg-brand group-open:text-white"
            >
              <svg viewBox="0 0 14 14" fill="none" className="h-3.5 w-3.5">
                {/* The horizontal stroke stays; the vertical one scales away, so
                    the plus becomes a minus as the whole badge rotates. */}
                <path
                  d="M2.5 7h9"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M7 2.5v9"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  className="origin-center transition-transform duration-300 ease-entrance group-open:scale-y-0"
                />
              </svg>
            </span>
          </summary>

          <div className="accordion-panel">
            <div>
              <p className="pb-6 pr-12 text-[0.9375rem] leading-relaxed text-pretty text-neutral-body">
                {faq.answer}
              </p>
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}
