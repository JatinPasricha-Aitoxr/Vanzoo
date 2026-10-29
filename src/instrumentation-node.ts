import { loadLiveFacts } from '@/cms/facts';
import { dbConfigured } from '@/lib/db';
import { internalToken } from '@/lib/session';

/** Node-only half of instrumentation (kept separate so the Edge bundle never sees the MySQL driver). */
export async function registerNode() {
  try {
    await loadLiveFacts();
  } catch {
    /* database unavailable — the site falls back to the built-in facts */
  }
  // Pages prerendered at build time may predate the live database, so once the
  // server is listening ask it to treat them all as stale; they regenerate on demand.
  if (process.env.NODE_ENV === 'production' && dbConfigured()) {
    setTimeout(async () => {
      try {
        const port = process.env.PORT || '3000';
        await fetch(`http://127.0.0.1:${port}/api/internal/revalidate/`, { method: 'POST', headers: { 'x-vz-internal': await internalToken() }, cache: 'no-store' });
      } catch {
        /* best effort */
      }
    }, 4000);
  }
}
