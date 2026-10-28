import { NextResponse } from 'next/server';
import { z } from 'zod';
import { audit, checkCredentials, startSession } from '@/lib/auth';
import { dbConfigured } from '@/lib/db';
import { ensureHomePage } from '@/cms/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Simple per-IP throttle: 8 attempts per 10 minutes. In-memory, per server process.
const attempts = new Map<string, { n: number; reset: number }>();
const WINDOW = 10 * 60 * 1000;
const MAX = 8;

export async function POST(req: Request) {
  if (!dbConfigured()) return NextResponse.json({ error: 'Database is not configured on the server.' }, { status: 503 });
  const ip = (req.headers.get('x-forwarded-for') || 'local').split(',')[0].trim();
  const now = Date.now();
  const entry = attempts.get(ip);
  if (entry && entry.reset > now && entry.n >= MAX) {
    return NextResponse.json({ error: 'Too many attempts. Try again in a few minutes.' }, { status: 429 });
  }

  const body = z.object({ username: z.string().min(1).max(64), password: z.string().min(1).max(200) }).safeParse(await req.json().catch(() => null));
  if (!body.success) return NextResponse.json({ error: 'Enter your username and password.' }, { status: 400 });

  const user = await checkCredentials(body.data.username.trim(), body.data.password);
  if (!user) {
    attempts.set(ip, { n: (entry && entry.reset > now ? entry.n : 0) + 1, reset: entry && entry.reset > now ? entry.reset : now + WINDOW });
    await audit(null, 'login_failed', body.data.username.slice(0, 64));
    return NextResponse.json({ error: 'Wrong username or password.' }, { status: 401 });
  }
  attempts.delete(ip);
  await ensureHomePage();
  const res = NextResponse.json({ ok: true, user: { username: user.username, role: user.role } });
  try {
    await startSession(res, user);
  } catch {
    return NextResponse.json({ error: 'SESSION_SECRET is not configured on the server.' }, { status: 503 });
  }
  await audit(user.username, 'login');
  return res;
}
