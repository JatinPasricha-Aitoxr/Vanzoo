'use client';

import { useCallback, useEffect, useState } from 'react';

type State = {
  configured: boolean;
  authed: boolean;
  storage: 'redis' | 'file' | 'none';
  settings: { delhiEnabled: boolean } | null;
};

async function call(method: 'GET' | 'POST', body?: unknown) {
  const response = await fetch('/api/admin/', {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  return { ok: response.ok, data: await response.json() };
}

export default function AdminPage() {
  const [state, setState] = useState<State | null>(null);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    const { data } = await call('GET');
    setState(data);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    const { ok, data } = await call('POST', { action: 'login', password });
    setBusy(false);
    if (!ok) return setMessage(data.error ?? 'Could not sign in.');
    setPassword('');
    refresh();
  }

  async function setDelhi(delhiEnabled: boolean) {
    setBusy(true);
    setMessage('');
    const { ok, data } = await call('POST', { action: 'set', delhiEnabled });
    setBusy(false);
    if (!ok) return setMessage(data.error ?? 'Could not save.');
    setMessage(delhiEnabled ? 'Delhi is now ON for visitors.' : 'Delhi is now OFF — the site shows Gurgaon only.');
    refresh();
  }

  async function logout() {
    await call('POST', { action: 'logout' });
    refresh();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-16">
      <h1 className="font-display text-3xl font-semibold">Vanzoo admin</h1>

      {!state ? (
        <p className="mt-6 text-neutral-body">Loading…</p>
      ) : !state.configured ? (
        <p className="mt-6 rounded-card border border-accent-gold bg-accent-gold/10 p-4 text-sm">
          Set the <code>ADMIN_PASSWORD</code> environment variable on the server, then reload this page.
        </p>
      ) : !state.authed ? (
        <form onSubmit={login} className="mt-6 space-y-4">
          <label className="block text-sm font-medium" htmlFor="pw">
            Password
          </label>
          <input
            id="pw"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="h-11 w-full rounded-pill border border-neutral-line px-4"
          />
          <button type="submit" disabled={busy} className="btn-primary btn-md w-full">
            Sign in
          </button>
        </form>
      ) : (
        <div className="mt-6 space-y-6">
          <section className="rounded-card border border-neutral-line bg-white p-5 shadow-lift">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-lg font-semibold">Delhi</h2>
                <p className="mt-1 text-sm text-neutral-body">
                  When ON, visitors get the Gurgaon / Delhi city selector and headings follow it. When OFF the
                  site is Gurgaon only.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={state.settings?.delhiEnabled ?? false}
                disabled={busy}
                onClick={() => setDelhi(!(state.settings?.delhiEnabled ?? false))}
                className={`relative h-8 w-14 shrink-0 rounded-full transition-colors ${
                  state.settings?.delhiEnabled ? 'bg-brand' : 'bg-neutral-line'
                }`}
              >
                <span
                  className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${
                    state.settings?.delhiEnabled ? 'left-7' : 'left-1'
                  }`}
                />
                <span className="sr-only">Toggle Delhi</span>
              </button>
            </div>
            <p className="mt-4 text-xs text-neutral-body">
              Status: <strong>{state.settings?.delhiEnabled ? 'ON' : 'OFF'}</strong> · Storage: {state.storage}
              {state.storage === 'none' ? ' (add Upstash Redis variables — changes cannot be saved)' : ''}
            </p>
          </section>
          <button type="button" onClick={logout} className="btn-secondary btn-md">
            Sign out
          </button>
        </div>
      )}

      {message ? (
        <p role="status" className="mt-6 text-sm font-medium text-brand">
          {message}
        </p>
      ) : null}
    </main>
  );
}
