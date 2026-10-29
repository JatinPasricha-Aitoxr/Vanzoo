import { NextResponse } from 'next/server';
import { z } from 'zod';
import { audit, requireSession } from '@/lib/auth';
import { exec, parseJson, query } from '@/lib/db';
import type { Block } from '@/cms/schema';
import { validateBlocks } from '@/cms/widgetDefs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Row = { id: number; kind: 'section' | 'page'; name: string; doc: unknown; created_at: string };

export async function GET() {
  const a = await requireSession();
  if ('error' in a) return a.error;
  const rows = await query<Row>('SELECT id, kind, name, doc, created_at FROM cms_saved ORDER BY kind, name');
  return NextResponse.json({ items: rows.map((r) => ({ id: r.id, kind: r.kind, name: r.name, doc: parseJson(r.doc, { version: 1, blocks: [] }) })) });
}

const Body = z.object({ kind: z.enum(['section', 'page']), name: z.string().trim().min(1, 'Give it a name.').max(120), blocks: z.array(z.unknown()).min(1).max(200) });

export async function POST(req: Request) {
  const a = await requireSession();
  if ('error' in a) return a.error;
  const b = Body.safeParse(await req.json().catch(() => null));
  if (!b.success) return NextResponse.json({ error: b.error.issues[0]?.message ?? 'Invalid request.' }, { status: 400 });
  let blocks: Block[];
  try {
    blocks = validateBlocks(b.data.blocks as Block[]);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Invalid content.' }, { status: 400 });
  }
  const doc = JSON.stringify({ version: 1, blocks });
  if (doc.length > 400_000) return NextResponse.json({ error: 'That is too large to save as a template.' }, { status: 400 });
  await exec('INSERT INTO cms_saved (kind, name, doc, created_by) VALUES (?, ?, ?, ?)', [b.data.kind, b.data.name, doc, a.session.u]);
  await audit(a.session.u, 'saved_create', b.data.name, { kind: b.data.kind });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const a = await requireSession();
  if ('error' in a) return a.error;
  const b = z.object({ id: z.number().int() }).safeParse(await req.json().catch(() => null));
  if (!b.success) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  await exec('DELETE FROM cms_saved WHERE id = ?', [b.data.id]);
  await audit(a.session.u, 'saved_delete', String(b.data.id));
  return NextResponse.json({ ok: true });
}
