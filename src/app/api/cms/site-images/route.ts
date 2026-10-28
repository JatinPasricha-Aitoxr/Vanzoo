import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Lists the photos that ship with the site (public/images) so they can be reused in the builder. */
async function walk(dir: string, base: string, out: string[]) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (out.length >= 600) return;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await walk(p, base, out);
    else if (/\.(jpe?g|png|webp|avif)$/i.test(e.name)) out.push('/images/' + path.relative(base, p).split(path.sep).join('/'));
  }
}

export async function GET() {
  const a = await requireSession();
  if ('error' in a) return a.error;
  const base = path.join(process.cwd(), 'public', 'images');
  const out: string[] = [];
  await walk(base, base, out).catch(() => {});
  return NextResponse.json({ items: out.filter((p) => !p.startsWith('/images/icons/') && !p.startsWith('/images/brand/')) });
}
