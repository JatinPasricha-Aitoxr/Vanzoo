'use client';

import { useEffect, useState } from 'react';
import { api, Card } from './ui';

export function SettingsForm() {
  const [delhi, setDelhi] = useState<boolean | null>(null);
  const [msg, setMsg] = useState('');
  useEffect(() => {
    api<{ settings: { delhiEnabled: boolean } }>('/api/cms/settings').then((r) => (r.error ? setMsg(r.error) : setDelhi(r.settings.delhiEnabled)));
  }, []);
  async function toggle() {
    const next = !delhi;
    const r = await api<{ settings: { delhiEnabled: boolean } }>('/api/cms/settings', { method: 'PUT', json: { delhiEnabled: next } });
    if (r.error) return setMsg(r.error);
    setDelhi(r.settings.delhiEnabled);
    setMsg(next ? 'Delhi is now ON for visitors.' : 'Delhi is now OFF — the site shows Gurgaon only.');
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Site settings</h1>
        <p className="text-sm text-[#6b7a75]">Switches that change how the public website behaves.</p>
      </div>
      <Card title="Delhi">
        <div className="flex items-start justify-between gap-6">
          <p className="max-w-xl text-sm text-[#51635d]">When ON, visitors get the Gurgaon / Delhi city selector and headings follow it. When OFF, the site is Gurgaon only.</p>
          <button type="button" role="switch" aria-checked={Boolean(delhi)} aria-label="Toggle Delhi" disabled={delhi === null} onClick={toggle} className={`relative h-8 w-14 shrink-0 rounded-full transition-colors ${delhi ? 'bg-[#0A5C4B]' : 'bg-[#cfd8d4]'}`}>
            <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${delhi ? 'left-7' : 'left-1'}`} />
          </button>
        </div>
        <p className="mt-3 text-xs text-[#6b7a75]">Status: <strong>{delhi === null ? '…' : delhi ? 'ON' : 'OFF'}</strong></p>
      </Card>
      {msg ? <p role="status" className="text-sm font-medium text-[#0A5C4B]">{msg}</p> : null}
    </div>
  );
}
