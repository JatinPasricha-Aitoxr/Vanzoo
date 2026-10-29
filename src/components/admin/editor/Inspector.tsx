'use client';

import { useState } from 'react';
import type { Block, Device, Style } from '@/cms/schema';
import { WIDGET_MAP, type Field } from '@/cms/widgetDefs';
import { MediaPickerModal } from '../MediaPicker';
import { btn, input } from '../ui';

type Props = {
  block: Block;
  device: Device;
  onChange: (next: Block) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onSaveSection?: () => void;
};

const label = 'mb-1 block text-xs font-semibold text-[#51635d]';

/** Right-hand properties panel: Content, Style (per device) and Advanced. */
export function Inspector({ block, device, onChange, onDelete, onDuplicate, onSaveSection }: Props) {
  const [tab, setTab] = useState<'content' | 'style' | 'advanced'>('content');
  const def = WIDGET_MAP[block.type];

  const setProp = (key: string, value: unknown) => onChange({ ...block, props: { ...block.props, [key]: value } });

  const styleFor = (d: Device): Style => (d === 'desktop' ? block.style : block.responsive?.[d] ?? {});
  const setStyle = (key: string, value: string) => {
    const cur = { ...styleFor(device) };
    if (value === '') delete cur[key];
    else cur[key] = value;
    if (device === 'desktop') onChange({ ...block, style: cur });
    else onChange({ ...block, responsive: { ...block.responsive, [device]: cur } });
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-[#e0e8e5] px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7a75]">{def?.category}</p>
        <h2 className="text-base font-semibold">{def?.label ?? block.type}</h2>
        <div className="mt-2 flex gap-2">
          <button type="button" className={btn.ghost + ' !px-2 !py-1 text-xs'} onClick={onDuplicate}>Duplicate</button>
          {onSaveSection ? <button type="button" className={btn.ghost + ' !px-2 !py-1 text-xs'} onClick={onSaveSection}>Save as section</button> : null}
          <button type="button" className={btn.danger + ' !px-2 !py-1 text-xs'} onClick={onDelete}>Delete</button>
        </div>
      </div>
      <div className="flex border-b border-[#e0e8e5]" role="tablist">
        {(['content', 'style', 'advanced'] as const).map((t) => (
          <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`flex-1 px-3 py-2.5 text-sm font-medium capitalize ${tab === t ? 'border-b-2 border-[#0A5C4B] text-[#0A5C4B]' : 'text-[#6b7a75] hover:text-neutral-ink'}`}>
            {t}
          </button>
        ))}
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {tab === 'content' ? (
          def?.fields.length ? (
            def.fields.map((f) => <FieldInput key={f.key} field={f} value={block.props[f.key]} onChange={(v) => setProp(f.key, v)} />)
          ) : (
            <p className="text-sm text-[#6b7a75]">This section has no editable text. Use the Style and Advanced tabs, or move, hide or duplicate it.</p>
          )
        ) : null}
        {tab === 'style' ? <StylePanel device={device} style={styleFor(device)} base={block.style} setStyle={setStyle} /> : null}
        {tab === 'advanced' ? <AdvancedPanel block={block} onChange={onChange} /> : null}
      </div>
    </div>
  );
}

