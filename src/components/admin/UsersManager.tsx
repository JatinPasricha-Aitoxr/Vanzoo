'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, Badge, btn, Card, input } from './ui';

type U = { id: number; username: string; role: 'admin' | 'editor'; created_at: string; last_login_at: string | null };

export function UsersManager() {
  const [users, setUsers] = useState<U[]>([]);
  const [me, setMe] = useState('');
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [f, setF] = useState({ username: '', password: '', role: 'editor' as 'admin' | 'editor' });
  const load = useCallback(async () => {
    const r = await api<{ users: U[]; me: string }>('/api/cms/users');
    if (r.error) return setMsg({ ok: false, text: r.error });
    setUsers(r.users); setMe(r.me);
  }, []);
  useEffect(() => { load(); }, [load]);
  const done = (r: { error?: string }, ok: string) => { setMsg(r.error ? { ok: false, text: r.error } : { ok: true, text: ok }); load(); };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-semibold">Users &amp; roles</h1><p className="text-sm text-[#6b7a75]">Administrators can do everything. Editors can edit pages, media and per-page SEO, but cannot change settings, redirects, users or take backups.</p></div>
      <Card title="Add a user">
        <form className="grid gap-3 lg:grid-cols-[1fr_1fr_9rem_auto]" onSubmit={async (e) => { e.preventDefault(); const r = await api('/api/cms/users', { method: 'POST', json: f }); done(r, 'User created.'); if (!r.error) setF({ username: '', password: '', role: 'editor' }); }}>
          <div><label htmlFor="u-n" className="mb-1 block text-xs font-semibold">Username</label><input id="u-n" className={input} value={f.username} onChange={(e) => setF({ ...f, username: e.target.value })} autoComplete="off" required /></div>
          <div><label htmlFor="u-p" className="mb-1 block text-xs font-semibold">Password (10+ characters)</label><input id="u-p" type="password" className={input} value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} autoComplete="new-password" required minLength={10} /></div>
          <div><label htmlFor="u-r" className="mb-1 block text-xs font-semibold">Role</label><select id="u-r" className={input} value={f.role} onChange={(e) => setF({ ...f, role: e.target.value as 'admin' | 'editor' })}><option value="editor">Editor</option><option value="admin">Administrator</option></select></div>
          <button type="submit" className={btn.gold + ' self-end'}>Add</button>
        </form>
        {msg ? <p role="status" className={`mt-3 text-sm font-medium ${msg.ok ? 'text-emerald-700' : 'text-red-700'}`}>{msg.text}</p> : null}
      </Card>
      <Card title={`Users (${users.length})`}>
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-[#6b7a75]"><tr><th className="pb-2">User</th><th className="pb-2">Role</th><th className="pb-2">Last sign-in</th><th className="pb-2" /></tr></thead>
          <tbody className="divide-y divide-[#eef2f0]">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="py-2.5 font-medium">{u.username}{u.username === me ? <span className="ml-2"><Badge tone="grey">you</Badge></span> : null}</td>
                <td className="py-2.5"><select aria-label={`Role for ${u.username}`} className={input + ' !w-36 !py-1'} value={u.role} onChange={async (e) => done(await api('/api/cms/users', { method: 'PATCH', json: { id: u.id, role: e.target.value } }), 'Role updated.')}><option value="editor">Editor</option><option value="admin">Administrator</option></select></td>
                <td className="py-2.5 text-xs text-[#6b7a75]">{u.last_login_at ? u.last_login_at.slice(0, 16).replace('T', ' ') : 'never'}</td>
                <td className="py-2.5 text-right">
                  <button type="button" className={btn.ghost + ' !px-2.5 !py-1 text-xs'} onClick={async () => { const p = prompt(`New password for ${u.username} (10+ characters):`); if (p) done(await api('/api/cms/users', { method: 'PATCH', json: { id: u.id, password: p } }), 'Password changed.'); }}>Reset password</button>{' '}
                  <button type="button" className={btn.danger + ' !px-2.5 !py-1 text-xs'} disabled={u.username === me} onClick={async () => { if (confirm(`Delete ${u.username}?`)) done(await api('/api/cms/users', { method: 'DELETE', json: { id: u.id } }), 'User deleted.'); }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
