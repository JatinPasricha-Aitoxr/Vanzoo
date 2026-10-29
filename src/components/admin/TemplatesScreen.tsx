'use client';

import { useEffect, useState } from 'react';
import { api, Badge, btn, Card } from './ui';

type Slot = { slot: string; label: string; vars: string[]; where: string; id: number | null; status: 'draft' | 'published' | null };

export function TemplatesScreen() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [msg, setMsg] = useState('');
  useEffect(() => { api<{ slots: Slot[] }>('/api/cms/templates').then((r) => (r.error ? setMsg(r.error) : setSlots(r.slots))); }, []);
  const open = async (s: Slot) => {
    const r = await api<{ id: number }>('/api/cms/templates', { method: 'POST', json: { slot: s.slot } });
    if (r.error) return setMsg(r.error);
    window.location.href = `/admin/editor/${r.id}/`;
  };
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-semibold">Detail-page templates</h1><p className="max-w-2xl text-sm text-[#6b7a75]">Services, garment pages, locality pages and blog posts are generated from data. Build extra sections here — a call-to-action, an FAQ, a banner — and they are added to the end of <em>every</em> page of that kind. Use placeholders like <code>{'{{title}}'}</code> in any text; they are filled in for each page.</p></div>
      {msg ? <p role="alert" className="text-sm font-medium text-red-700">{msg}</p> : null}
      <div className="grid gap-4 md:grid-cols-2">
        {slots.map((s) => (
          <Card key={s.slot} title={s.label} actions={s.status ? <Badge tone={s.status === 'published' ? 'green' : 'gold'}>{s.status}</Badge> : <Badge tone="grey">not set up</Badge>}>
            <p className="text-sm text-[#51635d]">{s.where}.</p>
            <p className="mt-2 text-xs text-[#6b7a75]">Placeholders: {s.vars.map((v) => <code key={v} className="mr-1 rounded bg-[#eef3f1] px-1">{`{{${v}}}`}</code>)}</p>
            <div className="mt-4"><button type="button" className={btn.primary} onClick={() => open(s)}>{s.id ? 'Edit in the builder' : 'Set up'}</button></div>
          </Card>
        ))}
      </div>
    </div>
  );
}
