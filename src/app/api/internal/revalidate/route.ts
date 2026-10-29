import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { internalToken } from '@/lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Called by the server itself shortly after it boots (src/instrumentation-node.ts):
 * marks every page stale so HTML generated at build time — possibly before the
 * database or contact facts were available — is rebuilt from live data.
 */
export async function POST(req: Request) {
  const token = await internalToken();
  if (!token || req.headers.get('x-vz-internal') !== token) return new NextResponse('Not found', { status: 404 });
  for (const tag of ['content', 'design', 'siteconfig', 'facts', 'seo', 'posts']) revalidateTag(tag);
  revalidatePath('/', 'layout');
  return NextResponse.json({ ok: true });
}
