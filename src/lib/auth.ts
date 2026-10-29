import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { exec, query } from './db';
import { SESSION_COOKIE, SESSION_TTL_SECONDS, signSession, verifySession, type Session } from './session';

/** The signed-in user for this request, or null. */
export async function getSession(): Promise<Session | null> {
  return verifySession(cookies().get(SESSION_COOKIE)?.value);
}

/** For API handlers: returns the session or a 401 response. */
export async function requireSession(): Promise<{ session: Session } | { error: NextResponse }> {
  const session = await getSession();
  if (!session) return { error: NextResponse.json({ error: 'Not signed in.' }, { status: 401 }) };
  return { session };
}

/** Like requireSession, but the user must currently be an admin (checked against the DB, so demotions apply immediately). */
export async function requireAdmin(): Promise<{ session: Session } | { error: NextResponse }> {
  const a = await requireSession();
  if ('error' in a) return a;
  const rows = await query<{ role: string }>('SELECT role FROM users WHERE username = ? LIMIT 1', [a.session.u]).catch(() => []);
  if (rows[0]?.role !== 'admin') return { error: NextResponse.json({ error: 'Administrator access required.' }, { status: 403 }) };
  return a;
}

/** Constant-time-ish credential check; a missing user still runs one bcrypt compare. */
export async function checkCredentials(username: string, password: string) {
  const rows = await query<{ id: number; username: string; password_hash: string; role: 'admin' | 'editor' }>(
    'SELECT id, username, password_hash, role FROM users WHERE username = ? LIMIT 1',
    [username],
  );
  const user = rows[0];
  const ok = await bcrypt.compare(password, user?.password_hash ?? '$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidinva');
  if (!user || !ok) return null;
  await exec('UPDATE users SET last_login_at = NOW() WHERE id = ?', [user.id]);
  return user;
}

export async function startSession(res: NextResponse, user: { username: string; role: 'admin' | 'editor' }) {
  res.cookies.set(SESSION_COOKIE, await signSession({ u: user.username, r: user.role }), {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function audit(actor: string | null, action: string, target?: string, detail?: unknown) {
  try {
    await exec('INSERT INTO audit_log (actor, action, target, detail) VALUES (?, ?, ?, ?)', [
      actor,
      action,
      target ?? null,
      detail === undefined ? null : JSON.stringify(detail),
    ]);
  } catch {
    /* auditing must never break an action */
  }
}
