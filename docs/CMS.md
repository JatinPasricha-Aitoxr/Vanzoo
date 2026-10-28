# Vanzoo CMS — architecture, operation and deployment

A self-hosted, WordPress-style admin with an Elementor-style visual page builder, built **inside this Next.js project** so the editor renders the real site components.

## What exists today (Phase 1–2 vertical slice)

| Area | Status |
|---|---|
| Login, signed sessions, rate limit, CSRF origin check, admin-host restriction | ✅ built & tested |
| MySQL schema + migrations + first-admin seed | ✅ |
| Admin shell (collapsible sidebar), Dashboard, Pages, Media library, Site settings (Delhi switch), System health | ✅ |
| Visual editor: widget library, drag-and-drop (canvas + navigator), inspector (content / style / advanced), desktop-tablet-mobile overrides, undo/redo, copy/paste/duplicate/delete/hide, keyboard shortcuts | ✅ |
| Draft → preview (protected) → publish → unpublish → restore revision | ✅ |
| Home page and any new page editable; published pages render server-side with SEO metadata | ✅ |
| Page SEO: title, description, canonical, noindex/nofollow, Open Graph, search preview, heading outline, checklist | ✅ |
| Sitemap includes published CMS pages; robots disallows `/admin`, `/preview`; admin & preview send `X-Robots-Tag: noindex` | ✅ |
| Other built-in pages (About, Pricing, Services…) | ⏳ still code; convert one at a time |
| Global header/footer templates, design tokens panel, reusable saved sections | ⏳ Phase 3 |
| Blog/service/pricing/location/FAQ/testimonial content managers, menus | ⏳ Phase 4 |
| Redirect manager, structured-data editor, broken-link crawler, Search Console hook | ⏳ Phase 5 |

## Architecture

- **Same app.** Admin lives at `/admin/*`; `middleware.ts` serves it on `admin.vanzoo.in` (set `ADMIN_HOST`) and returns 404 for it on the public domain.
- **Data.** MySQL (`db/migrations/*.sql`): `users`, `pages`, `page_revisions`, `media`, `settings`, `audit_log`.
- **Page model.** `{version:1, blocks:[{id,type,props,style,responsive:{tablet,mobile},hidden,className,ariaLabel,children}]}` validated with zod on every save and again on publish (`src/cms/schema.ts`, `widgetDefs.ts`). Desktop styles are the base; tablet (≤1023px) and mobile (≤639px) are overrides only.
- **Rendering.** `src/cms/render.tsx` renders blocks through approved components (`widgetComponents.tsx`). Per-block CSS is generated from a whitelist (`css.ts`) and scoped to `.b-<id>`. Public pages are server-rendered/ISR and fall back to the built-in layout if the database is down or nothing is published.
- **Editor.** `components/admin/editor/*`. The canvas is an iframe (`/admin/canvas`) that renders the same components, so tablet/mobile previews use real media queries. It talks to the shell by `postMessage`. Editor code is not in the public bundle (shared public JS stayed 87.2 kB).
- **Media.** Uploaded to `UPLOAD_DIR` (outside the app folder in production), served by `/uploads/*`; only JPG/PNG/WebP/GIF/AVIF, magic-byte checked, 8 MB max, SVG refused.

## Security notes

- Passwords hashed with bcrypt (cost 12); session = HMAC-signed httpOnly, SameSite=Strict, Secure (production) cookie, 8 h.
- Every `/api/cms/*` call checks the session in middleware **and** in the handler; state-changing calls must be same-origin.
- Text widgets render plain text (React-escaped). Links must be `/…`, `#`, `http(s):`, `tel:`, `mailto:`. Style values are whitelisted per property; `url()` only for `/uploads` and `/images`; `{ } ; < >`, `expression`, `javascript` are rejected. Custom HTML/JS embeds are intentionally **not** offered yet.
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

Back up the MySQL database (hPanel backups or `mysqldump`) and the `UPLOAD_DIR` folder together.

## Tests run for this slice (local, Chrome via Playwright + curl)

- 24 + 19 browser checks: login errors, canvas renders real page, click-to-select, live inspector edits, desktop/mobile style rules, undo/redo, add/duplicate/delete, nesting into containers, drag from library, drag to reorder on canvas, navigator reorder, copy/paste, tablet/mobile widths, SEO fields, save, preview (protected), publish, public page shows edit + SEO title, revision restore.
- Security: unauthenticated API/preview/upload blocked, cross-origin writes blocked, script text escaped, `javascript:` link dropped, CSS injection stripped, fake/SVG/oversize uploads refused, path traversal 404, forged session 401, `ADMIN_HOST` hides admin on public host.
- Production build: all 202 sitemap URLs still 200; default homepage pixel-identical below the hero (hero differs only by the background-video frame).