export function FieldInput({ field, value, onChange }: { field: Field; value: unknown; onChange: (v: unknown) => void }) {
  const [picking, setPicking] = useState(false);
  const id = `f-${field.key}`;
  const v = value ?? '';
  return (
    <div>
      <label htmlFor={id} className={label}>{field.label}</label>
      {field.type === 'text' || field.type === 'link' ? (
        <input id={id} className={input} value={String(v)} placeholder={field.type === 'link' ? 'https://… or /page/' : field.placeholder} onChange={(e) => onChange(e.target.value)} />
      ) : null}
      {field.type === 'textarea' ? <textarea id={id} rows={5} className={input} value={String(v)} onChange={(e) => onChange(e.target.value)} /> : null}
      {field.type === 'number' ? <input id={id} type="number" className={input} value={String(v)} onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))} /> : null}
      {field.type === 'select' ? (
        <select id={id} className={input} value={String(v)} onChange={(e) => onChange(e.target.value)}>
          {field.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : null}
      {field.type === 'checkbox' ? (
        <label className="flex items-center gap-2 text-sm">
          <input id={id} type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-[#0A5C4B]" /> Enabled
        </label>
      ) : null}
      {field.type === 'image' ? (
        <div className="space-y-2">
          {v ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={String(v)} alt="" className="h-28 w-full rounded-lg border border-[#e0e8e5] object-cover" />
          ) : null}
          <input id={id} className={input} value={String(v)} placeholder="/images/… or /uploads/…" onChange={(e) => onChange(e.target.value)} />
          <button type="button" className={btn.ghost} onClick={() => setPicking(true)}>Choose from library…</button>
          {picking ? <MediaPickerModal onClose={() => setPicking(false)} onPick={(m) => onChange(m.url)} /> : null}
        </div>
      ) : null}
      {field.type === 'lines' ? <textarea id={id} rows={5} className={input} value={Array.isArray(value) ? (value as string[]).join('\n') : ''} onChange={(e) => onChange(e.target.value.split('\n'))} /> : null}
      {field.type === 'list' ? <ListField field={field} value={value} onChange={onChange} /> : null}
      {field.hint ? <p className="mt-1 text-xs text-[#6b7a75]">{field.hint}</p> : null}
    </div>
  );
}

/** Repeater: an ordered list of small records (FAQ entries, quotes, cards, price rows). */
function ListField({ field, value, onChange }: { field: Field; value: unknown; onChange: (v: unknown) => void }) {
  const rows = (Array.isArray(value) ? value : []) as Record<string, unknown>[];
  const update = (next: Record<string, unknown>[]) => onChange(next);
  const move = (i: number, d: number) => { const n = [...rows]; const j = i + d; if (j < 0 || j >= n.length) return; [n[i], n[j]] = [n[j], n[i]]; update(n); };
  const blank = Object.fromEntries((field.itemFields ?? []).map((f) => [f.key, '']));
  return (
    <div className="space-y-3">
      {rows.map((row, i) => (
        <fieldset key={i} className="space-y-2 rounded-lg border border-[#e0e8e5] bg-[#f9fbfa] p-3">
          <legend className="px-1 text-xs font-semibold text-[#51635d]">{field.itemLabel ?? 'Item'} {i + 1}</legend>
          {(field.itemFields ?? []).map((f) => (
            <FieldInput key={f.key} field={{ ...f, key: `${field.key}-${i}-${f.key}` }} value={row[f.key]} onChange={(v) => update(rows.map((r, k) => (k === i ? { ...r, [f.key]: v } : r)))} />
          ))}
          <div className="flex gap-1">
            <button type="button" className={btn.ghost + ' !px-2 !py-1 text-xs'} aria-label="Move up" onClick={() => move(i, -1)}>↑</button>
            <button type="button" className={btn.ghost + ' !px-2 !py-1 text-xs'} aria-label="Move down" onClick={() => move(i, 1)}>↓</button>
            <button type="button" className={btn.danger + ' !px-2 !py-1 text-xs'} onClick={() => update(rows.filter((_, k) => k !== i))}>Remove</button>
          </div>
        </fieldset>
      ))}
      {rows.length < (field.max ?? 20) ? <button type="button" className={btn.ghost + ' w-full'} onClick={() => update([...rows, { ...blank }])}>+ Add {(field.itemLabel ?? 'item').toLowerCase()}</button> : null}
    </div>
  );
}

const TOKENS = [
  ['', 'Default'],
  ['0', '0'], ['8px', '8px'], ['16px', '16px'], ['24px', '24px'], ['32px', '32px'], ['48px', '48px'], ['64px', '64px'], ['96px', '96px'],
];

