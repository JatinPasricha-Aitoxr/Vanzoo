import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomBytes } from 'node:crypto';
import { imageSize } from 'image-size';
import { NextResponse } from 'next/server';
import { audit, requireSession } from '@/lib/auth';
import { exec, query } from '@/lib/db';
import { ALLOWED, MAX_UPLOAD_BYTES, matchesMagic, uploadDir } from '@/lib/uploads';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const a = await requireSession();
  if ('error' in a) return a.error;
  const items = await query('SELECT id, filename, path, mime, size_bytes, width, height, alt, created_at FROM media ORDER BY id DESC LIMIT 300');
  return NextResponse.json({ items: (items as Record<string, unknown>[]).map((m) => ({ ...m, url: `/uploads/${m.path}` })) });
}

export async function POST(req: Request) {
  const a = await requireSession();
  if ('error' in a) return a.error;
  const form = await req.formData().catch(() => null);
  const file = form?.get('file');
  if (!(file instanceof File)) return NextResponse.json({ error: 'Choose an image to upload.' }, { status: 400 });
  if (file.size > MAX_UPLOAD_BYTES) return NextResponse.json({ error: 'Images must be 8 MB or smaller.' }, { status: 413 });

  const ext = (file.name.split('.').pop() || '').toLowerCase();
  const allowed = ALLOWED[ext];
  if (!allowed) return NextResponse.json({ error: 'Only JPG, PNG, WebP, GIF and AVIF images are allowed.' }, { status: 415 });
  const bytes = Buffer.from(await file.arrayBuffer());
  if (!matchesMagic(ext, bytes)) return NextResponse.json({ error: 'That file is not a valid image.' }, { status: 415 });

  let width: number | null = null;
  let height: number | null = null;
  try {
    const dim = imageSize(bytes);
    width = dim.width ?? null;
    height = dim.height ?? null;
  } catch {
    /* dimensions are optional */
  }

  const now = new Date();
  const stem = file.name.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'image';
  const rel = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${stem}-${randomBytes(4).toString('hex')}.${allowed.ext}`;
  const abs = path.join(uploadDir(), rel);
  await mkdir(path.dirname(abs), { recursive: true });
  await writeFile(abs, bytes);

  const res = await exec(
    'INSERT INTO media (filename, path, mime, size_bytes, width, height, alt, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [file.name.slice(0, 255), rel, allowed.mime, bytes.length, width, height, null, a.session.u],
  );
  await audit(a.session.u, 'media_upload', rel);
  return NextResponse.json({ ok: true, item: { id: res.insertId, filename: file.name, path: rel, url: `/uploads/${rel}`, mime: allowed.mime, width, height, alt: '' } });
}
