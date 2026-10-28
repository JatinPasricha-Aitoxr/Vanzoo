import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ALLOWED, uploadDir } from '@/lib/uploads';

export const runtime = 'nodejs';

/** Serves uploaded images from UPLOAD_DIR with long-lived caching. Only known image types, never outside the folder. */
export async function GET(_req: Request, { params }: { params: { path: string[] } }) {
  const rel = params.path.join('/');
  const ext = (rel.split('.').pop() || '').toLowerCase();
  const type = ALLOWED[ext];
  const abs = path.resolve(uploadDir(), rel);
  if (!type || !abs.startsWith(uploadDir() + path.sep)) return new Response('Not found', { status: 404 });
  try {
    const data = await readFile(abs);
    return new Response(new Uint8Array(data), {
      headers: {
        'Content-Type': type.mime,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'",
      },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
