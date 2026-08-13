# Vanzoo

Rebuild of [vanzoo.in](https://vanzoo.in) — luxury fabric care and eco-friendly dry cleaning, Gurgaon.

Next.js 14 (App Router) · TypeScript · Tailwind CSS. Every marketing page and all
73 blog articles are statically generated; only `/api/enquiry` runs at request time.

```bash
npm install
cp .env.example .env.local     # optional in development
npm run dev                    # http://localhost:3000
npm run build && npm start     # production
npm run typecheck && npm run lint
```

---

## Layout

```
src/
  app/                    one directory per route, plus sitemap.ts / robots.ts
    api/enquiry/route.ts  enquiry endpoint (the only dynamic route)
  components/             shared UI
  content/                all copy and data — see below
  lib/
    site.ts               brand facts: phone, email, stores, areas, nav, footer, outbound links
    seo.ts                metadata builder + JSON-LD builders
    cart.tsx              tariff cart state (context + localStorage)
scripts/                  one-off migration scripts (not part of the build)
public/images/            optimised imagery; blog/ holds the migrated article images
```

Copy lives in `src/content/`, never inline in a component:

| File | Holds |
| --- | --- |
| `marketing.ts` | Hero, services, personas, FAQs, About, Hydrocarbon Tech, app promo |
| `pricing.ts` | Both tariff catalogues |
| `reviews.ts` | Homepage customer reviews — **currently placeholders, see below** |
| `blog.ts` + `posts.json` | The 73 migrated articles |
| `policies.ts` + `policies.json` | Privacy, Terms, Delivery & Refund |

Almost all of it is the live site's own wording, carried over verbatim. The two
exceptions are marked `AUTHORED` in `marketing.ts`: the homepage hero headline
and the guarantee statement, both of which the redesign brief explicitly rewrote.

---

## Adding a blog post

Add an object to the top of `src/content/posts.json` (the array is newest-first):

```jsonc
{
  "slug": "how-to-store-a-silk-saree",        // becomes /blogs/how-to-store-a-silk-saree/
  "title": "How to Store a Silk Saree Between Wears",
  "excerpt": "One or two sentences — used on cards and as the meta description.",
  "publishedAt": "2026-08-14T10:00:00",       // never change this after publishing
  "updatedAt": "2026-08-14T10:00:00",         // bump on every substantive edit
  "categories": ["Fabric Care"],              // first one is the visible label
  "tags": [],
  "image": "/images/blog/silk-saree-storage.jpg",
  "imageAlt": "Folded silk saree wrapped in muslin for long-term storage",
  "readingMinutes": 6,
  "body": "<p>…</p>"
}
```

Notes:

- `body` is HTML, restricted to the tags in `ALLOWED` (`scripts/import-blog.py`)
  and styled by `.prose-vanzoo`. It is injected with `dangerouslySetInnerHTML`,
  so treat it as trusted authored content — never paste in markup from an
  untrusted source.
- `publishedAt` feeds `datePublished` in the BlogPosting schema and the sitemap's
  `lastmod`. Re-stamping it tells Google an old article is new.
- Put the image in `public/images/blog/` at 1600px wide or less.
- A new value in `categories[0]` automatically creates `/blogs/category/<slug>/`,
  adds it to the sitemap and to the filter row. No other change needed.

The build fails on an unknown slug rather than rendering a placeholder, so a typo
in a link surfaces at build time.

**Re-running the migration.** `scripts/import-blog.py` and
`scripts/import-policies.py` regenerate `posts.json` / `policies.json` from the
old WordPress install. They exist for reference and for a re-migration; the
normal editing path is the JSON above.

---

## Updating pricing

Both catalogues live in `src/content/pricing.ts` as `coutureCatalog` and
`steamIronCatalog`. Each is a list of groups:

```ts
{
  id: 'footwear',              // anchor target; keep stable, it may be linked
  label: 'Footwear',           // section heading and filter chip
  rows: [
    { item: 'Leather Shoes', amount: 799, image: img('leather-shoes') },
    { item: 'Leather Handbag', amount: 699, from: true, image: img('leather-handbag') },
  ],
}
```

Every row carries an `image` — the product photo shown on its card and as the
cart-line thumbnail. The files in `public/images/tariffs/` are the live site's
own tariff-card photos, downloaded and renamed to the product they depict
(several source uploads had misleading filenames — the pairing was taken from
what each card actually renders, and every file has been visually verified
against its product). Adding a new row means adding its photo there first.

`amount` is a number so the cart can total it; `from` records whether Vanzoo
publishes the figure as fixed or as a starting price. That distinction is
load-bearing — if any line in the cart is a from-price, the drawer labels the
total "Estimated total" and prefixes it "from", rather than quoting a firm price
Vanzoo doesn't offer. `formatPrice()` in the same file renders the display
string, so the tables and the cart can never drift apart.

Add or remove groups freely; the sticky category chips, the scroll-spy
highlighting and the anchors all derive from the data. The GST note and the
intro line are `tariffNote` and `tariffIntro`, shared by both pages.

---

## The tariff cart

Each tariff card has an **Add to Cart** button. The cart is a quotation basket,
not a checkout — nothing is charged on this site and no order is created.

- State lives in `src/lib/cart.tsx` (`CartProvider` / `useCart`), persisted to
  `localStorage` under `vanzoo.cart.v1` so a cart survives the hop between the
  two tariff pages and a reload. Stored lines are re-validated on read, so a
  corrupt or stale entry is dropped rather than crashing the page.
- Line IDs are `catalogId:groupId:item-slug` (`lineId()` in `pricing.ts`). The
  namespace matters: a couture "Pant/Trouser" (₹199) and a steam-iron
  "Pant/Trouser" (₹99) are different products and must not merge.
- `CartDrawer` is two panes — the list, then the contact details — because a
  long list plus a six-field form does not fit a phone-height panel.
- **Submission reuses `/api/enquiry`.** The itemised list is rendered into the
  enquiry's `message` field, so the team receives it in the same inbox as every
  other enquiry with no extra plumbing. Wire `ENQUIRY_WEBHOOK_URL` (see
  "Enquiry form") and the cart is delivered too.

To take real payments you would add a new endpoint and an order record; none of
that exists today, and the drawer says so ("No payment is taken here").

---

## Reviews

`src/content/reviews.ts` currently holds **placeholders, not real reviews.**
Vanzoo publishes no testimonials anywhere, so nothing was invented — each entry
describes what belongs in the field instead of pretending to be praise, and the
homepage section carries a visible "Sample content" banner while
`PUBLISHED` is `false`.

To go live: replace each entry with the customer's own words verbatim, then set
`PUBLISHED = true` to drop the banner. Only once real ratings are rendered on
the page does `aggregateRating` become eligible for the LocalBusiness JSON-LD in
`src/lib/seo.ts` — Google requires the rating to reflect reviews genuinely shown,
so add it then and not before.

---

## Service areas

Vanzoo serves **Gurgaon only**. Both stores are there, and no copy on the site
claims wider Delhi-NCR coverage.

`areaGroups` in `src/lib/site.ts` drives `/areas-we-serve/`, the locality chips
on `/locate-us/`, the pickup widget's "Where" select and the enquiry form's area
field. It is locality names grouped by corridor, with no per-locality pincodes —
Vanzoo publishes no pincode-level coverage list, so `PincodeChecker` matches on
the Gurgaon `122` prefix rather than asserting an answer it cannot back. Add
exact pincodes here once operations confirm them, and replace the prefix match
with a real serviceability lookup at the same time.

---

## Theming

All colour lives in `tailwind.config.ts` under `theme.extend.colors`. Change a
value there and it propagates everywhere.

The green and gold are the live vanzoo.in brand colours, read out of that site's
Elementor global palette — not approximations.

```
brand.DEFAULT   #004A40   primary green — buttons, links, prices, section chips
brand.hover     #00695A   button hover (lifts *lighter*, see below)
brand.dark      #00332C   the lighter half of the dark-band gradient
brand.ink       #001A16   footer base, hero scrim, dark bands, cart badge text
brand.light     #E6F0EC   tinted section backgrounds, page headers
accent.gold     #FFB107   decorative only — icons, stars, rules, hero CTA fill
accent.gold-ink #7A5200   gold *text* on light surfaces
accent.gold-soft #F5E0B0  gold *text* on dark surfaces
neutral.ink/body/line/surface/muted, success
```

Three things to keep in mind when changing these:

1. **The three golds are not interchangeable.** `accent.gold` is 1.8:1 on white
   — it fails WCAG AA as text. It is only ever used for shapes (star glyphs,
   icon fills, hairlines) and as a *fill* behind `brand.ink` text on the hero
   CTA, where it measures 9.9:1. Gold text uses `gold-ink` on light backgrounds
   (6.9:1) or `gold-soft` on dark (13.4:1). The contrast figures for every token
   are recorded in the config's header comment; re-check them if you change a
   value, since the site currently scores 100 on Lighthouse accessibility and
   contrast is the easiest way to lose that.

2. **`brand.hover` is lighter than `brand.DEFAULT`, deliberately.** At #004A40
   the base green is already near-black; darkening it on hover reads as a
   disabled state rather than a press. If you lighten the base, revisit this.

3. **One brand colour lives outside Tailwind** and needs updating alongside it:
   `themeColor` in `src/app/layout.tsx` (the mobile browser chrome).

Type scale, spacing rhythm and radii are in the same config. Component-level
primitives (`.btn-primary`, `.btn-gold`, `.band-dark`, `.eyebrow`, `.field`,
`.prose-vanzoo`, `.shell`) are in `src/app/globals.css`; motion lives in
`src/app/motion.css` — see below.

`.band-dark` is worth knowing about: every dark surface (footer, guarantee band,
CTA banners, trust strip) uses it rather than a flat fill, because #001A16 as a
solid rectangle reads as a hole in the page. It paints a radial `brand.dark →
brand.ink` gradient plus a fading gold hairline along the top edge.

Two signature moments carried over from the old site: `.wordmark-giant` sets the
full-width gold VANZOO sign-off at the bottom of the footer (text, not an image
— it scales losslessly and is aria-hidden), and `WeCareBanner` is the "Not just
clothes" editorial band on the homepage. The hero's FIRST25 chip comes from
`heroOffer` in `content/marketing.ts` — delete that object when the promotion
ends and the chip (and its echo beside the enquiry form) disappears.

Fonts are Fraunces (display) and Inter (body), self-hosted by `next/font` — no
request to Google's CDN. Swap them in `src/app/layout.tsx`; the CSS variables
`--font-display` / `--font-sans` are what Tailwind reads.

---

## Motion

Everything lives in [`src/app/motion.css`](src/app/motion.css) plus two small
modules: `src/lib/motion.ts` (a shared IntersectionObserver) and
`src/components/ui/Reveal.tsx` (`<Reveal>` / `<RevealGroup>`). There is no
animation library — the whole system is CSS, and the client bundle is unchanged
from before it existed.

**Four rules the file sticks to.** Break them and the frame budget goes with it:

1. **Only `opacity`, `transform` and `filter` are animated.** All three are
   composited, so nothing triggers layout or paint. The one exception is the FAQ
   accordion, which animates `grid-template-rows` because there is no
   compositor-friendly way to transition to auto height — it is confined to one
   small subtree.
2. **No permanent `will-change`.** It forces a layer for the life of the page;
   the blog index has 70+ cards, and pinning a layer to each would cost real
   memory. It is applied inside `:hover` only.
3. **No scroll event listeners drive animation.** Parallax and the article
   reading bar use `animation-timeline: view()` / `scroll()`, which run off the
   main thread. They sit behind `@supports`, so browsers without scroll
   timelines get the static layout rather than a JS fallback. The header's
   show/hide is the only scroll listener on the site; it is passive and
   coalesced into one `requestAnimationFrame`.
4. **Everything collapses under `prefers-reduced-motion: reduce`** — to the
   finished state, not a faster animation. The block at the end of motion.css
   covers every effect; add to it whenever you add an effect.

**Using reveals.** `<Reveal variant="up|fade|scale|left|right|blur" delay={ms}>`
for a single element, `<RevealGroup step={ms}>` for a list whose children should
stagger. Prefer `RevealGroup` for grids: it observes one element instead of N,
and the per-child delay is applied in CSS.

Both render visible in the server HTML and only hide themselves once the effect
confirms observer support, so content is never trapped behind JS that failed to
load. Anything already inside the first viewport at mount stays put rather than
animating — playing an entrance on something the reader is already looking at
reads as a flash, and on the hero it would delay the LCP paint.

**Tuning.** Durations and easings are custom properties on `:root`
(`--dur-fast|mid|slow`, `--ease-entrance|exit|standard|spring`). Changing
`--dur-mid` also changes the dialog's exit; `EnquiryDialog` waits that long
before unmounting the form, so keep the constant there in sync.

Measured with a scripted full-page scroll of the homepage: median frame 8.3ms,
95th percentile 9.2ms, zero frames over 33ms across 358 samples. Lighthouse is
unchanged from before the motion work.

---

## Enquiry form

`EnquiryForm` posts JSON to `/api/enquiry/`, which validates, drops honeypot
submissions, and forwards to `ENQUIRY_WEBHOOK_URL`. `CartDrawer` posts to the
same route (see "The tariff cart"), so one webhook covers both.

**Before launch, set `ENQUIRY_WEBHOOK_URL`** to a mail provider or CRM endpoint.
Without it the route validates the submission, logs it server-side and returns
success — fine for testing, but enquiries and cart requests go nowhere.

Note the trailing slash on the fetch URL: `next.config.mjs` sets
`trailingSlash: true`, so posting to `/api/enquiry` costs a 308 round trip first.

The same fields as the live site's form are used; they are defined in
`serviceTypes` / `contactTimes` in `src/content/marketing.ts`.

---

## SEO

- `buildMetadata()` in `src/lib/seo.ts` is the only place page metadata is
  produced — title, description, canonical, OG and Twitter tags. Every route
  calls it, which is what keeps titles and descriptions unique as pages are added.
- JSON-LD: `Organization` + `WebSite` in the root layout; `DryCleaningOrLaundry`
  on Home, Contact and Locate Us; `FAQPage` on Home and Hydrocarbon Tech;
  `BlogPosting` per article; `BreadcrumbList` on every inner page.
- `sitemap.ts` covers all 90 indexable URLs with real `lastmod` values from post
  timestamps. `robots.ts` allows everything except `/api/` and `/app/`.
- **Legacy URLs.** WordPress served articles at the site root (`/some-slug/`);
  the rebuild namespaces them under `/blogs/` per the agreed page inventory.
  `next.config.mjs` generates a permanent redirect for each of the 73 slugs, plus
  one for `/category/:slug`. If you rename a slug, add its old path there too.

**No `aggregateRating` is emitted anywhere, deliberately.** Google requires it to
reflect reviews actually shown on the page, and Vanzoo publishes no verified
rating or review count. The homepage trust strip states capabilities rather than
press mentions for the same reason. If a real rating becomes available, add it to
`localBusinessSchema()` and to `trustMarkers` in `marketing.ts` together.

### Measured

Lighthouse against the production build (desktop preset):

| | Performance | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- |
| Home | 100 | 100 | 100 | 100 |
| Blog index | 99 | 100 | 100 | 100 |
| Couture Care Tariffs | 100 | 100 | 100 | 100 |
| Article | 99 | 100 | 100 | 100 |

Home on the mobile preset (throttled): 91 / 100 / 100 / 100. CLS is 0 on every
page — every media block reserves its aspect ratio before the image loads.

---

## Known gaps

- **Opening hours** are not published anywhere on vanzoo.in, so they are omitted
  from the footer and from `openingHoursSpecification` rather than guessed. Add
  them to `site.ts` and `localBusinessSchema()` when confirmed.
- **Customer reviews** on the homepage are placeholders, and the section says so
  on the page until `PUBLISHED` is flipped in `content/reviews.ts`. See
  "Reviews" above — this is the one thing that must not ship as-is.
- **The pincode checker** matches the Gurgaon `122` prefix rather than a real
  serviceability list, and says so in its copy for anything outside it. Swap in
  a real lookup when one exists.
- **Area coverage** in `areaGroups` is corridor-level locality names, not a
  confirmed pincode-by-pincode list; `/areas-we-serve/` tells visitors coverage
  is confirmed at booking. Tighten once operations confirm the exact list.
- **The tariff cart takes no payment.** It sends an itemised pickup request
  through the enquiry route; there is no order record and no checkout.
- **Policy pages** show the migration date as "last updated" — the source pages
  carry no effective date. Set `POLICY_LAST_UPDATED` in `content/policies.ts`
  when legal confirms one.
- **iOS app** is shown as "coming soon"; only the Play Store listing exists.
