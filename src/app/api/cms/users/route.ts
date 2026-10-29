import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { audit, requireAdmin } from '@/lib/auth';
import { exec, query } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type U = { id: number; username: string; role: 'admin' | 'editor'; created_at: string; last_login_at: string | null };

export async function GET() {
  const a = await requireAdmin();
  if ('error' in a) return a.error;
  const users = await query<U>('SELECT id, username, role, created_at, last_login_at FROM users ORDER BY id');
  return NextResponse.json({ users, me: a.session.u });
}

const Password = z.string().min(10, 'Use at least 10 characters.').max(128);
const Create = z.object({ username: z.string().regex(/^[a-z0-9._-]{3,32}$/i, 'Username: 3–32 letters, digits, . _ -'), password: Password, role: z.enum(['admin', 'editor']) });
const Patch = z.object({ id: z.number().int(), password: Password.optional(), role: z.enum(['admin', 'editor']).optional() });
const Del = z.object({ id: z.number().int() });

const adminCount = async () => Number((await query<{ n: string }>("SELECT COUNT(*) AS n FROM users WHERE role = 'admin'"))[0].n);

export async function POST(req: Request) {
  const a = await requireAdmin();
  if ('error' in a) return a.error;
  const b = Create.safeParse(await req.json().catch(() => null));
  if (!b.success) return NextResponse.json({ error: b.error.issues[0]?.message ?? 'Invalid user.' }, { status: 400 });
  if ((await query('SELECT 1 FROM users WHERE username = ?', [b.data.username])).length) return NextResponse.json({ error: 'That username is taken.' }, { status: 409 });
  await exec('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)', [b.data.username, await bcrypt.hash(b.data.password, 12), b.data.role]);
  await audit(a.session.u, 'user_create', b.data.username, { role: b.data.role });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request) {
  const a = await requireAdmin();
  if ('error' in a) return a.error;
  const b = Patch.safeParse(await req.json().catch(() => null));
  if (!b.success) return NextResponse.json({ error: b.error.issues[0]?.message ?? 'Invalid request.' }, { status: 400 });
  const [u] = await query<U>('SELECT id, username, role FROM users WHERE id = ?', [b.data.id]);
  if (!u) return NextResponse.json({ error: 'User not found.' }, { status: 404 });
  if (b.data.role && b.data.role !== u.role) {
    if (u.role === 'admin' && (await adminCount()) <= 1) return NextResponse.json({ error: 'There must be at least one administrator.' }, { status: 400 });
    await exec('UPDATE users SET role = ? WHERE id = ?', [b.data.role, u.id]);
  }
  if (b.data.password) await exec('UPDATE users SET password_hash = ? WHERE id = ?', [await bcrypt.hash(b.data.password, 12), u.id]);
  await audit(a.session.u, 'user_update', u.username, { role: b.data.role, passwordChanged: Boolean(b.data.password) });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const a = await requireAdmin();
  if ('error' in a) return a.error;
  const b = Del.safeParse(await req.json().catch(() => null));
  if (!b.success) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  const [u] = await query<U>('SELECT id, username, role FROM users WHERE id = ?', [b.data.id]);
  if (!u) return NextResponse.json({ error: 'User not found.' }, { status: 404 });
  if (u.username === a.session.u) return NextResponse.json({ error: 'You can’t delete your own account.' }, { status: 400 });
  if (u.role === 'admin' && (await adminCount()) <= 1) return NextResponse.json({ error: 'There must be at least one administrator.' }, { status: 400 });
  await exec('DELETE FROM users WHERE id = ?', [u.id]);
  await audit(a.session.u, 'user_delete', u.username);
  return NextResponse.json({ ok: true });
}