function Prop({ k, label: l, style, base, set, children }: { k: string; label: string; style: Style; base: Style; set: (k: string, v: string) => void; children?: React.ReactNode }) {
  const own = style[k] ?? '';
  const inherited = !own && base[k] ? base[k] : '';
  return (
    <div>
      <label htmlFor={`s-${k}`} className={label + ' flex items-center justify-between'}>
        <span>{l}</span>
        {own ? <button type="button" className="font-normal text-[#0A5C4B] hover:underline" onClick={() => set(k, '')}>Reset</button> : null}
      </label>
      {children ?? <input id={`s-${k}`} className={input} value={own} placeholder={inherited || 'Default'} onChange={(e) => set(k, e.target.value)} />}
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details open className="rounded-lg border border-[#e0e8e5]">
      <summary className="cursor-pointer select-none px-3 py-2 text-sm font-semibold">{title}</summary>
      <div className="space-y-3 border-t border-[#eef2f0] p-3">{children}</div>
    </details>
  );
}

const SelectProp = ({ k, label: l, options, style, base, set }: { k: string; label: string; options: string[]; style: Style; base: Style; set: (k: string, v: string) => void }) => (
  <Prop k={k} label={l} style={style} base={base} set={set}>
    <select id={`s-${k}`} className={input} value={style[k] ?? ''} onChange={(e) => set(k, e.target.value)}>
      <option value="">{base[k] && !style[k] ? `Inherit (${base[k]})` : 'Default'}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  </Prop>
);

function StylePanel({ device, style, base, setStyle }: { device: Device; style: Style; base: Style; setStyle: (k: string, v: string) => void }) {
  const p = { style, base: device === 'desktop' ? {} : base, set: setStyle };
  return (
    <div className="space-y-3">
      <p className="rounded-lg bg-[#eef6f3] px-3 py-2 text-xs text-[#245b4d]">
        {device === 'desktop' ? 'Editing desktop styles — these apply everywhere unless a tablet or mobile value overrides them.' : `Editing ${device} overrides only — desktop is unchanged. Blank = use the desktop value.`}
      </p>
      <Group title="Layout">
        <SelectProp k="display" label="Display" options={['block', 'flex', 'grid', 'none']} {...p} />
        <SelectProp k="flexDirection" label="Flex direction" options={['row', 'column', 'row-reverse', 'column-reverse']} {...p} />
        <SelectProp k="alignItems" label="Align items" options={['stretch', 'flex-start', 'center', 'flex-end']} {...p} />
        <SelectProp k="justifyContent" label="Justify" options={['flex-start', 'center', 'flex-end', 'space-between', 'space-around']} {...p} />
        <Prop k="gap" label="Gap" {...p} />
        <Prop k="gridTemplateColumns" label="Grid columns" {...p} />
        <Prop k="width" label="Width" {...p} />
        <Prop k="maxWidth" label="Max width" {...p} />
        <Prop k="minHeight" label="Min height" {...p} />
      </Group>
      <Group title="Spacing">
        <div className="grid grid-cols-2 gap-2">
          {(['Top', 'Right', 'Bottom', 'Left'] as const).map((s) => (
            <Prop key={'m' + s} k={'margin' + s} label={'Margin ' + s.toLowerCase()} {...p} />
          ))}
          {(['Top', 'Right', 'Bottom', 'Left'] as const).map((s) => (
            <Prop key={'p' + s} k={'padding' + s} label={'Padding ' + s.toLowerCase()} {...p} />
          ))}
        </div>
        <p className="text-xs text-[#6b7a75]">Use values like {TOKENS.slice(1, 5).map((t) => t[1]).join(', ')}, or rem / %.</p>
      </Group>
      <Group title="Typography">
        <SelectProp k="fontFamily" label="Font" options={['site-display', 'site-sans']} {...p} />
        <div className="grid grid-cols-2 gap-2">
          <Prop k="fontSize" label="Size" {...p} />
          <SelectProp k="fontWeight" label="Weight" options={['300', '400', '500', '600', '700', '800']} {...p} />
          <Prop k="lineHeight" label="Line height" {...p} />
          <Prop k="letterSpacing" label="Letter spacing" {...p} />
        </div>
        <SelectProp k="textAlign" label="Alignment" options={['left', 'center', 'right', 'justify']} {...p} />
        <SelectProp k="textTransform" label="Case" options={['none', 'uppercase', 'lowercase', 'capitalize']} {...p} />
        <SelectProp k="textDecoration" label="Decoration" options={['none', 'underline', 'line-through']} {...p} />
        <ColorProp k="color" label="Text colour" {...p} />
      </Group>
      <Group title="Background">
        <ColorProp k="backgroundColor" label="Colour" {...p} />
        <Prop k="backgroundImage" label="Image (url(/uploads/… or /images/…))" {...p} />
        <SelectProp k="backgroundSize" label="Size" options={['cover', 'contain', 'auto']} {...p} />
        <Prop k="backgroundPosition" label="Position" {...p} />
        <SelectProp k="backgroundRepeat" label="Repeat" options={['no-repeat', 'repeat', 'repeat-x', 'repeat-y']} {...p} />
      </Group>
      <Group title="Border & effects">
        <div className="grid grid-cols-2 gap-2">
          <Prop k="borderWidth" label="Border width" {...p} />
          <SelectProp k="borderStyle" label="Border style" options={['solid', 'dashed', 'dotted', 'none']} {...p} />
        </div>
        <ColorProp k="borderColor" label="Border colour" {...p} />
        <Prop k="borderRadius" label="Radius" {...p} />
        <Prop k="boxShadow" label="Shadow (e.g. 0 8px 24px rgba(0,0,0,.15))" {...p} />
        <Prop k="opacity" label="Opacity (0–1)" {...p} />
        <SelectProp k="overflow" label="Overflow" options={['visible', 'hidden', 'auto']} {...p} />
      </Group>
    </div>
  );
}

