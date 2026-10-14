import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getSettings, saveSettings, storageKind } from '@/lib/settings';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const COOKIE = 'vz_admin';

const password = () => process.env.ADMIN_PASSWORD ?? '';
const token = () => createHmac('sha256', password()).update('vanzoo-admin-session').digest('hex');

function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

function isAuthed(): boolean {
  if (!password()) return false;
  const value = cookies().get(COOKIE)?.value;
  return Boolean(value) && safeEqual(value!, token());
}

/** Session + settings for the admin screen. */
export async function GET() {
  return NextResponse.json({
    configured: Boolean(password()),
    authed: isAuthed(),
    storage: storageKind(),
    settings: isAuthed() ? await getSettings() : null,
  });
}

export async function POST(request: Request) {
  if (!password()) {
    return NextResponse.json({ error: 'ADMIN_PASSWORD is not set on the server.' }, { status: 503 });
  }
  let body: { action?: string; password?: string; delhiEnabled?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  if (body.action === 'login') {
    if (!safeEqual(body.password ?? '', password())) {
      return NextResponse.json({ error: 'Wrong password.' }, { status: 401 });
    }
    const response = NextResponse.json({ ok: true });
    response.cookies.set(COOKIE, token(), {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 8,
    });
    return response;
  }

  if (!isAuthed()) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });

  if (body.action === 'logout') {
    const response = NextResponse.json({ ok: true });
    response.cookies.delete(COOKIE);
    return response;
  }

  if (body.action === 'set' && typeof body.delhiEnabled === 'boolean') {
    try {
      await saveSettings({ ...(await getSettings()), delhiEnabled: body.delhiEnabled });
    } catch {
      return NextResponse.json(
        { error: 'No storage configured — add the Upstash Redis variables (see README).' },
        { status: 503 },
      );
    }
    return NextResponse.json({ ok: true, settings: await getSettings() });
  }

  return NextResponse.json({ error: 'Unknown action.' }, { status: 400 });
}
