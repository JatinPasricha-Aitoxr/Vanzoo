# Vanzoo CMS — architecture, operation and deployment

A self-hosted, WordPress-style admin with an Elementor-style visual page builder, built **inside this Next.js project** so the editor renders the real site components.

## What exists today

| Area | Status |
|---|---|
| Login, signed sessions, rate limit, CSRF origin check, admin-host restriction | ✅ built & tested |
| **Users & roles** — administrators and editors; add/remove users, reset passwords, last-admin protection; role checked against the DB on every admin-only call | ✅ |
| MySQL schema + migrations (`001`–`004`) + first-admin seed | ✅ |
| Admin shell, Dashboard, Pages, Media library, Site settings (Delhi switch), System health | ✅ |
| Visual editor: widget library, drag-and-drop, inspector (content / style / advanced), desktop-tablet-mobile overrides, undo/redo, copy/paste/duplicate/delete/hide, shortcuts | ✅ |
| **Widgets:** the original Vanzoo sections plus Marketing widgets — FAQ (with FAQPage schema from the visible answers), customer quotes, call to action, feature grid, price list, rich text (sanitised), YouTube (nocookie, id-validated), contact details (from verified site facts). Repeating items are edited with a list field | ✅ |
| **Saved sections & page templates** — save a section or a whole page from the editor, insert a copy anywhere (copies, not live links) | ✅ |
| Draft → preview (protected) → publish → unpublish → restore revision | ✅ |
| Home page and any new page editable; published pages render server-side with SEO metadata | ✅ |
| **Blog manager** — new posts, edit or hide any of the 73 migrated posts (an edit is a copy that overrides the built-in; revert anytime), visual editor with a whitelist sanitiser, featured image + alt, categories, tags, draft/publish | ✅ |
| **SEO platform** — per-URL overrides for every public page (title, description, canonical, noindex/nofollow, social); site-wide robots.txt extras, “block whole site” switch, sitemap include/exclude/extra; redirect manager (301/302, loop/duplicate checks, hit counts) applied in middleware; 404 log with “create redirect”; site audit that crawls every page (titles, descriptions, H1, canonicals, alt text, structured data, broken internal links, duplicates); read-only structured-data view | ✅ |
| **Design tokens** — 15 site colours stored as CSS variables (Tailwind reads them), live preview and WCAG contrast checks, reset to defaults | ✅ |
| **Header, footer & social menus** — reorder/rename/add/remove links; falls back to the built-in menus | ✅ |
| **Backup export** (JSON, no password hashes) and **integrations panel** (GA4, GTM, Search Console tag, email — shows only what is really configured) | ✅ |
| Other built-in pages (About, Pricing, Services, Products, Areas…) | ⏳ still code. They are fully SEO-manageable and redirectable, but their body content is edited in the repo. Converting a page means rebuilding it from widgets — do it one at a time |
| Templates for dynamic detail pages (service / product / area / blog layout), announcement bar, logo & favicon, font and breakpoint settings, service/pricing/location content managers | ⏳ not built. Fonts and breakpoints are fixed in code (tablet ≤1023px, mobile ≤639px) |
| Live Search Console / impressions / Core Web Vitals | ❌ deliberately not shown — no integration is connected, and the CMS never fabricates these numbers |

## Roles

| | Administrator | Editor |
|---|---|---|
| Pages, media, blog posts, saved sections, per-URL SEO overrides, run audit | ✅ | ✅ |
| Site settings, design tokens, menus, global SEO, redirects, users, backup | ✅ | ❌ (403, and hidden in the sidebar) |

Create editors in **Users & roles**. Change the default `admin`/`admin` password before going live — **System & health** flags it until you do.

## Architecture

- **Same app.** Admin lives at `/admin/*`; `middleware.ts` serves it on `admin.vanzoo.in` (set `ADMIN_HOST`) and returns 404 for it on the public domain.
- **Data.** MySQL (`db/migrations/*.sql`): `users`, `pages`, `page_revisions`, `media`, `settings`, `audit_log` (001); `redirects`, `not_found_log`, `seo_overrides` (002); `cms_posts` (003); `cms_saved` (004). Settings keys in `settings`: `site`, `seo`, `design`, `siteconfig`, `audit`.
- **Page model.** `{version:1, blocks:[{id,type,props,style,responsive:{tablet,mobile},hidden,className,ariaLabel,children}]}` validated with zod on every save and again on publish (`src/cms/schema.ts`, `widgetDefs.ts`). Desktop styles are the base; tablet (≤1023px) and mobile (≤639px) are overrides only.
- **Rendering.** `src/cms/render.tsx` renders blocks through approved components (`widgetComponents.tsx`). Per-block CSS is generated from a whitelist (`css.ts`) and scoped to `.b-<id>`. Public pages are server-rendered/ISR and fall back to the built-in layout if the database is down or nothing is published.
- **Editor.** `components/admin/editor/*`. The canvas is an iframe (`/admin/canvas`) that renders the same components, so tablet/mobile previews use real media queries. It talks to the shell by `postMessage`. Editor code is not in the public bundle (shared public JS stayed 87.2 kB).
- **Media.** Uploaded to `UPLOAD_DIR` (outside the app folder in production), served by `/uploads/*`; only JPG/PNG/WebP/GIF/AVIF, magic-byte checked, 8 MB max, SVG refused.

## Security notes