function ColorProp({ k, label: l, style, base, set }: { k: string; label: string; style: Style; base: Style; set: (k: string, v: string) => void }) {
  const val = style[k] ?? '';
  const hex = /^#[0-9a-fA-F]{6}$/.test(val) ? val : '#000000';
  return (
    <Prop k={k} label={l} style={style} base={base} set={set}>
      <div className="flex gap-2">
        <input type="color" aria-label={`${l} picker`} value={hex} onChange={(e) => set(k, e.target.value)} className="h-9 w-12 cursor-pointer rounded border border-[#cfd8d4] bg-white" />
        <input id={`s-${k}`} className={input} value={val} placeholder={base[k] || '#0a5c4b or rgb(…)'} onChange={(e) => set(k, e.target.value)} />
      </div>
    </Prop>
  );
}

function AdvancedPanel({ block, onChange }: { block: Block; onChange: (b: Block) => void }) {
  const hidden = block.hidden ?? {};
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="adv-class" className={label}>CSS class(es)</label>
        <input id="adv-class" className={input} value={block.className ?? ''} onChange={(e) => onChange({ ...block, className: e.target.value.replace(/[^A-Za-z0-9 _-]/g, '') })} />
        <p className="mt-1 text-xs text-[#6b7a75]">Letters, numbers, - and _ only. Existing site classes (e.g. Tailwind utilities) work here.</p>
      </div>
      <div>
        <label htmlFor="adv-aria" className={label}>Accessible label (aria-label)</label>
        <input id="adv-aria" className={input} value={block.ariaLabel ?? ''} onChange={(e) => onChange({ ...block, ariaLabel: e.target.value })} />
      </div>
      <fieldset>
        <legend className={label}>Hide on</legend>
        {(['desktop', 'tablet', 'mobile'] as const).map((d) => (
          <label key={d} className="mr-4 inline-flex items-center gap-2 text-sm capitalize">
            <input type="checkbox" className="h-4 w-4 accent-[#0A5C4B]" checked={Boolean(hidden[d])} onChange={(e) => onChange({ ...block, hidden: { ...hidden, [d]: e.target.checked } })} /> {d}
          </label>
        ))}
      </fieldset>
      <p className="break-all text-xs text-[#6b7a75]">Block id: {block.id}</p>
    </div>
  );
}
