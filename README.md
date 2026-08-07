# Vanzoo

Rebuild of [vanzoo.in](https://vanzoo.in) — luxury fabric care and eco-friendly dry cleaning, Gurgaon.

Next.js 14 (App Router) · TypeScript · Tailwind CSS. 113 statically generated
pages — the marketing site, the Members Club, 15 campaign landing pages and all
73 blog articles. Only `/api/enquiry` runs at request time.

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
    site.ts               brand facts: phone, email, stores, nav, footer, outbound links
    seo.ts                metadata builder + JSON-LD builders
scripts/                  one-off migration scripts (not part of the build)
public/images/            optimised imagery; blog/ holds the migrated article images
```

Copy lives in `src/content/`, never inline in a component:

| File | Holds |
| --- | --- |
| `marketing.ts` | Hero, services, personas, FAQs, About, Hydrocarbon Tech, app promo |
| `pricing.ts` | Both tariff tables |
| `membership.ts` | Members Club tiers, services and USPs |
| `campaigns.ts` | The 15 campaign landing pages + the `/menu` link hub |
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

Both tables live in `src/content/pricing.ts` as `coutureTariffs` and
`steamIronTariffs`. Each is a list of groups:

```ts
{
  id: 'footwear',              // anchor target; keep stable, it may be linked
  label: 'Footwear',           // table header and filter chip
  rows: [{ item: 'Leather Shoes', price: '₹799' }],
}
```

`price` is a display string, not a number, because roughly half the rows read
"Starting from ₹x" — collapsing that to a number would quote a fixed price
Vanzoo doesn't offer. Add or remove groups freely; the sticky category chips,
the scroll-spy highlighting and the anchors all derive from the data.

The GST note and the intro line are `tariffNote` and `tariffIntro` in the same
file, shared by both pages.

---

## Theming

All colour lives in `tailwind.config.ts` under `theme.extend.colors`. Change a
value there and it propagates everywhere.

```
brand.DEFAULT   #1E6177   primary teal — buttons, links, table headers
brand.dark      #154A5C   footer, teal bands, guarantee block
brand.light     #E8F1F3   tinted section backgrounds, page headers
accent.gold     #C9A24B   decorative only — icons, stars, rules
accent.gold-ink #8A6B1F   gold *text* on light surfaces
accent.gold-soft #EFE2C4  gold *text* on dark surfaces
neutral.ink/body/line/surface/muted, success
```

Two things to keep in mind when changing these:

1. **The three golds are not interchangeable.** `accent.gold` is 2.4:1 on white
   and 4.1:1 on `brand.dark` — it fails WCAG AA as text on both. It is only ever
   used for shapes (star glyphs, icon fills). Text uses `gold-ink` on light
   backgrounds (5.0:1) or `gold-soft` on dark (7.6:1). The contrast figures for
   every token are recorded in the config's header comment; re-check them if you
   change a value, since the site currently scores 100 on Lighthouse
   accessibility and contrast is the easiest way to lose that.

2. **Two brand colours live outside Tailwind** and need updating alongside it:
   `themeColor` in `src/app/layout.tsx` (the mobile browser chrome), and the
   `priceRange`/logo URLs in `src/lib/seo.ts`.

Type scale, spacing rhythm and radii are in the same config. Component-level
primitives (`.btn-primary`, `.field`, `.prose-vanzoo`, `.shell`) are in
`src/app/globals.css`; motion lives in `src/app/motion.css` — see below.

Fonts are Fraunces (display) and Inter (body), self-hosted by `next/font` — no
request to Google's CDN. Swap them in `src/app/layout.tsx`; the CSS variables
`--font-display` / `--font-sans` are what Tailwind reads.

---

## Page inventory

Beyond the core marketing pages, three things are worth knowing:

**Campaign landing pages** (`/we-use-0-chemicals/`, `/rated-4-9-5-by-our-customers/`
and 13 more) are fifteen ad destinations that share one body. They render from a
single route, `src/app/[campaign]/page.tsx`, driven by `campaigns.ts` — each
entry supplies a headline, subhead, description and hero image, and everything
below the hero is the same components the homepage uses.

That route is a dynamic segment at the **site root**, so `dynamicParams = false`
is load-bearing: without it the route would match every unmatched top-level path
and turn real 404s into rendered pages. Adding a campaign means adding an entry
to `campaigns.ts` **and** regenerating `campaign-slugs.json`, which
`next.config.mjs` reads to keep the legacy-blog redirect from swallowing the new
slug.

**`/members-club/`** carries the prepaid credit tiers. Note it claims "European
Hydrocarbon Technology" and "German Organic Chemicals Only" where the homepage
says "Italian hydrocarbon technology". Both are reproduced as published rather
than reconciled — if one is stale, that's a copy decision for Vanzoo.

**`/menu/`** is the link hub behind Vanzoo's social bio links, and deliberately
uses its own single-column layout rather than the standard page shell.

`/thank-you/` is `noIndex` — a confirmation page has no value in search, and
letting it rank means people land on a receipt for a form they never submitted.

---

## Heroes

Every route opens on one. Two components:

- `Hero` — full-bleed, for the homepage (`variant="full"`) and for pages that
  lead with a statement: Hydrocarbon Tech, Members Club, the campaigns
  (`variant="band"`).
- `PageHeader` — the photographic band every other inner page uses. Pass
  `image`/`imageAlt` and it renders white-on-photo with two scrims; omit them and
  it falls back to the tinted band. **The policy pages deliberately omit it** — a
  photograph over "Terms & Conditions" reads as marketing to someone looking for
  a contract.

Both take `breadcrumbs` (rendered above the headline) and stagger their content
in on load rather than on scroll, since a page header is always above the fold.

Routes that open on a photographic `Hero` also need to be in `HERO_ROUTES` in
`Header.tsx`, which is what makes the header start transparent over the image
instead of solid white.

---

## Icons

[`src/components/ui/Icon.tsx`](src/components/ui/Icon.tsx) is the single
registry. `<Icon name="mapPin" />` renders inline SVG; `<IconBadge name="phone" />`
wraps it in the tinted round badge used beside contact details and result
messages.

Icons are **inlined, not sprited or fetched** — they ship inside the HTML, so
there's no request, no flash of missing icon, and they inherit `currentColor`
and font size from context. Size them with `text-*` (`className="text-lg"`),
not `h-*/w-*`; the SVG is `1em` square.

Two things to know before adding one:

- **The registry is one object literal, so every entry ships whether or not it
  is used.** Unused glyphs are dead bundle weight, not free options — the set
  was trimmed from 48 to 33 for exactly this reason. Delete an icon when its
  last usage goes.
- **They must survive 16px.** The tariff category chips render at that size, and
  a glyph with fine interior detail turns into a smudge. One silhouette plus at
  most two interior strokes. The garment icons carry comments explaining what
  each earlier attempt was mistaken for.

Icons are decorative by default (`aria-hidden`), since in every current use the
adjacent text already says what they mean. Pass `title` only when an icon is
genuinely the sole label for a control.

The four raster icon sets under `public/images/icons/` are Vanzoo's own brand
artwork from the old site — those stay images, and are used in
`IconFeatureGrid`.

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

`EnquiryForm` posts JSON to `/api/enquiry`, which validates, drops honeypot
submissions, and forwards to `ENQUIRY_WEBHOOK_URL`.

**Before launch, set `ENQUIRY_WEBHOOK_URL`** to a mail provider or CRM endpoint.
Without it the route validates the submission, logs it server-side and returns
success — fine for testing, but enquiries go nowhere.

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
- **The pincode checker** on Locate Us matches NCR prefixes (`NCR_PREFIXES` in
  `PincodeChecker.tsx`) rather than a real serviceability list, and says so in its
  copy for anything outside them. Swap in a real lookup when one exists.
- **Policy pages** show the migration date as "last updated" — the source pages
  carry no effective date. Set `POLICY_LAST_UPDATED` in `content/policies.ts`
  when legal confirms one.
- **iOS app** is shown as "coming soon"; only the Play Store listing exists.
