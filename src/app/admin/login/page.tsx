'use client';

import { useState } from 'react';
import { api, btn, input } from '@/components/admin/ui';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const r = await api('/api/cms/auth/login', { method: 'POST', json: { username, password } });
    setBusy(false);
    if (r.error) return setError(r.error);
    window.location.href = '/admin';
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-5">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-[#e0e8e5] bg-white p-7 shadow-lg" aria-labelledby="login-title">
        <h1 id="login-title" className="font-display text-2xl font-semibold">Vanzoo Admin</h1>
        <p className="mt-1 text-sm text-[#6b7a75]">Sign in to manage the website.</p>
        <label htmlFor="u" className="mb-1 mt-6 block text-sm font-medium">Username</label>
        <input id="u" className={input} value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" autoFocus />
        <label htmlFor="p" className="mb-1 mt-4 block text-sm font-medium">Password</label>
        <input id="p" type="password" className={input} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        {error ? <p role="alert" className="mt-3 text-sm font-medium text-red-700">{error}</p> : null}
        <button type="submit" disabled={busy} className={btn.primary + ' mt-6 w-full'}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </main>
  );
}