- Passwords hashed with bcrypt (cost 12); session = HMAC-signed httpOnly, SameSite=Strict, Secure (production) cookie, 8 h.
- Every `/api/cms/*` call checks the session in middleware **and** in the handler; state-changing calls must be same-origin.
- Text widgets render plain text (React-escaped). Links must be `/…`, `#`, `http(s):`, `tel:`, `mailto:`. Style values are whitelisted per property; `url()` only for `/uploads` and `/images`; `{ } ; < >`, `expression`, `javascript` are rejected. Rich text and blog HTML pass a whitelist sanitiser (`src/cms/sanitize.ts`): scripts, styles, iframes, forms, event handlers and unsafe URLs are removed. The only embed is YouTube, accepted by strict URL pattern. Arbitrary HTML/JS embeds are intentionally **not** offered.
- Redirect destinations are validated (internal path or http(s) URL, no loops/duplicates, reserved paths protected). The middleware fetches the redirect list through a token-protected internal endpoint and caches it for 30 s.
- Preview needs a signed-in session and is `noindex`.

## Run locally

```bash
docker run -d --name vanzoo-mysql -e MYSQL_ROOT_PASSWORD=vanzoo_dev -e MYSQL_DATABASE=vanzoo_cms -p 3307:3306 mysql:8.0
cp .env.example .env.local   # then set MYSQL_*, SESSION_SECRET (see below)
npm install
npm run db:migrate           # creates tables and the first admin (dev default admin/admin)
npm run dev -- -p 3200       # http://localhost:3200/admin/
```

## Environment variables

| Variable | Purpose |
|---|---|
| `MYSQL_URL` **or** `MYSQL_HOST/PORT/USER/PASSWORD/DATABASE` | database |
| `SESSION_SECRET` | ≥ 24 random characters; **required in production** |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD` | first admin, read only by `npm run db:migrate` when no user exists. In production there is no `admin/admin` default |
| `ADMIN_HOST` | e.g. `admin.vanzoo.in` — admin only reachable there |
| `UPLOAD_DIR` | absolute folder for uploads, **outside** the deployed app |
| `RESEND_API_KEY`, `ENQUIRY_TO_EMAIL` | enquiry emails |
| `NEXT_PUBLIC_SITE_URL` | `https://vanzoo.in` |

## Deploy to Hostinger (Node.js app + MySQL) — do not run until approved

1. **Back up first:** hPanel → Backups (files + database) and keep the old WordPress export.
2. hPanel → Databases → **MySQL**: create a database and user; note host, name, user, password.
3. Create the Node.js app from the GitHub repo (branch to deploy), Node 20/22, build `npm run build`, start `npm start`.
4. Add the environment variables above. Set `UPLOAD_DIR` to a folder outside the app, e.g. `/home/<user>/vanzoo-uploads`.
5. In the app's terminal run `npm run db:migrate` (with `ADMIN_USERNAME`/`ADMIN_PASSWORD` set) once. Safe to re-run.
6. Add `admin.vanzoo.in` as a domain/subdomain pointing to the same app (DNS: an A/CNAME record from hPanel DNS). Keep MX/SPF/DKIM records untouched.
7. Open `https://admin.vanzoo.in`, sign in, open **System & health** — every line should say OK.
8. Verify: homepage loads, `/sitemap.xml`, `/robots.txt`, create a draft page, preview it, publish it, check the public URL and its source for the title/description, then unpublish it.

**Rollback:** unpublish a page (home falls back to the built-in layout), or restore an earlier revision in the editor's "Page & SEO" tab. Whole-site rollback: redeploy the previous Git commit and restore the database backup.

## Backups

Back up the MySQL database (hPanel backups or `mysqldump`) and the `UPLOAD_DIR` folder together. **System & health → Download database backup** exports pages, published/draft revisions, media records, settings, redirects, overrides and users (without password hashes) as JSON — a safety copy and an audit aid, not a one-click restore.

## Tests run for this slice (local, Chrome via Playwright + curl)

- 24 + 19 browser checks: login errors, canvas renders real page, click-to-select, live inspector edits, desktop/mobile style rules, undo/redo, add/duplicate/delete, nesting into containers, drag from library, drag to reorder on canvas, navigator reorder, copy/paste, tablet/mobile widths, SEO fields, save, preview (protected), publish, public page shows edit + SEO title, revision restore.
- Security: unauthenticated API/preview/upload blocked, cross-origin writes blocked, script text escaped, `javascript:` link dropped, CSS injection stripped, fake/SVG/oversize uploads refused, path traversal 404, forged session 401, `ADMIN_HOST` hides admin on public host.
- Production build: all 202 sitemap URLs still 200; default homepage pixel-identical below the hero (hero differs only by the background-video frame).
- Phase 3–4 additions (this branch): SEO API + admin UI (override applied to `<title>`/robots, redirect 308 through middleware, loop rejected, robots/sitemap settings, 202-page audit with 0 broken links), roles (editor 403 on admin endpoints, redirected from admin pages), user safeguards (can’t delete self or last admin), backup contains no password hashes, design-token override reaches computed styles and resets cleanly, menus change header/footer, blog sanitiser strips script/iframe/event handlers/`javascript:`, built-in post override → hide → revert, visual blog editor create → publish → public page → delete, every marketing widget renders and drops unsafe/empty input, list-field editing in the inspector, saved section + page template round trip.
- Production build after each phase: all 202 sitemap URLs 200; shared public JS unchanged at 87.2 kB.
- Not run: HawkScan/DAST (no `HAWK_API_KEY` in this environment), load testing, cross-browser beyond Chrome.
