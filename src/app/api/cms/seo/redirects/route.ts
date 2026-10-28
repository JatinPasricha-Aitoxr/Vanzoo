import { NextResponse } from 'next/server';
import { z } from 'zod';
import { audit, requireSession } from '@/lib/auth';
import { exec } from '@/lib/db';
import { listNotFound, listRedirects, validateRedirect } from '@/cms/seoStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const a = await requireSession();
  if ('error' in a) return a.error;
  return NextResponse.json({ redirects: await listRedirects(), notFound: await listNotFound() });
}

const Body = z.object({
  source: z.string().min(1).max(400),
  destination: z.string().min(1).max(600),
  status_code: z.union([z.literal(301), z.literal(302)]).default(301),
  enabled: z.boolean().default(true),
  note: z.string().max(255).optional(),
  id: z.number().int().optional(),
});

export async function POST(req: Request) {
  const a = await requireSession();
  if ('error' in a) return a.error;
  const b = Body.safeParse(await req.json().catch(() => null));
  if (!b.success) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  const d = b.data;
  const err = d.enabled ? await validateRedirect(d.source, d.destination, d.status_code, d.id) : null;
  if (err) return NextResponse.json({ error: err }, { status: 400 });
  if (d.id) {
    await exec('UPDATE redirects SET source=?, destination=?, status_code=?, enabled=?, note=? WHERE id=?', [d.source.trim(), d.destination.trim(), d.status_code, d.enabled ? 1 : 0, d.note ?? null, d.id]);
  } else {
    await exec('INSERT INTO redirects (source, destination, status_code, enabled, note) VALUES (?, ?, ?, ?, ?)', [d.source.trim(), d.destination.trim(), d.status_code, d.enabled ? 1 : 0, d.note ?? null]);
    await exec('DELETE FROM not_found_log WHERE path = ? OR path = ?', [d.source.trim(), d.source.trim().replace(/\/$/, '') + '/']);
  }
  await audit(a.session.u, d.id ? 'redirect_update' : 'redirect_create', d.source, { to: d.destination, code: d.status_code });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const a = await requireSession();
  if ('error' in a) return a.error;
  const { id, clearNotFound } = (await req.json().catch(() => ({}))) as { id?: number; clearNotFound?: string };
  if (id) await exec('DELETE FROM redirects WHERE id = ?', [id]);
  if (clearNotFound) await exec('DELETE FROM not_found_log WHERE path = ?', [clearNotFound]);
  await audit(a.session.u, 'redirect_delete', String(id ?? clearNotFound));
  return NextResponse.json({ ok: true });
}
