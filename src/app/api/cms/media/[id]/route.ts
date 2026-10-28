import { unlink } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { audit, requireSession } from '@/lib/auth';
import { exec, query } from '@/lib/db';
import { uploadDir } from '@/lib/uploads';

export const runtime = 'nodejs';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const a = await requireSession();
  if ('error' in a) return a.error;
  const body = z.object({ alt: z.string().max(250) }).safeParse(await req.json().catch(() => null));
  if (!body.success) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  await exec('UPDATE media SET alt = ? WHERE id = ?', [body.data.alt, Number(params.id)]);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const a = await requireSession();
  if ('error' in a) return a.error;
  const [row] = await query<{ path: string }>('SELECT path FROM media WHERE id = ?', [Number(params.id)]);
  if (row) {
    const abs = path.join(uploadDir(), row.path);
    if (abs.startsWith(uploadDir())) await unlink(abs).catch(() => {});
    await exec('DELETE FROM media WHERE id = ?', [Number(params.id)]);
    await audit(a.session.u, 'media_delete', row.path);
  }
  return NextResponse.json({ ok: true });
}
